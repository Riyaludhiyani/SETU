import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
  }, [navigate]);

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
          <a href="#" className="nav-item active">
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🛍️</span>
            <span>Browse Products</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">📋</span>
            <span>My Orders</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">❤️</span>
            <span>Watchlist</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">💬</span>
            <span>Messages</span>
          </a>
          <a href="#" className="nav-item">
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
              <div className="stat-value">0</div>
              <div className="stat-label">Active Orders</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon customer">❤️</div>
            <div className="stat-info">
              <div className="stat-value">0</div>
              <div className="stat-label">Watchlist Items</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon customer">💰</div>
            <div className="stat-info">
              <div className="stat-value">₹0</div>
              <div className="stat-label">Total Savings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon customer">📦</div>
            <div className="stat-info">
              <div className="stat-value">0</div>
              <div className="stat-label">Completed Orders</div>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Featured Products</h2>
            <button className="view-all-btn">View All →</button>
          </div>
          <div className="products-grid">
            <div className="product-card">
              <div className="product-badge">New</div>
              <div className="product-image">📱</div>
              <h3>Electronics Bundle</h3>
              <p>Latest smartphones and accessories</p>
              <div className="product-price">
                <span className="original-price">₹50,000</span>
                <span className="current-price">₹15,000</span>
              </div>
              <button className="product-btn">View Details</button>
            </div>
            <div className="product-card">
              <div className="product-badge">Hot Deal</div>
              <div className="product-image">🏠</div>
              <h3>Furniture Set</h3>
              <p>Premium quality home furniture</p>
              <div className="product-price">
                <span className="original-price">₹1,00,000</span>
                <span className="current-price">₹30,000</span>
              </div>
              <button className="product-btn">View Details</button>
            </div>
            <div className="product-card">
              <div className="product-badge">Limited</div>
              <div className="product-image">👕</div>
              <h3>Clothing Collection</h3>
              <p>Brand new fashion apparel</p>
              <div className="product-price">
                <span className="original-price">₹20,000</span>
                <span className="current-price">₹6,000</span>
              </div>
              <button className="product-btn">View Details</button>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
          </div>
          <div className="activity-list">
            <div className="activity-empty">
              <div className="empty-icon">📭</div>
              <h3>No recent activity</h3>
              <p>Start browsing products to see your activity here</p>
              <button className="cta-btn">Browse Products</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CustomerDashboard;