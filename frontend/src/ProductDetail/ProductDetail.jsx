import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageData, setMessageData] = useState({
    subject: '',
    message: ''
  });
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login/customer');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchProduct();
  }, [navigate, id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageChange = (e) => {
    setMessageData({
      ...messageData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      await api.post('/api/messages', {
        productId: product._id,
        agencyId: product.agency,
        subject: messageData.subject,
        message: messageData.message
      });

      setMessageSent(true);
      setMessageData({ subject: '', message: '' });
      setTimeout(() => {
        setShowMessageForm(false);
        setMessageSent(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const calculateSavings = (original, selling) => {
    return Math.round(((original - selling) / original) * 100);
  };

  if (!user) return null;

  const isCustomer = user.role === 'customer';

  return (
    <div className="dashboard-container">
      <aside className={`dashboard-sidebar ${!isCustomer ? 'agency-sidebar' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🔓</span>
            <span className="logo-text">Setu</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { 
            e.preventDefault(); 
            navigate(isCustomer ? '/dashboard/customer' : '/dashboard/agency'); 
          }}>
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </a>
          {isCustomer ? (
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
          ) : (
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
          )}
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
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Product Details</h1>
          </div>
          <div className="header-actions">
            <button className="header-btn">
              <span>🔔</span>
            </button>
            <div className="user-profile">
              <div className={`profile-avatar ${!isCustomer ? 'agency' : ''}`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <div className="profile-name">{user.name}</div>
                <div className="profile-role">{isCustomer ? 'Customer' : 'Agency'}</div>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading product...</p>
          </div>
        ) : product ? (
          <div className="product-detail-container">
            <div className="product-detail-grid">
              <div className="product-images-section">
                {product.images && product.images.length > 0 ? (
                  <div className="main-image-container">
                    <img src={product.images[0]} alt={product.title} className="main-image" />
                    <div className="savings-badge-large">
                      {calculateSavings(product.originalPrice, product.sellingPrice)}% OFF
                    </div>
                  </div>
                ) : (
                  <div className="main-image-placeholder">
                    <span className="placeholder-icon">📦</span>
                  </div>
                )}
              </div>

              <div className="product-info-section">
                <div className="product-category-badge">{product.category}</div>
                <h1 className="product-detail-title">{product.title}</h1>
                
                <div className="product-detail-pricing">
                  <span className="detail-original-price">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="detail-selling-price">₹{product.sellingPrice.toLocaleString()}</span>
                  <span className="savings-text">
                    Save ₹{(product.originalPrice - product.sellingPrice).toLocaleString()}
                  </span>
                </div>

                <div className="product-meta-info">
                  <div className="meta-item">
                    <span className="meta-label">Condition:</span>
                    <span className="meta-value condition-badge">{product.condition}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Available Quantity:</span>
                    <span className="meta-value">{product.quantity}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Agency:</span>
                    <span className="meta-value">{product.agencyName}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Views:</span>
                    <span className="meta-value">{product.views || 0}</span>
                  </div>
                </div>

                <div className="product-description-section">
                  <h3>Description</h3>
                  <p>{product.description}</p>
                </div>

                {isCustomer && (
                  <div className="product-actions">
                    <button 
                      className="buy-now-btn"
                      onClick={() => navigate('/checkout', { state: { product } })}
                    >
                      🛒 Buy Now
                    </button>
                    <button 
                      className="contact-agency-btn"
                      onClick={() => setShowMessageForm(!showMessageForm)}
                    >
                      💬 Contact Agency
                    </button>
                  </div>
                )}

                {showMessageForm && (
                  <div className="message-form-container">
                    <h3>Send Message to Agency</h3>
                    {messageSent ? (
                      <div className="success-message">
                        ✅ Message sent successfully!
                      </div>
                    ) : (
                      <form onSubmit={handleSendMessage} className="message-form">
                        <div className="form-group">
                          <label>Subject</label>
                          <input
                            type="text"
                            name="subject"
                            value={messageData.subject}
                            onChange={handleMessageChange}
                            placeholder="e.g., Inquiry about pricing"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Message</label>
                          <textarea
                            name="message"
                            value={messageData.message}
                            onChange={handleMessageChange}
                            placeholder="Type your message here..."
                            rows="4"
                            required
                          />
                        </div>
                        <div className="form-actions">
                          <button type="submit" className="send-message-btn">Send Message</button>
                          <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => setShowMessageForm(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Product not found</h3>
            <p>The product you're looking for doesn't exist or has been removed</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
