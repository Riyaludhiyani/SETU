import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import axios from 'axios';
=======
import api from '../services/api';
>>>>>>> 5137482c498d5c5f1ccbf431868ddf14606f9793
import './Dashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
<<<<<<< HEAD
  const [stats, setStats] = useState({
    activeOrders: 0,
    wishlistItems: 0,
    totalSavings: 0,
    completedOrders: 0
  });
=======
  const [featuredProducts, setFeaturedProducts] = useState([]);
>>>>>>> 5137482c498d5c5f1ccbf431868ddf14606f9793
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
<<<<<<< HEAD
    fetchStats(token);
  }, [navigate]);

  const fetchStats = async (token) => {
    try {
      // Fetch orders
      const ordersRes = await axios.get('http://localhost:5000/api/customer/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const orders = ordersRes.data;
      
      // Fetch wishlist
      const wishlistRes = await axios.get('http://localhost:5000/api/customer/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Calculate stats
      const activeOrders = orders.filter(o => 
        ['confirmed', 'processing', 'shipped'].includes(o.orderStatus)
      ).length;
      
      const completedOrders = orders.filter(o => o.orderStatus === 'delivered').length;
      
      const totalSavings = orders.reduce((sum, order) => sum + (order.totalSavings || 0), 0);
      
      setStats({
        activeOrders,
        wishlistItems: wishlistRes.data.products?.length || 0,
        totalSavings,
        completedOrders
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
=======
    fetchFeaturedProducts();
  }, [navigate]);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/api/products/all');
      setFeaturedProducts(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching products:', error);
>>>>>>> 5137482c498d5c5f1ccbf431868ddf14606f9793
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
<<<<<<< HEAD
          <button 
            onClick={() => navigate('/dashboard/customer')} 
            className="nav-item active"
          >
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => navigate('/browse-products')} 
            className="nav-item"
          >
            <span className="nav-icon">🛍️</span>
            <span>Browse Products</span>
          </button>
          <button 
            onClick={() => navigate('/my-orders')} 
            className="nav-item"
          >
            <span className="nav-icon">📋</span>
            <span>My Orders</span>
          </button>
          <button 
            onClick={() => navigate('/wishlist')} 
            className="nav-item"
          >
            <span className="nav-icon">❤️</span>
            <span>Wishlist</span>
          </button>
          <button 
            onClick={() => navigate('/cart')} 
            className="nav-item"
          >
            <span className="nav-icon">🛒</span>
            <span>Cart</span>
          </button>
          <button 
            onClick={() => {}} 
            className="nav-item"
          >
=======
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
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/settings'); }}>
>>>>>>> 5137482c498d5c5f1ccbf431868ddf14606f9793
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </button>
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

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon customer">🛍️</div>
            <div className="stat-info">
              <div className="stat-value">{loading ? '...' : stats.activeOrders}</div>
              <div className="stat-label">Active Orders</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon customer">❤️</div>
            <div className="stat-info">
              <div className="stat-value">{loading ? '...' : stats.wishlistItems}</div>
              <div className="stat-label">Wishlist Items</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon customer">💰</div>
            <div className="stat-info">
              <div className="stat-value">
                {loading ? '...' : `₹${stats.totalSavings.toLocaleString()}`}
              </div>
              <div className="stat-label">Total Savings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon customer">📦</div>
            <div className="stat-info">
              <div className="stat-value">{loading ? '...' : stats.completedOrders}</div>
              <div className="stat-label">Completed Orders</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="dashboard-section">
          <div className="section-header">
<<<<<<< HEAD
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions-grid">
            <div 
              className="action-card" 
              onClick={() => navigate('/browse-products')} 
              style={{cursor: 'pointer'}}
            >
              <div className="action-icon">🛍️</div>
              <h3>Browse Products</h3>
              <p>Discover amazing deals on seized goods</p>
            </div>
            <div 
              className="action-card" 
              onClick={() => navigate('/my-orders')} 
              style={{cursor: 'pointer'}}
            >
              <div className="action-icon">📦</div>
              <h3>Track Orders</h3>
              <p>View and track your order status</p>
            </div>
            <div 
              className="action-card" 
              onClick={() => navigate('/wishlist')} 
              style={{cursor: 'pointer'}}
            >
              <div className="action-icon">❤️</div>
              <h3>My Wishlist</h3>
              <p>View saved products and favorites</p>
            </div>
          </div>
=======
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
>>>>>>> 5137482c498d5c5f1ccbf431868ddf14606f9793
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
<<<<<<< HEAD
              <div className="empty-icon">🛍️</div>
              <h3>Ready to Shop?</h3>
              <p>Explore our marketplace of seized government goods at amazing prices</p>
              <button 
                className="cta-btn" 
                onClick={() => navigate('/browse-products')}
              >
                Browse Products
              </button>
=======
              <div className="empty-icon">📭</div>
              <h3>No recent activity</h3>
              <p>Start browsing products to see your activity here</p>
              <button className="cta-btn" onClick={() => navigate('/browse-products')}>Browse Products</button>
>>>>>>> 5137482c498d5c5f1ccbf431868ddf14606f9793
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CustomerDashboard;