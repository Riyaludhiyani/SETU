import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Analytics.css';

const Analytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
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
    fetchAnalytics();
  }, [navigate]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/api/products/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
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
      <aside className="dashboard-sidebar agency-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🔓</span>
            <span className="logo-text">Setu</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/dashboard/agency'); }}>
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/my-products'); }}>
            <span className="nav-icon">📦</span>
            <span>My Products</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/add-product'); }}>
            <span className="nav-icon">➕</span>
            <span>Add Product</span>
          </a>
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/analytics'); }}>
            <span className="nav-icon">📊</span>
            <span>Analytics</span>
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
            <h1>Analytics Dashboard</h1>
            <p>Track your performance and insights</p>
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

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading analytics...</p>
          </div>
        ) : analytics ? (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon agency">📦</div>
                <div className="stat-info">
                  <div className="stat-value">{analytics.overview.totalProducts}</div>
                  <div className="stat-label">Total Products</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon agency">✅</div>
                <div className="stat-info">
                  <div className="stat-value">{analytics.overview.approvedProducts}</div>
                  <div className="stat-label">Approved</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon agency">⏳</div>
                <div className="stat-info">
                  <div className="stat-value">{analytics.overview.pendingProducts}</div>
                  <div className="stat-label">Pending</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon agency">💰</div>
                <div className="stat-info">
                  <div className="stat-value">₹{analytics.overview.totalRevenue.toLocaleString()}</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
              </div>
            </div>

            <div className="analytics-row">
              <section className="dashboard-section analytics-section">
                <div className="section-header">
                  <h2>Performance Metrics</h2>
                </div>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <h4>Total Views</h4>
                    <div className="metric-value">{analytics.overview.totalViews}</div>
                  </div>
                  <div className="metric-card">
                    <h4>Total Sales</h4>
                    <div className="metric-value">{analytics.overview.totalSales}</div>
                  </div>
                  <div className="metric-card">
                    <h4>Conversion Rate</h4>
                    <div className="metric-value">{analytics.overview.conversionRate}%</div>
                  </div>
                  <div className="metric-card">
                    <h4>Sold Products</h4>
                    <div className="metric-value">{analytics.overview.soldProducts}</div>
                  </div>
                </div>
              </section>

              <section className="dashboard-section analytics-section">
                <div className="section-header">
                  <h2>Category Breakdown</h2>
                </div>
                <div className="category-list">
                  {analytics.categoryBreakdown.length > 0 ? (
                    analytics.categoryBreakdown.map((cat, index) => (
                      <div key={index} className="category-item">
                        <div className="category-name">{cat._id || 'Uncategorized'}</div>
                        <div className="category-count">{cat.count} products</div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No category data available</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <section className="dashboard-section">
              <div className="section-header">
                <h2>Monthly Sales</h2>
              </div>
              <div className="monthly-sales-container">
                {analytics.monthlySales.length > 0 ? (
                  <div className="monthly-sales-list">
                    {analytics.monthlySales.map((sale, index) => {
                      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const monthName = monthNames[sale._id.month - 1];
                      return (
                        <div key={index} className="monthly-sale-item">
                          <div className="month-label">{monthName} {sale._id.year}</div>
                          <div className="sale-info">
                            <div className="sale-count">{sale.count} sales</div>
                            <div className="sale-revenue">₹{sale.revenue.toLocaleString()}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <h3>No sales data yet</h3>
                    <p>Sales information will appear here once you start selling</p>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No analytics data available</h3>
            <p>Start adding products to see your analytics</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;
