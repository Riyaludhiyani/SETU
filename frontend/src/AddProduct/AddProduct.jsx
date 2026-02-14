import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVerified, setIsVerified] = useState(null);
  const [checkingVerification, setCheckingVerification] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    originalPrice: '',
    sellingPrice: '',
    quantity: '1',
    condition: 'Good',
    images: ''
  });

  const categories = ['Electronics', 'Furniture', 'Clothing', 'Appliances', 'Toys', 'Vehicles', 'Others'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const response = await api.get('/api/documents/check-verification');
      setIsVerified(response.data.isVerified);
    } catch (error) {
      console.error('Error checking verification:', error);
      setIsVerified(false);
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.title || !formData.description || !formData.originalPrice || !formData.sellingPrice) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    if (Number(formData.sellingPrice) > Number(formData.originalPrice)) {
      setError('Selling price cannot be higher than original price');
      setLoading(false);
      return;
    }

    try {
      // Convert images string to array
      const imageUrls = formData.images ? formData.images.split(',').map(url => url.trim()) : [];

      const response = await api.post('/api/products', {
        ...formData,
        originalPrice: Number(formData.originalPrice),
        sellingPrice: Number(formData.sellingPrice),
        quantity: Number(formData.quantity),
        images: imageUrls
      });

      setSuccess('Product added successfully! Pending admin approval.');
      setTimeout(() => {
        navigate('/dashboard/agency');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
      console.error('Add product error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (checkingVerification) {
    return (
      <div className="add-product-page">
        <div className="add-product-container">
          <div className="loading-state">Checking verification status...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <button className="back-btn-add" onClick={() => navigate('/dashboard/agency')}>
          ← Back to Dashboard
        </button>

        {isVerified === false && (
          <div className="verification-warning">
            <div className="warning-icon">⚠️</div>
            <div className="warning-content">
              <h3>Verification Required</h3>
              <p>You need to upload and get your documents verified before you can add products.</p>
              <button 
                className="warning-btn" 
                onClick={() => navigate('/upload-documents')}
              >
                Upload Documents
              </button>
            </div>
          </div>
        )}

        <div className={`add-product-card ${!isVerified ? 'disabled-card' : ''}`}>
          <div className="add-product-header">
            <div className="header-icon">➕</div>
            <h2>Add New Product</h2>
            <p>List seized goods for public auction</p>
          </div>

          {error && <div className="error-message-add">{error}</div>}
          {success && <div className="success-message-add">{success}</div>}

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              <div className="form-group-add">
                <label htmlFor="title">Product Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., iPhone 14 Pro Max 256GB"
                  required
                />
              </div>

              <div className="form-group-add">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group-add">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of the seized item..."
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group-add">
                <label htmlFor="originalPrice">Original Price (₹) *</label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="50000"
                  min="0"
                  required
                />
              </div>

              <div className="form-group-add">
                <label htmlFor="sellingPrice">Selling Price (₹) *</label>
                <input
                  type="number"
                  id="sellingPrice"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  placeholder="15000"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-add">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group-add">
                <label htmlFor="condition">Condition *</label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  {conditions.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group-add">
              <label htmlFor="images">Image URLs (optional)</label>
              <input
                type="text"
                id="images"
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
              <small>Separate multiple URLs with commas</small>
            </div>

            {formData.originalPrice && formData.sellingPrice && (
              <div className="discount-badge">
                <span className="discount-label">Discount:</span>
                <span className="discount-value">
                  {((1 - formData.sellingPrice / formData.originalPrice) * 100).toFixed(0)}% OFF
                </span>
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn-add agency"
              disabled={loading || !isVerified}
            >
              {loading ? 'Adding Product...' : !isVerified ? 'Verification Required' : 'Add Product & Submit for Approval'}
            </button>
          </form>

          <div className="info-box">
            <strong>📋 Note:</strong> All products will be reviewed by admin before being listed publicly.
            You'll be notified once your product is approved or if any changes are needed.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;