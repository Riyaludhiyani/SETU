import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const AgencyDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login/agency');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'agency') {
      navigate('/login/agency');
      return;
    }

    setUser(parsedUser);
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, productsRes] = await Promise.all([
        api.get('/api/products/analytics'),
        api.get('/api/products/my-products')
      ]);
      setAnalytics(analyticsRes.data);
      setRecentProducts(productsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar agency-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🔓</span>
            <span className="logo-text">Setu</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active" onClick={() => navigate('/dashboard/agency')}>
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item" onClick={() => navigate('/upload-documents')}>
            <span className="nav-icon">📄</span>
            <span>Documents</span>
          </a>
          <a href="#" className="nav-item" onClick={() => navigate('/my-products')}>
            <span className="nav-icon">📦</span>
            <span>My Products</span>
          </a>
          <a href="#" className="nav-item" onClick={() => navigate('/add-product')}>
            <span className="nav-icon">➕</span>
            <span>Add Product</span>
          </a>
          <a href="#" className="nav-item" onClick={() => navigate('/analytics')}>
            <span className="nav-icon">📊</span>
            <span>Analytics</span>
          </a>
          <a href="#" className="nav-item" onClick={() => navigate('/messages')}>
            <span className="nav-icon">💬</span>
            <span>Messages</span>
          </a>
          <a href="#" className="nav-item" onClick={() => navigate('/settings')}>
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </a>
          <a href="#" className="nav-item" onClick={() => navigate('/support')}>
            <span className="nav-icon">❓</span>
            <span>Support</span>
          </a>
          <a href="#" className="nav-item" onClick={() => navigate('/contact')}>
            <span className="nav-icon">📞</span>
            <span>Contact Us</span>
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
            <h1>Agency Portal - {user.name}</h1>
            <p>Manage your listings and track performance</p>
          </div>
          <div className="header-actions">
            <button className="header-btn">
              <span>🔔</span>
            </button>
            <div className="user-profile">
              <div className="profile-avatar agency">{user.name.charAt(0).toUpperCase()}</div>
              <div className="profile-info">
                <div className="profile-name">{user.name}</div>
                <div className="profile-role">Agency</div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon agency">📦</div>
            <div className="stat-info">
              <div className="stat-value">{analytics?.overview.approvedProducts || 0}</div>
              <div className="stat-label">Active Listings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon agency">💰</div>
            <div className="stat-info">
              <div className="stat-value">₹{analytics?.overview.totalRevenue.toLocaleString() || 0}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon agency">⏳</div>
            <div className="stat-info">
              <div className="stat-value">{analytics?.overview.pendingProducts || 0}</div>
              <div className="stat-label">Pending Approval</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon agency">✅</div>
            <div className="stat-info">
              <div className="stat-value">{analytics?.overview.soldProducts || 0}</div>
              <div className="stat-label">Completed Sales</div>
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
              <div className="action-icon">➕</div>
              <h3>Add New Product</h3>
              <p>List seized goods for auction</p>
              <button className="action-btn agency-btn" onClick={() => navigate('/add-product')}>Add Product</button>
            </div>
            <div className="action-card">
              <div className="action-icon">📊</div>
              <h3>View Analytics</h3>
              <p>Track your performance metrics</p>
              <button className="action-btn agency-btn" onClick={() => navigate('/analytics')}>View Report</button>
            </div>
            <div className="action-card">
              <div className="action-icon">📝</div>
              <h3>Pending Approvals</h3>
              <p>Review items waiting for approval</p>
              <button className="action-btn agency-btn" onClick={() => navigate('/my-products')}>View Queue</button>
            </div>
          </div>
        </section>

        {/* Recent Listings */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Recent Listings</h2>
            <button className="view-all-btn" onClick={() => navigate('/my-products')}>View All →</button>
          </div>
          <div className="listings-table">
            {loading ? (
              <div className="table-loading">Loading...</div>
            ) : recentProducts.length > 0 ? (
              <div className="products-list">
                {recentProducts.map((product) => (
                  <div key={product._id} className="product-list-item">
                    <div className="product-info">
                      <h4>{product.title}</h4>
                      <p className="product-category">{product.category}</p>
                    </div>
                    <div className="product-price">₹{product.sellingPrice.toLocaleString()}</div>
                    <div className={`product-status ${product.status}`}>{product.status}</div>
                    <div className="product-actions">
                      <button onClick={() => navigate('/my-products')} className="view-btn">View</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-empty">
                <div className="empty-icon">📦</div>
                <h3>No listings yet</h3>
                <p>Start by adding your first product to the marketplace</p>
                <button className="cta-btn agency" onClick={() => navigate('/add-product')}>Add First Product</button>
              </div>
            )}
          </div>
        </section>

        {/* Performance Overview */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Performance Overview</h2>
          </div>
          <div className="performance-grid">
            <div className="performance-card">
              <h4>Total Revenue</h4>
              <div className="performance-value">₹{analytics?.overview.totalRevenue.toLocaleString() || 0}</div>
              <div className="performance-change positive">{analytics?.overview.totalSales || 0} sales</div>
            </div>
            <div className="performance-card">
              <h4>Total Views</h4>
              <div className="performance-value">{analytics?.overview.totalViews || 0}</div>
              <div className="performance-change positive">All products</div>
            </div>
            <div className="performance-card">
              <h4>Conversion Rate</h4>
              <div className="performance-value">{analytics?.overview.conversionRate || 0}%</div>
              <div className="performance-change neutral">Views to sales</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AgencyDashboard;