import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Messages.css';

const Messages = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [replyText, setReplyText] = useState({});
  const [selectedMessage, setSelectedMessage] = useState(null);

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
    fetchMessages();
  }, [navigate, filter]);

  const fetchMessages = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.get('/api/messages', { params });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await api.patch(`/api/messages/${messageId}/read`);
      fetchMessages();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleReply = async (messageId) => {
    try {
      const reply = replyText[messageId];
      if (!reply || !reply.trim()) return;

      await api.post(`/api/messages/${messageId}/reply`, { reply });
      setReplyText({ ...replyText, [messageId]: '' });
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error('Error replying to message:', error);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/api/messages/${messageId}`);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'unread':
        return 'status-badge unread';
      case 'read':
        return 'status-badge read';
      case 'replied':
        return 'status-badge replied';
      default:
        return 'status-badge';
    }
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
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/analytics'); }}>
            <span className="nav-icon">📊</span>
            <span>Analytics</span>
          </a>
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/messages'); }}>
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
            <h1>Messages</h1>
            <p>Customer inquiries and communications</p>
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

        <div className="messages-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Messages
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread
          </button>
          <button 
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read
          </button>
          <button 
            className={`filter-btn ${filter === 'replied' ? 'active' : ''}`}
            onClick={() => setFilter('replied')}
          >
            Replied
          </button>
        </div>

        <section className="dashboard-section">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading messages...</p>
            </div>
          ) : messages.length > 0 ? (
            <div className="messages-list">
              {messages.map((message) => (
                <div key={message._id} className="message-card">
                  <div className="message-header">
                    <div className="message-meta">
                      <h3>{message.subject}</h3>
                      <div className="message-info">
                        <span className="customer-name">From: {message.customerName}</span>
                        <span className="customer-email">({message.customerEmail})</span>
                        {message.product && (
                          <span className="product-title">Re: {message.product.title}</span>
                        )}
                      </div>
                      <div className="message-date">
                        {new Date(message.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className={getStatusBadgeClass(message.status)}>
                      {message.status}
                    </div>
                  </div>

                  <div className="message-body">
                    <p>{message.message}</p>
                  </div>

                  {message.reply && (
                    <div className="message-reply">
                      <strong>Your Reply:</strong>
                      <p>{message.reply}</p>
                      <div className="reply-date">
                        Replied on: {new Date(message.repliedAt).toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="message-actions">
                    {message.status === 'unread' && (
                      <button 
                        className="action-btn read-btn"
                        onClick={() => handleMarkAsRead(message._id)}
                      >
                        Mark as Read
                      </button>
                    )}
                    <button 
                      className="action-btn reply-btn"
                      onClick={() => setSelectedMessage(selectedMessage === message._id ? null : message._id)}
                    >
                      {selectedMessage === message._id ? 'Cancel Reply' : 'Reply'}
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(message._id)}
                    >
                      Delete
                    </button>
                  </div>

                  {selectedMessage === message._id && (
                    <div className="reply-form">
                      <textarea
                        value={replyText[message._id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [message._id]: e.target.value })}
                        placeholder="Type your reply here..."
                        rows="4"
                      />
                      <button 
                        className="send-reply-btn"
                        onClick={() => handleReply(message._id)}
                      >
                        Send Reply
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>No messages yet</h3>
              <p>Customer messages will appear here</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Messages;
