import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminProducts.css';

const PendingProducts = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

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
    fetchPendingProducts();
  }, [navigate]);

  const fetchPendingProducts = async () => {
    try {
      const response = await api.get('/api/admin/pending-products');
      const productList = response.data.products || [];
      setProducts(productList);
    } catch (error) {
      console.error('Error fetching pending products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    if (!window.confirm('Are you sure you want to approve this product?')) {
      return;
    }

    setProcessing(true);
    try {
      await api.put(`/api/admin/products/${productId}/status`, { status: 'approved' });
      alert('Product approved successfully!');
      fetchPendingProducts();
      setSelectedProduct(null);
    } catch (error) {
      alert('Failed to approve product');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (productId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);
    try {
      await api.put(`/api/admin/products/${productId}/status`, { 
        status: 'rejected',
        rejectionReason 
      });
      alert('Product rejected');
      fetchPendingProducts();
      setSelectedProduct(null);
      setRejectionReason('');
    } catch (error) {
      alert('Failed to reject product');
      console.error(error);
    } finally {
      setProcessing(false);
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
      <aside className="dashboard-sidebar admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🔓</span>
            <span className="logo-text">Setu Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/dashboard/admin'); }}>
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/document-approval'); }}>
            <span className="nav-icon">📄</span>
            <span>Document Approval</span>
          </a>
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/admin/pending-products'); }}>
            <span className="nav-icon">⏳</span>
            <span>Pending Approvals</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/admin/all-products'); }}>
            <span className="nav-icon">📦</span>
            <span>All Products</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/admin/users'); }}>
            <span className="nav-icon">👥</span>
            <span>Users</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/messages'); }}>
            <span className="nav-icon">💬</span>
            <span>Messages</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/settings'); }}>
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

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Pending Product Approvals</h1>
            <p>Review and approve agency product listings</p>
          </div>
          <div className="header-actions">
            <button className="header-btn">
              <span>🔔</span>
            </button>
            <div className="user-profile">
              <div className="profile-avatar admin">{user.name.charAt(0).toUpperCase()}</div>
              <div className="profile-info">
                <div className="profile-name">{user.name}</div>
                <div className="profile-role">Admin</div>
              </div>
            </div>
          </div>
        </header>

        <section className="dashboard-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading pending products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id} className="product-approval-card">
                  <div className="product-image-section">
                    {product.images && product.images.length > 0 && product.images[0].startsWith('http') && (
                      <img src={product.images[0]} alt={product.title} />
                    )}
                  </div>
                  <div className="product-details-section">
                    <h3>{product.title}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="product-pricing">
                      <div className="price-row">
                        <span className="label">Original Price:</span>
                        <span className="value">₹{product.originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="price-row">
                        <span className="label">Selling Price:</span>
                        <span className="value selling">₹{product.sellingPrice.toLocaleString()}</span>
                      </div>
                      <div className="price-row">
                        <span className="label">Discount:</span>
                        <span className="value discount">
                          {Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                    </div>
                    <div className="product-info">
                      <p><strong>Agency:</strong> {product.agencyName}</p>
                      <p><strong>Quantity:</strong> {product.quantity}</p>
                      <p><strong>Condition:</strong> {product.condition}</p>
                      <p><strong>Location:</strong> {product.location}</p>
                    </div>
                    <div className="product-description">
                      <strong>Description:</strong>
                      <p>{product.description}</p>
                    </div>
                    
                    {selectedProduct === product._id ? (
                      <div className="rejection-form">
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Enter reason for rejection..."
                          rows="3"
                        />
                        <div className="form-actions">
                          <button 
                            className="cancel-btn"
                            onClick={() => {
                              setSelectedProduct(null);
                              setRejectionReason('');
                            }}
                            disabled={processing}
                          >
                            Cancel
                          </button>
                          <button 
                            className="confirm-reject-btn"
                            onClick={() => handleReject(product._id)}
                            disabled={processing || !rejectionReason.trim()}
                          >
                            {processing ? 'Rejecting...' : 'Confirm Rejection'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="product-actions">
                        <button 
                          className="approve-btn"
                          onClick={() => handleApprove(product._id)}
                          disabled={processing}
                        >
                          ✓ Approve
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => setSelectedProduct(product._id)}
                          disabled={processing}
                        >
                          ✗ Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>No pending approvals</h3>
              <p>All products have been reviewed</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PendingProducts;
