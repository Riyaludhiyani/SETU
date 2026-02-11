import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login/customer');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'customer') {
      navigate('/login/customer');
      return;
    }

    setUser(parsedUser);
    fetchFeaturedProducts();
  }, [navigate]);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/api/products/all');
      setFeaturedProducts(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching products:', error);
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
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🔓</span>
            <span className="logo-text">Setu</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/dashboard/customer'); }}>
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/browse-products'); }}>
            <span className="nav-icon">🛍️</span>
            <span>Browse Products</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/orders'); }}>
            <span className="nav-icon">📋</span>
            <span>My Orders</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/watchlist'); }}>
            <span className="nav-icon">❤️</span>
            <span>Watchlist</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/messages'); }}>
            <span className="nav-icon">💬</span>
            <span>Messages</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/support'); }}>
            <span className="nav-icon">🆘</span>
            <span>Support</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>
            <span className="nav-icon">📞</span>
            <span>Contact Us</span>
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

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Welcome back, {user.name}!</h1>
            <p>Discover great deals on seized government goods</p>
          </div>
          <div className="header-actions">
            <button className="header-btn" onClick={() => navigate('/cart')}>
              <span>🛒</span>
            </button>
            <button className="header-btn">
              <span>🔔</span>
            </button>
            <div className="user-profile">
              <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <div className="profile-info">
                <div className="profile-name">{user.name}</div>
                <div className="profile-role">Customer</div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Products */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Featured Products</h2>
            <button className="view-all-btn" onClick={() => navigate('/browse-products')}>View All →</button>
          </div>
          {loading ? (
            <div className="table-loading">Loading products...</div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-badge">
                    {Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)}% OFF
                  </div>
                  <div className="product-image">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      '📦'
                    )}
                  </div>
                  <h3>{product.title}</h3>
                  <p>{product.description.substring(0, 60)}...</p>
                  <div className="product-price">
                    <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="current-price">₹{product.sellingPrice.toLocaleString()}</span>
                  </div>
                  <button className="product-btn" onClick={() => navigate(`/product/${product._id}`)}>View Details</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No products available yet</h3>
              <p>Check back soon for new listings</p>
            </div>
          )}
        </section>

        {/* Start Shopping Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Start Shopping</h2>
            <button 
              className="view-all-btn" 
              onClick={() => navigate('/browse-products')}
            >
              Browse All →
            </button>
          </div>
          <div className="activity-list">
            <div className="activity-empty">
              <div className="empty-icon">📭</div>
              <h3>No recent activity</h3>
              <p>Start browsing products to see your activity here</p>
              <button className="cta-btn" onClick={() => navigate('/browse-products')}>Browse Products</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CustomerDashboard;
