import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const AgencyDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
      <aside className="dashboard-sidebar agency-sidebar">
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
            <span className="nav-icon">📦</span>
            <span>My Products</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">➕</span>
            <span>Add Product</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">📊</span>
            <span>Analytics</span>
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
              <div className="stat-value">0</div>
              <div className="stat-label">Active Listings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon agency">💰</div>
            <div className="stat-info">
              <div className="stat-value">₹0</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon agency">👥</div>
            <div className="stat-info">
              <div className="stat-value">0</div>
              <div className="stat-label">Active Customers</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon agency">✅</div>
            <div className="stat-info">
              <div className="stat-value">0</div>
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
              <button className="action-btn agency-btn">Add Product</button>
            </div>
            <div className="action-card">
              <div className="action-icon">📊</div>
              <h3>View Analytics</h3>
              <p>Track your performance metrics</p>
              <button className="action-btn agency-btn">View Report</button>
            </div>
            <div className="action-card">
              <div className="action-icon">📝</div>
              <h3>Pending Approvals</h3>
              <p>Review items waiting for approval</p>
              <button className="action-btn agency-btn">View Queue</button>
            </div>
          </div>
        </section>

        {/* Recent Listings */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Recent Listings</h2>
            <button className="view-all-btn">View All →</button>
          </div>
          <div className="listings-table">
            <div className="table-empty">
              <div className="empty-icon">📦</div>
              <h3>No listings yet</h3>
              <p>Start by adding your first product to the marketplace</p>
              <button className="cta-btn agency">Add First Product</button>
            </div>
          </div>
        </section>

        {/* Performance Overview */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Performance Overview</h2>
          </div>
          <div className="performance-grid">
            <div className="performance-card">
              <h4>Sales This Month</h4>
              <div className="performance-value">₹0</div>
              <div className="performance-change positive">+0%</div>
            </div>
            <div className="performance-card">
              <h4>Total Views</h4>
              <div className="performance-value">0</div>
              <div className="performance-change positive">+0%</div>
            </div>
            <div className="performance-card">
              <h4>Conversion Rate</h4>
              <div className="performance-value">0%</div>
              <div className="performance-change neutral">0%</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AgencyDashboard;