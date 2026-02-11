import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      ...formData,
      name: parsedUser.name,
      email: parsedUser.email
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put('/api/auth/profile', {
        name: formData.name,
        email: formData.email
      });

      const updatedUser = { ...user, name: formData.name, email: formData.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      await api.put('/api/auth/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to change password' 
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  const isAgency = user.role === 'agency';

  return (
    <div className="dashboard-container">
      <aside className={`dashboard-sidebar ${isAgency ? 'agency-sidebar' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🔓</span>
            <span className="logo-text">Setu</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { 
            e.preventDefault(); 
            navigate(isAgency ? '/dashboard/agency' : '/dashboard/customer'); 
          }}>
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </a>
          {isAgency ? (
            <>
              <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/my-products'); }}>
                <span className="nav-icon">📦</span>
                <span>My Products</span>
              </a>
              <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/add-product'); }}>
                <span className="nav-icon">➕</span>
                <span>Add Product</span>
              </a>
              <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/analytics'); }}>
                <span className="nav-icon">📊</span>
                <span>Analytics</span>
              </a>
            </>
          ) : (
            <>
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
            </>
          )}
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/messages'); }}>
            <span className="nav-icon">💬</span>
            <span>Messages</span>
          </a>
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/settings'); }}>
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
            <h1>Settings</h1>
            <p>Manage your account settings</p>
          </div>
          <div className="header-actions">
            <button className="header-btn">
              <span>🔔</span>
            </button>
            <div className="user-profile">
              <div className={`profile-avatar ${isAgency ? 'agency' : ''}`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <div className="profile-name">{user.name}</div>
                <div className="profile-role">{isAgency ? 'Agency' : 'Customer'}</div>
              </div>
            </div>
          </div>
        </header>

        {message.text && (
          <div className={`message-banner ${message.type}`}>
            {message.text}
          </div>
        )}

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Profile Information</h2>
          </div>
          <form className="settings-form" onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                disabled
              />
            </div>
            <button type="submit" className={`submit-btn ${isAgency ? 'agency' : 'customer'}`}>
              Update Profile
            </button>
          </form>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Change Password</h2>
          </div>
          <form className="settings-form" onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className={`submit-btn ${isAgency ? 'agency' : 'customer'}`}>
              Change Password
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Settings;
