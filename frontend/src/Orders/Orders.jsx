import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

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
    fetchOrders();

    // Check for order success message
    if (location.state?.orderSuccess) {
      setShowOrderSuccess(true);
      setOrderNumber(location.state.orderNumber);
      setTimeout(() => setShowOrderSuccess(false), 5000);
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [navigate, location]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await api.post(`/api/orders/${orderId}/cancel`, {
        reason: 'Cancelled by customer'
      });
      alert('Order cancelled successfully');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      alert('Failed to cancel order');
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'status-badge-order pending', icon: '⏳', text: 'Pending' },
      confirmed: { class: 'status-badge-order confirmed', icon: '✓', text: 'Confirmed' },
      processing: { class: 'status-badge-order processing', icon: '📦', text: 'Processing' },
      shipped: { class: 'status-badge-order shipped', icon: '🚚', text: 'Shipped' },
      delivered: { class: 'status-badge-order delivered', icon: '✅', text: 'Delivered' },
      cancelled: { class: 'status-badge-order cancelled', icon: '✗', text: 'Cancelled' }
    };
    return badges[status] || badges.pending;
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🔓</span>
            <span className="logo-text">Setu</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/dashboard/customer'); }}>
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/browse-products'); }}>
            <span className="nav-icon">🛍️</span>
            <span>Browse Products</span>
          </a>
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/orders'); }}>
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
            <h1>My Orders</h1>
            <p>Track and manage your orders</p>
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

        <section className="dashboard-section">
          {showOrderSuccess && (
            <div className="order-success-banner">
              <span className="success-icon">✅</span>
              <div>
                <strong>Order Placed Successfully!</strong>
                <p>Order Number: {orderNumber}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state placeholder-page">
              <div className="empty-icon">📋</div>
              <h3>No Orders Yet</h3>
              <p>You haven't placed any orders yet.</p>
              <button 
                className="cta-btn"
                onClick={() => navigate('/browse-products')}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order.orderNumber}</h3>
                      <p className="order-date">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className={getStatusBadge(order.orderStatus).class}>
                      <span>{getStatusBadge(order.orderStatus).icon}</span>
                      {getStatusBadge(order.orderStatus).text}
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-image">
                          {item.productImage ? (
                            <img src={item.productImage} alt={item.productTitle} />
                          ) : (
                            <div className="no-image">📦</div>
                          )}
                        </div>
                        <div className="item-details">
                          <h4>{item.productTitle}</h4>
                          <p>Sold by: {item.agencyName}</p>
                          <p>Quantity: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Total Amount</span>
                      <span className="amount">₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="summary-row savings">
                      <span>You Saved</span>
                      <span>₹{order.totalSavings.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                      <span>Payment Method</span>
                      <span>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</span>
                    </div>
                  </div>

                  <div className="order-actions">
                    <button 
                      className="btn-view-order"
                      onClick={() => handleViewOrder(order._id)}
                    >
                      View Details & Tracking
                    </button>
                    {!['delivered', 'cancelled'].includes(order.orderStatus) && (
                      <button 
                        className="btn-cancel-order"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="modal-overlay-order" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content-order" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-order">
                <h2>Order Details</h2>
                <button className="close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
              </div>

              <div className="modal-body-order">
                <div className="order-info-section">
                  <h3>Order Information</h3>
                  <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                  <p><strong>Status:</strong> 
                    <span className={getStatusBadge(selectedOrder.orderStatus).class}>
                      {getStatusBadge(selectedOrder.orderStatus).icon} {getStatusBadge(selectedOrder.orderStatus).text}
                    </span>
                  </p>
                  <p><strong>Payment:</strong> {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</p>
                  <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount.toLocaleString()}</p>
                </div>

                <div className="shipping-address-section">
                  <h3>Shipping Address</h3>
                  <p>{selectedOrder.shippingAddress.fullName}</p>
                  <p>{selectedOrder.shippingAddress.phone}</p>
                  <p>{selectedOrder.shippingAddress.addressLine1}</p>
                  {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                </div>

                <div className="tracking-section">
                  <h3>Order Tracking</h3>
                  <div className="tracking-timeline">
                    {selectedOrder.trackingUpdates && selectedOrder.trackingUpdates.map((update, index) => (
                      <div key={index} className="tracking-item">
                        <div className="tracking-icon">●</div>
                        <div className="tracking-content">
                          <strong>{update.status}</strong>
                          <p>{update.message}</p>
                          <span className="tracking-time">
                            {new Date(update.timestamp).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
