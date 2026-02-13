import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './UploadDocuments.css';

const UploadDocuments = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    businessLicense: null,
    taxCertificate: null,
    authorizationLetter: null
  });
  const [message, setMessage] = useState({ type: '', text: '' });

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
    fetchDocuments();
  }, [navigate]);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/api/documents/my-documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }
      setFormData({ ...formData, [fieldName]: file });
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.businessLicense || !formData.taxCertificate || !formData.authorizationLetter) {
      setMessage({ type: 'error', text: 'Please upload all required documents' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const submitData = new FormData();
    submitData.append('businessLicense', formData.businessLicense);
    submitData.append('taxCertificate', formData.taxCertificate);
    submitData.append('authorizationLetter', formData.authorizationLetter);

    try {
      const response = await api.post('/api/documents/upload', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage({ type: 'success', text: 'Documents uploaded successfully! Awaiting admin approval.' });
      setFormData({
        businessLicense: null,
        taxCertificate: null,
        authorizationLetter: null
      });
      // Reset file inputs
      document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
      fetchDocuments();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to upload documents. Please try again.' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'status-badge pending', text: 'Pending Review', icon: '⏳' },
      approved: { class: 'status-badge approved', text: 'Approved', icon: '✓' },
      rejected: { class: 'status-badge rejected', text: 'Rejected', icon: '✗' }
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
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/upload-documents'); }}>
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
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/support'); }}>
            <span className="nav-icon">❓</span>
            <span>Support</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>
            <span className="nav-icon">📞</span>
            <span>Contact Us</span>
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
            <h1>Document Verification</h1>
            <p>Upload required documents for agency verification</p>
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
          <div className="loading-state">Loading documents...</div>
        ) : (
          <>
            {/* Verification Status */}
            {documents && (
              <section className="dashboard-section">
                <div className="verification-status-card">
                  <div className="verification-header">
                    <h2>Verification Status</h2>
                    <div className={getStatusBadge(documents.status).class}>
                      <span>{getStatusBadge(documents.status).icon}</span>
                      {getStatusBadge(documents.status).text}
                    </div>
                  </div>
                  
                  {documents.status === 'approved' && (
                    <div className="status-message success">
                      <span className="message-icon">🎉</span>
                      <div>
                        <strong>Your agency is verified!</strong>
                        <p>You can now add products to the marketplace.</p>
                      </div>
                    </div>
                  )}
                  
                  {documents.status === 'pending' && (
                    <div className="status-message pending">
                      <span className="message-icon">⏳</span>
                      <div>
                        <strong>Documents under review</strong>
                        <p>Admin will review your documents within 2-3 business days.</p>
                      </div>
                    </div>
                  )}
                  
                  {documents.status === 'rejected' && (
                    <div className="status-message rejected">
                      <span className="message-icon">⚠️</span>
                      <div>
                        <strong>Documents rejected</strong>
                        <p>{documents.rejectionReason || 'Please upload valid documents and try again.'}</p>
                      </div>
                    </div>
                  )}

                  {documents.status !== 'pending' && (
                    <div className="uploaded-documents">
                      <h3>Uploaded Documents</h3>
                      <div className="document-list">
                        <div className="document-item">
                          <span className="doc-icon">📄</span>
                          <span className="doc-name">Business License</span>
                          <span className="doc-date">{new Date(documents.uploadedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="document-item">
                          <span className="doc-icon">📄</span>
                          <span className="doc-name">Tax Certificate</span>
                          <span className="doc-date">{new Date(documents.uploadedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="document-item">
                          <span className="doc-icon">📄</span>
                          <span className="doc-name">Authorization Letter</span>
                          <span className="doc-date">{new Date(documents.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Upload Form - show if no documents or rejected */}
            {(!documents || documents.status === 'rejected') && (
              <section className="dashboard-section">
                <div className="upload-card">
                  <div className="upload-header">
                    <h2>Upload Required Documents</h2>
                    <p>All documents must be in PDF, JPG, or PNG format (max 5MB each)</p>
                  </div>

                  {message.text && (
                    <div className={`alert alert-${message.type}`}>
                      {message.text}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-group">
                      <label htmlFor="businessLicense">
                        <span className="label-icon">📋</span>
                        Business License / Registration Certificate *
                      </label>
                      <div className="file-input-wrapper">
                        <input
                          type="file"
                          id="businessLicense"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'businessLicense')}
                          required
                        />
                        <span className="file-label">
                          {formData.businessLicense ? formData.businessLicense.name : 'Choose file...'}
                        </span>
                      </div>
                      <small>Valid business registration or trade license</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="taxCertificate">
                        <span className="label-icon">💼</span>
                        Tax Registration Certificate (GST/PAN) *
                      </label>
                      <div className="file-input-wrapper">
                        <input
                          type="file"
                          id="taxCertificate"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'taxCertificate')}
                          required
                        />
                        <span className="file-label">
                          {formData.taxCertificate ? formData.taxCertificate.name : 'Choose file...'}
                        </span>
                      </div>
                      <small>GST certificate or PAN card for tax verification</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="authorizationLetter">
                        <span className="label-icon">✍️</span>
                        Government Authorization Letter *
                      </label>
                      <div className="file-input-wrapper">
                        <input
                          type="file"
                          id="authorizationLetter"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'authorizationLetter')}
                          required
                        />
                        <span className="file-label">
                          {formData.authorizationLetter ? formData.authorizationLetter.name : 'Choose file...'}
                        </span>
                      </div>
                      <small>Official authorization to handle seized goods auctions</small>
                    </div>

                    <button 
                      type="submit" 
                      className="submit-btn agency"
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Submit Documents for Review'}
                    </button>
                  </form>
                </div>
              </section>
            )}

            {/* Info Section */}
            <section className="dashboard-section">
              <div className="info-card">
                <h3>📌 Important Information</h3>
                <ul>
                  <li>All documents must be valid and up-to-date</li>
                  <li>Ensure documents are clearly readable and not blurred</li>
                  <li>Admin verification typically takes 2-3 business days</li>
                  <li>You'll be notified via email once documents are reviewed</li>
                  <li>Product addition will be enabled only after approval</li>
                </ul>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default UploadDocuments;
