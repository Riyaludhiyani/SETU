import React from 'react';

const HelpCenter = () => (
  <section className="features-section">
    <div className="section-container">
      <div className="section-header">
        <span className="section-tag">Support</span>
        <h2>Help Center</h2>
        <p>Guides, troubleshooting tips and resources to get you started.</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>Getting Started</h3>
          <p>How to create an account, complete KYC and browse auctions.</p>
        </div>
        <div className="feature-card">
          <h3>Payments & Fees</h3>
          <p>Overview of accepted payment methods, fees and dispute handling.</p>
        </div>
        <div className="feature-card">
          <h3>Delivery & Pickup</h3>
          <p>Options for collecting items, courier partnerships and insured shipments.</p>
        </div>
      </div>
    </div>
  </section>
);

export default HelpCenter;
