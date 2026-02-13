import React from 'react';

const ContactUs = () => (
  <section className="problem-section">
    <div className="section-container">
      <div className="section-header">
        <span className="section-tag">Support</span>
        <h2>Contact Us</h2>
        <p>We're here to help — reach out and we'll respond as soon as possible.</p>
      </div>

      <div className="problem-grid">
        <div className="problem-card">
          <h3>General Inquiries</h3>
          <p>Email: support@setu.example — typical response within 24-48 hours.</p>
        </div>
        <div className="problem-card">
          <h3>Partnerships & Agencies</h3>
          <p>For agency onboarding and partnerships, contact partners@setu.example.</p>
        </div>
        <div className="problem-card">
          <h3>Press</h3>
          <p>Media requests: press@setu.example.</p>
        </div>
      </div>
    </div>
  </section>
);

export default ContactUs;
