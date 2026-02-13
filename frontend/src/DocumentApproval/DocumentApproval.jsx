import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './DocumentApproval.css';

const DocumentApproval = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login/admin');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      navigate('/login/admin');
      return;
    }

    setUser(parsedUser);
    fetchDocuments();
  }, [navigate]);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/api/documents/all');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (documentId) => {
    if (!window.confirm('Are you sure you want to approve these documents?')) {
      return;
    }

    setProcessing(true);
    try {
      await api.post('/api/documents/update-status', {
        documentId,
        status: 'approved'
      });
      alert('Documents approved successfully!');
      fetchDocuments();
      setSelectedDoc(null);
    } catch (error) {
      alert('Failed to approve documents');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (documentId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);
    try {
      await api.post('/api/documents/update-status', {
        documentId,
        status: 'rejected',
        rejectionReason
      });
      alert('Documents rejected');
      fetchDocuments();
      setSelectedDoc(null);
      setRejectionReason('');
    } catch (error) {
      alert('Failed to reject documents');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const filteredDocuments = documents.filter(doc => filter === 'all' || doc.status === filter);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'status-badge-doc pending', text: 'Pending', icon: '⏳' },
      approved: { class: 'status-badge-doc approved', text: 'Approved', icon: '✓' },
      rejected: { class: 'status-badge-doc rejected', text: 'Rejected', icon: '✗' }
    };
    return badges[status];
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🔓</span>
            <span className="logo-text">Setu</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/dashboard/admin'); }}>
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/document-approval'); }}>
            <span className="nav-icon">📄</span>
            <span>Document Approval</span>
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
            <h1>Document Verification</h1>
            <p>Review and approve agency documents</p>
          </div>
          <div className="header-actions">
            <button className="header-btn">
              <span>🔔</span>
            </button>
            <div className="user-profile">
              <div className="profile-avatar admin">{user.name.charAt(0).toUpperCase()}</div>
              <div className="profile-info">
                <div className="profile-name">{user.name}</div>
                <div className="profile-role">Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({documents.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({documents.filter(d => d.status === 'pending').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved ({documents.filter(d => d.status === 'approved').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({documents.filter(d => d.status === 'rejected').length})
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading documents...</div>
        ) : filteredDocuments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No documents found</h3>
            <p>No {filter !== 'all' ? filter : ''} documents at the moment</p>
          </div>
        ) : (
          <section className="dashboard-section">
            <div className="documents-grid">
              {filteredDocuments.map((doc) => (
                <div key={doc._id} className="document-card">
                  <div className="doc-card-header">
                    <div>
                      <h3>{doc.agencyName}</h3>
                      <p className="doc-email">{doc.agencyEmail}</p>
                    </div>
                    <div className={getStatusBadge(doc.status).class}>
                      <span>{getStatusBadge(doc.status).icon}</span>
                      {getStatusBadge(doc.status).text}
                    </div>
                  </div>

                  <div className="doc-card-body">
                    <div className="doc-info-row">
                      <span className="doc-label">📋 Business License:</span>
                      <span className="doc-value">{doc.businessLicense}</span>
                    </div>
                    <div className="doc-info-row">
                      <span className="doc-label">💼 Tax Certificate:</span>
                      <span className="doc-value">{doc.taxCertificate}</span>
                    </div>
                    <div className="doc-info-row">
                      <span className="doc-label">✍️ Authorization Letter:</span>
                      <span className="doc-value">{doc.authorizationLetter}</span>
                    </div>
                    <div className="doc-info-row">
                      <span className="doc-label">📅 Uploaded:</span>
                      <span className="doc-value">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    {doc.reviewedAt && (
                      <div className="doc-info-row">
                        <span className="doc-label">✓ Reviewed:</span>
                        <span className="doc-value">{new Date(doc.reviewedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {doc.rejectionReason && (
                      <div className="rejection-reason">
                        <strong>Rejection Reason:</strong> {doc.rejectionReason}
                      </div>
                    )}
                  </div>

                  {doc.status === 'pending' && (
                    <div className="doc-card-actions">
                      <button 
                        className="action-btn approve-btn"
                        onClick={() => handleApprove(doc._id)}
                        disabled={processing}
                      >
                        ✓ Approve
                      </button>
                      <button 
                        className="action-btn reject-btn"
                        onClick={() => setSelectedDoc(doc)}
                        disabled={processing}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rejection Modal */}
        {selectedDoc && (
          <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Reject Documents</h3>
              <p>Agency: <strong>{selectedDoc.agencyName}</strong></p>
              <textarea
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="4"
                className="rejection-textarea"
              />
              <div className="modal-actions">
                <button 
                  className="modal-btn cancel-btn"
                  onClick={() => {
                    setSelectedDoc(null);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="modal-btn confirm-btn"
                  onClick={() => handleReject(selectedDoc._id)}
                  disabled={processing || !rejectionReason.trim()}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentApproval;
