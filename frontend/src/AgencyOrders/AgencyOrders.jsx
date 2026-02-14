import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AgencyOrders.css';

const AgencyOrders = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingForm, setTrackingForm] = useState({ status: '', message: '' });

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
    fetchOrders();
    fetchStats();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders/agency-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/orders/agency-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      alert('Order status updated successfully');
      fetchOrders();
      fetchStats();
      if (selectedOrder && selectedOrder._id === orderId) {
        const response = await api.get(`/api/orders/${orderId}`);
        setSelectedOrder(response.data);
      }
    } catch (error) {
      alert('Failed to update order status');
      console.error(error);
    }
  };

  const handleAddTracking = async (e) => {
    e.preventDefault();
    if (!trackingForm.status || !trackingForm.message) {
      alert('Please fill all fields');
      return;
    }

    try {
      await api.post(`/api/orders/${selectedOrder._id}/tracking`, trackingForm);
      alert('Tracking update added');
      setTrackingForm({ status: '', message: '' });
      const response = await api.get(`/api/orders/${selectedOrder._id}`);
      setSelectedOrder(response.data);
      fetchOrders();
    } catch (error) {
      alert('Failed to add tracking update');
      console.error(error);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'status-badge-agency pending', icon: '⏳', text: 'Pending' },
      confirmed: { class: 'status-badge-agency confirmed', icon: '✓', text: 'Confirmed' },
      processing: { class: 'status-badge-agency processing', icon: '📦', text: 'Processing' },
      shipped: { class: 'status-badge-agency shipped', icon: '🚚', text: 'Shipped' },
      delivered: { class: 'status-badge-agency delivered', icon: '✅', text: 'Delivered' },
      cancelled: { class: 'status-badge-agency cancelled', icon: '✗', text: 'Cancelled' }
    };
    return badges[status] || badges.pending;
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
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/upload-documents'); }}>
            <span className="nav-icon">📄</span>
            <span>Documents</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/my-products'); }}>
            <span className="nav-icon">📦</span>
            <span>My Products</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/add-product'); }}>
            <span className="nav-icon">➕</span>
            <span>Add Product</span>
          </a>
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/agency-orders'); }}>
            <span className="nav-icon">📋</span>
            <span>Orders</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/analytics'); }}>
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
            <h1>Orders Management</h1>
            <p>Manage and ship customer orders</p>
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

        {/* Order Statistics */}
        {stats && (
          <div className="stats-grid-agency">
            <div className="stat-card-agency">
              <div className="stat-icon-agency">📋</div>
              <div className="stat-value-agency">{stats.total}</div>
              <div className="stat-label-agency">Total Orders</div>
            </div>
            <div className="stat-card-agency pending">
              <div className="stat-icon-agency">⏳</div>
              <div className="stat-value-agency">{stats.pending}</div>
              <div className="stat-label-agency">Pending</div>
            </div>
            <div className="stat-card-agency shipped">
              <div className="stat-icon-agency">🚚</div>
              <div className="stat-value-agency">{stats.shipped}</div>
              <div className="stat-label-agency">Shipped</div>
            </div>
            <div className="stat-card-agency delivered">
              <div className="stat-icon-agency">✅</div>
              <div className="stat-value-agency">{stats.delivered}</div>
              <div className="stat-label-agency">Delivered</div>
            </div>
            <div className="stat-card-agency revenue">
              <div className="stat-icon-agency">💰</div>
              <div className="stat-value-agency">₹{stats.totalRevenue.toLocaleString()}</div>
              <div className="stat-label-agency">Total Revenue</div>
            </div>
          </div>
        )}

        <section className="dashboard-section">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Orders Yet</h3>
              <p>You haven't received any orders yet.</p>
            </div>
          ) : (
            <div className="orders-table-agency">
              {orders.map((order) => (
                <div key={order._id} className="order-row-agency">
                  <div className="order-info-agency">
                    <h4>Order #{order.orderNumber}</h4>
                    <p className="customer-name">Customer: {order.customerName}</p>
                    <p className="order-date-agency">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <div className="order-items-agency">
                    {order.items.filter(item => item.agencyName === user.name).map((item, index) => (
                      <div key={index} className="item-summary">
                        <strong>{item.productTitle}</strong>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-amount-agency">
                    <span className="amount-label">Amount</span>
                    <span className="amount-value">
                      ₹{order.items
                        .filter(item => item.agencyName === user.name)
                        .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                        .toLocaleString()}
                    </span>
                  </div>

                  <div className={getStatusBadge(order.orderStatus).class}>
                    <span>{getStatusBadge(order.orderStatus).icon}</span>
                    {getStatusBadge(order.orderStatus).text}
                  </div>

                  <div className="order-actions-agency">
                    <button 
                      className="btn-view-agency"
                      onClick={() => handleViewOrder(order._id)}
                    >
                      View Details
                    </button>
                    {order.orderStatus === 'pending' && (
                      <button 
                        className="btn-confirm-agency"
                        onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                      >
                        Confirm
                      </button>
                    )}
                    {order.orderStatus === 'confirmed' && (
                      <button 
                        className="btn-process-agency"
                        onClick={() => handleUpdateStatus(order._id, 'processing')}
                      >
                        Process
                      </button>
                    )}
                    {order.orderStatus === 'processing' && (
                      <button 
                        className="btn-ship-agency"
                        onClick={() => handleUpdateStatus(order._id, 'shipped')}
                      >
                        Ship Now
                      </button>
                    )}
                    {order.orderStatus === 'shipped' && (
                      <button 
                        className="btn-deliver-agency"
                        onClick={() => handleUpdateStatus(order._id, 'delivered')}
                      >
                        Mark Delivered
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
          <div className="modal-overlay-agency" onClick={() => setSelectedOrder(null)}>
            <div className="modal-content-agency" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-agency">
                <h2>Order #{selectedOrder.orderNumber}</h2>
                <button className="close-btn-agency" onClick={() => setSelectedOrder(null)}>✕</button>
              </div>

              <div className="modal-body-agency">
                <div className="order-details-grid">
                  <div className="detail-section">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                    <p><strong>Phone:</strong> {selectedOrder.shippingAddress.phone}</p>
                  </div>

                  <div className="detail-section">
                    <h3>Shipping Address</h3>
                    <p>{selectedOrder.shippingAddress.fullName}</p>
                    <p>{selectedOrder.shippingAddress.addressLine1}</p>
                    {selectedOrder.shippingAddress.addressLine2 && (
                      <p>{selectedOrder.shippingAddress.addressLine2}</p>
                    )}
                    <p>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                    </p>
                  </div>
                </div>

                <div className="tracking-updates-section">
                  <h3>Tracking History</h3>
                  <div className="tracking-list">
                    {selectedOrder.trackingUpdates && selectedOrder.trackingUpdates.map((update, index) => (
                      <div key={index} className="tracking-update-item">
                        <div className="update-icon">●</div>
                        <div className="update-content">
                          <strong>{update.status}</strong>
                          <p>{update.message}</p>
                          <span className="update-time">
                            {new Date(update.timestamp).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {!['delivered', 'cancelled'].includes(selectedOrder.orderStatus) && (
                  <div className="add-tracking-section">
                    <h3>Add Tracking Update</h3>
                    <form onSubmit={handleAddTracking} className="tracking-form-agency">
                      <div className="form-group-agency">
                        <label>Status</label>
                        <input
                          type="text"
                          value={trackingForm.status}
                          onChange={(e) => setTrackingForm({ ...trackingForm, status: e.target.value })}
                          placeholder="e.g., Out for Delivery"
                          required
                        />
                      </div>
                      <div className="form-group-agency">
                        <label>Message</label>
                        <textarea
                          value={trackingForm.message}
                          onChange={(e) => setTrackingForm({ ...trackingForm, message: e.target.value })}
                          placeholder="Provide tracking details..."
                          rows="3"
                          required
                        />
                      </div>
                      <button type="submit" className="btn-add-tracking">Add Update</button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AgencyOrders;
