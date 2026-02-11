import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Support.css';

const Support = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'You can update your profile by going to the Settings page. Click on your profile icon in the top right corner, select "Settings" from the dropdown menu, and edit your name, email, or password.'
    },
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Go to the Settings page and select the "Change Password" section. Enter your current password, then your new password twice to confirm, and click "Change Password".'
    },
    {
      category: 'orders',
      question: 'How do I track my order?',
      answer: 'Navigate to the "My Orders" page from your dashboard. Here you can see all your orders with their current status, tracking information, and estimated delivery dates.'
    },
    {
      category: 'orders',
      question: 'What is the return policy?',
      answer: 'Items can be returned within 30 days of delivery if they are in their original condition. Contact the agency directly through the messaging system to initiate a return.'
    },
    {
      category: 'products',
      question: 'How do I add a product to my watchlist?',
      answer: 'When browsing products, click the heart icon next to any product to add it to your watchlist. You can view all saved items on the Watchlist page.'
    },
    {
      category: 'products',
      question: 'Are all products authentic?',
      answer: 'Yes, all products on Setu are verified government-seized items. Each product listing includes detailed descriptions, condition reports, and original price information.'
    },
    {
      category: 'agency',
      question: 'How do I list a new product as an agency?',
      answer: 'From your Agency Dashboard, click "Add Product" in the sidebar or select the "Add New Product" action card. Fill in all required details including title, description, pricing, and upload product images.'
    },
    {
      category: 'agency',
      question: 'How long does product approval take?',
      answer: 'Product approvals typically take 1-3 business days. You will receive a notification once your product has been reviewed. Ensure all product information is accurate to avoid delays.'
    },
    {
      category: 'agency',
      question: 'How do I view my sales analytics?',
      answer: 'Click on "Analytics" in your sidebar to view detailed metrics including total revenue, conversion rates, views, and monthly sales breakdowns.'
    },
    {
      category: 'messaging',
      question: 'How do I contact an agency about a product?',
      answer: 'Go to the product detail page and click the "Message Agency" button, or navigate to the Messages page and start a new conversation. All your messages are organized in one place.'
    },
    {
      category: 'messaging',
      question: 'How do I know when I have a new message?',
      answer: 'You will see a notification badge on the Messages icon in your sidebar. You can also enable email notifications in your Settings page.'
    },
    {
      category: 'payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept major credit cards, debit cards, UPI, and net banking. All transactions are securely processed through our encrypted payment gateway.'
    },
    {
      category: 'payment',
      question: 'Is my payment information secure?',
      answer: 'Yes, all payment information is encrypted and processed through PCI-compliant payment gateways. We never store your full card details on our servers.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'orders', name: 'Orders', icon: '📦' },
    { id: 'products', name: 'Products', icon: '🛍️' },
    { id: 'agency', name: 'For Agencies', icon: '🏢' },
    { id: 'messaging', name: 'Messaging', icon: '💬' },
    { id: 'payment', name: 'Payment', icon: '💳' }
  ];

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isAgency = user?.role === 'agency';

  if (!user) return null;

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
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate(isAgency ? '/dashboard/agency' : '/dashboard/customer'); }}>
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
          <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/support'); }}>
            <span className="nav-icon">❓</span>
            <span>Support</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>
            <span className="nav-icon">📞</span>
            <span>Contact Us</span>
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
            <h1>Help & Support</h1>
            <p>Find answers to frequently asked questions</p>
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

        <div className="support-search-section">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="support-search-input"
            />
          </div>
        </div>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Help Categories</h2>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <span className="faq-count">{filteredFaqs.length} results</span>
          </div>
          <div className="faq-list">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-item ${openFaq === index ? 'open' : ''}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-toggle">{openFaq === index ? '−' : '+'}</span>
                  </button>
                  {openFaq === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No results found</h3>
                <p>Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-section support-contact-section">
          <div className="section-header">
            <h2>Still Need Help?</h2>
          </div>
          <div className="support-options">
            <div className="support-option-card">
              <span className="support-option-icon">📞</span>
              <h3>Contact Us</h3>
              <p>Reach out to our support team directly</p>
              <button className="support-option-btn" onClick={() => navigate('/contact')}>
                Get in Touch
              </button>
            </div>
            <div className="support-option-card">
              <span className="support-option-icon">💬</span>
              <h3>Live Chat</h3>
              <p>Chat with our support agents in real-time</p>
              <button className="support-option-btn" onClick={() => navigate('/messages')}>
                Start Chat
              </button>
            </div>
            <div className="support-option-card">
              <span className="support-option-icon">📧</span>
              <h3>Email Support</h3>
              <p>Send us an email at support@setu.gov.in</p>
              <button className="support-option-btn" onClick={() => window.location.href = 'mailto:support@setu.gov.in'}>
                Send Email
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Support;
