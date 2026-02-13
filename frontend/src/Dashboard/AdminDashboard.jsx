import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login/admin');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      navigate('/login/admin');
      return;
    }

    setUser(parsedUser);
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        api.get('/api/admin/dashboard-stats'),
        api.get('/api/admin/pending-products?limit=10')
      ]);
      setStats(statsRes.data);
      setPendingProducts(pendingRes.data.products);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    setActionLoading({ ...actionLoading, [productId]: 'approving' });
    try {
      await api.post(`/api/admin/products/${productId}/approve`);
      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving product:', error);
      alert('Failed to approve product. Please try again.');
    } finally {
      setActionLoading({ ...actionLoading, [productId]: null });
    }
  };

  const openRejectModal = (product) => {
    setSelectedProduct(product);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setActionLoading({ ...actionLoading, [selectedProduct._id]: 'rejecting' });
    try {
      await api.post(`/api/admin/products/${selectedProduct._id}/reject`, {
        reason: rejectionReason
      });
      setShowRejectModal(false);
      setSelectedProduct(null);
      setRejectionReason('');
      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting product:', error);
      alert('Failed to reject product. Please try again.');
    } finally {
      setActionLoading({ ...actionLoading, [selectedProduct._id]: null });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🔓</span>
            <span className="logo-text">Setu Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active" onClick={() => navigate('/dashboard/admin')}>
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item" onClick={() => navigate('/document-approval')}>
            <span className="nav-icon">📄</span>
            <span>Document Approval</span>
          </a>
          <a href="#" className="nav-item" onClick={() => navigate('/admin/pending-products')}>
            <span className="nav-icon">⏳</span>
            <span>Pending Approvals</span>
            {stats?.overview.pendingProducts > 0 && (
              <span className="nav-badge">{stats.overview.pendingProducts}</span>
            )}
          </a>
          <a href="#" className="nav-item" onClick={() => navigate('/admin/all-products')}>
            <span className="nav-icon">📦</span>
            <span>All Products</span>
          </a>
          <a href="#" className="nav-item" onClick={() => navigate('/admin/users')}>
            <span className="nav-icon">👥</span>
            <span>Users</span>
          </a>
          <a href="#" className="nav-item" onClick={() => navigate('/admin/analytics')}>
            <span className="nav-icon">📊</span>
            <span>Analytics</span>
          </a>
          <a href="#" className="nav-item" onClick={() => navigate('/admin/settings')}>
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Manage product approvals and platform operations</p>
          </div>
          <div className="header-actions">
            <button className="header-btn">
              <span>🔔</span>
            </button>
            <div className="user-profile">
              <div className="profile-avatar admin">{user.name.charAt(0).toUpperCase()}</div>
              <div className="profile-info">
                <div className="profile-name">{user.name}</div>
                <div className="profile-role">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon admin pending">⏳</div>
            <div className="stat-info">
              <div className="stat-value">{stats?.overview.pendingProducts || 0}</div>
              <div className="stat-label">Pending Approval</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon admin approved">✅</div>
            <div className="stat-info">
              <div className="stat-value">{stats?.overview.approvedProducts || 0}</div>
              <div className="stat-label">Approved Products</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon admin total">📦</div>
            <div className="stat-info">
              <div className="stat-value">{stats?.overview.totalProducts || 0}</div>
              <div className="stat-label">Total Products</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon admin users">👥</div>
            <div className="stat-info">
              <div className="stat-value">{stats?.users?.totalUsers || 0}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions-grid">
            <div className="action-card">
              <div className="action-icon">⏳</div>
              <h3>Review Pending</h3>
              <p>{stats?.overview.pendingProducts || 0} products awaiting approval</p>
              <button className="action-btn admin-btn" onClick={() => navigate('/admin/pending-products')}>
                Review Now
              </button>
            </div>
            <div className="action-card">
              <div className="action-icon">📊</div>
              <h3>View Analytics</h3>
              <p>Track platform performance and metrics</p>
              <button className="action-btn admin-btn" onClick={() => navigate('/admin/analytics')}>
                View Report
              </button>
            </div>
            <div className="action-card">
              <div className="action-icon">👥</div>
              <h3>Manage Users</h3>
              <p>View and manage agencies and customers</p>
              <button className="action-btn admin-btn" onClick={() => navigate('/admin/users')}>
                Manage Users
              </button>
            </div>
          </div>
        </section>

        {/* Pending Products Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Products Awaiting Approval</h2>
            <button className="view-all-btn" onClick={() => navigate('/admin/pending-products')}>
              View All →
            </button>
          </div>
          <div className="listings-table">
            {loading ? (
              <div className="table-loading">Loading...</div>
            ) : pendingProducts.length > 0 ? (
              <div className="products-list">
                {pendingProducts.map((product) => (
                  <div key={product._id} className="product-list-item admin-list-item">
                    <div className="product-image-thumb">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.title} />
                      ) : (
                        <div className="no-image">📷</div>
                      )}
                    </div>
                    <div className="product-info">
                      <h4>{product.title}</h4>
                      <p className="product-meta">
                        {product.category} • {product.agencyName} • Submitted on {formatDate(product.createdAt)}
                      </p>
                    </div>
                    <div className="product-price">₹{product.sellingPrice.toLocaleString()}</div>
                    <div className="product-actions admin-actions">
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(product._id)}
                        disabled={actionLoading[product._id]}
                      >
                        {actionLoading[product._id] === 'approving' ? 'Approving...' : '✓ Approve'}
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => openRejectModal(product)}
                        disabled={actionLoading[product._id]}
                      >
                        {actionLoading[product._id] === 'rejecting' ? 'Rejecting...' : '✕ Reject'}
                      </button>
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/admin/product/${product._id}`)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-empty">
                <div className="empty-icon">✅</div>
                <h3>All caught up!</h3>
                <p>No products pending approval at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Additional Stats */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Platform Overview</h2>
          </div>
          <div className="performance-grid">
            <div className="performance-card">
              <h4>Agencies</h4>
              <div className="performance-value">{stats?.users?.totalAgencies || 0}</div>
              <div className="performance-change positive">Registered agencies</div>
            </div>
            <div className="performance-card">
              <h4>Customers</h4>
              <div className="performance-value">{stats?.users?.totalCustomers || 0}</div>
              <div className="performance-change positive">Registered customers</div>
            </div>
            <div className="performance-card">
              <h4>Rejected Products</h4>
              <div className="performance-value">{stats?.overview?.rejectedProducts || 0}</div>
              <div className="performance-change neutral">Total rejected</div>
            </div>
            <div className="performance-card">
              <h4>Sold Products</h4>
              <div className="performance-value">{stats?.overview?.soldProducts || 0}</div>
              <div className="performance-change positive">Completed sales</div>
            </div>
          </div>
        </section>
      </main>

      {/* Reject Modal */}
      {showRejectModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reject Product</h3>
            <p className="modal-product-name">{selectedProduct.title}</p>
            <div className="form-group">
              <label htmlFor="rejectionReason">Rejection Reason <span className="required">*</span></label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason for rejection. This will be visible to the agency."
                rows={4}
                required
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowRejectModal(false)}>
                Cancel
              </button>
              <button
                className="confirm-reject-btn"
                onClick={handleReject}
                disabled={!rejectionReason.trim() || actionLoading[selectedProduct._id]}
              >
                {actionLoading[selectedProduct._id] === 'rejecting' ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
