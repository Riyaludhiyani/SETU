import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });

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
    
    // Pre-fill name with user's name
    setShippingAddress(prev => ({
      ...prev,
      fullName: parsedUser.name
    }));
  }, [navigate]);

  useEffect(() => {
    if (!product) {
      navigate('/browse-products');
    }
  }, [product, navigate]);

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate address
    if (!shippingAddress.fullName || !shippingAddress.phone || 
        !shippingAddress.addressLine1 || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.pincode) {
      setError('Please fill all required address fields');
      setLoading(false);
      return;
    }

    // Validate phone
    if (!/^\d{10}$/.test(shippingAddress.phone)) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    // Validate pincode
    if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        items: [{
          productId: product._id,
          quantity: quantity
        }],
        shippingAddress,
        paymentMethod: 'cod'
      };

      const response = await api.post('/api/orders', orderData);
      
      // Navigate to orders page with success message
      navigate('/orders', { 
        state: { 
          orderSuccess: true, 
          orderNumber: response.data.order.orderNumber 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      console.error('Place order error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user || !product) return null;

  const totalAmount = product.sellingPrice * quantity;
  const totalSavings = (product.originalPrice - product.sellingPrice) * quantity;

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
            <h1>Checkout</h1>
            <p>Complete your order</p>
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

        <div className="checkout-container">
          <div className="checkout-main">
            <section className="shipping-section">
              <h2>Shipping Address</h2>
              {error && <div className="error-message-checkout">{error}</div>}
              
              <form onSubmit={handlePlaceOrder} className="shipping-form">
                <div className="form-row-checkout">
                  <div className="form-group-checkout">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className="form-group-checkout">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      placeholder="10-digit number"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-checkout">
                  <label>Address Line 1 *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={handleAddressChange}
                    placeholder="House No., Building Name"
                    required
                  />
                </div>

                <div className="form-group-checkout">
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={handleAddressChange}
                    placeholder="Road Name, Area, Colony (Optional)"
                  />
                </div>

                <div className="form-row-checkout">
                  <div className="form-group-checkout">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className="form-group-checkout">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className="form-group-checkout">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleAddressChange}
                      placeholder="6-digit code"
                      required
                    />
                  </div>
                </div>

                <div className="payment-section">
                  <h3>Payment Method</h3>
                  <div className="payment-option">
                    <input type="radio" id="cod" name="payment" checked readOnly />
                    <label htmlFor="cod">
                      <span className="payment-icon">💵</span>
                      <div>
                        <strong>Cash on Delivery (COD)</strong>
                        <p>Pay when you receive the product</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="place-order-btn"
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </section>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-product">
              <div className="summary-product-image">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.title} />
                ) : (
                  <div className="no-image">📦</div>
                )}
              </div>
              <div className="summary-product-info">
                <h4>{product.title}</h4>
                <p className="summary-agency">Sold by: {product.agencyName}</p>
              </div>
            </div>

            <div className="quantity-selector">
              <label>Quantity</label>
              <div className="quantity-controls">
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  disabled={quantity >= product.quantity}
                >
                  +
                </button>
              </div>
              <span className="stock-info">Max: {product.quantity}</span>
            </div>

            <div className="summary-pricing">
              <div className="price-row">
                <span>Original Price</span>
                <span>₹{(product.originalPrice * quantity).toLocaleString()}</span>
              </div>
              <div className="price-row discount">
                <span>Discount</span>
                <span>- ₹{totalSavings.toLocaleString()}</span>
              </div>
              <div className="price-row total">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="savings-badge-checkout">
              🎉 You save ₹{totalSavings.toLocaleString()}!
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
