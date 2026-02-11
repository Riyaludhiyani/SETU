import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './BrowseProducts.css';

const BrowseProducts = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
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
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async (filterParams = filters) => {
    try {
      setLoading(true);
      const params = {};
      if (filterParams.category) params.category = filterParams.category;
      if (filterParams.minPrice) params.minPrice = filterParams.minPrice;
      if (filterParams.maxPrice) params.maxPrice = filterParams.maxPrice;
      if (filterParams.search) params.search = filterParams.search;

      const response = await api.get('/api/products/all', { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    setFilters(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    };
    setFilters(clearedFilters);
    fetchProducts(clearedFilters);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
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
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/browse-products'); }}>
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
            <h1>Browse Products</h1>
            <p>Discover great deals on seized goods</p>
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

        <section className="filters-section">
          <form className="filters-form" onSubmit={handleSearch}>
            <div className="filter-group">
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                value={filters.search}
                onChange={handleFilterChange}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="clothing">Clothing</option>
                <option value="vehicles">Vehicles</option>
                <option value="jewelry">Jewelry</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="filter-group">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="price-input"
              />
            </div>
            <div className="filter-group">
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="price-input"
              />
            </div>
            <button type="submit" className="filter-btn search">Search</button>
            <button type="button" className="filter-btn clear" onClick={handleClearFilters}>Clear</button>
          </form>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Available Products ({products.length})</h2>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="browse-products-grid">
              {products.map((product) => (
                <div key={product._id} className="browse-product-card">
                  <div className="product-image-container">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.title} className="product-image" />
                    ) : (
                      <div className="product-image-placeholder">
                        <span className="placeholder-icon">📦</span>
                      </div>
                    )}
                    <div className="savings-badge">
                      {calculateSavings(product.originalPrice, product.sellingPrice)}% OFF
                    </div>
                  </div>
                  
                  <div className="product-content">
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-description">{product.description.substring(0, 100)}...</p>
                    
                    <div className="product-meta">
                      <span className="product-condition">{product.condition}</span>
                      <span className="product-quantity">Qty: {product.quantity}</span>
                    </div>

                    <div className="product-agency">
                      <span className="agency-icon">🏢</span>
                      <span>{product.agencyName}</span>
                    </div>

                    <div className="product-pricing">
                      <div className="price-info">
                        <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                        <span className="selling-price">₹{product.sellingPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <button 
                      className="view-product-btn"
                      onClick={() => handleViewProduct(product._id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default BrowseProducts;
