import React from "react";
import "./PortalSelection.css";

const PortalSelection = () => {
  return (
    <div className="portal-container">
      <h1>Welcome to Our Portal</h1>
      <p className="subtitle">
        Select your account type to access your personalized dashboard experience
      </p>

      <div className="card-wrapper">

        <div className="portal-card">
          <div className="card-top">
            <div className="icon">👤</div>
          </div>
          <h3>Customer Portal</h3>
          <p>Access your account information, view reports, and manage your services.</p>
          <button>Access Dashboard</button>
        </div>

        <div className="portal-card">
          <div className="card-top">
            <div className="icon">🏢</div>
          </div>
          <h3>Agency Portal</h3>
          <p>Manage clients, access agency tools, and view performance metrics.</p>
          <button>Access Dashboard</button>
        </div>

      </div>

      <div className="help-box">
        <h4>Need Help?</h4>
        <p>Not sure which portal to choose or having trouble logging in?</p>
        <div className="help-buttons">
          <button className="secondary">Get Support</button>
          <button className="secondary">Contact Us</button>
        </div>
      </div>
    </div>
  );
};

export default PortalSelection;
