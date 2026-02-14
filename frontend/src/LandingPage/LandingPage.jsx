import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LandingPage.css';
import logoImg from '../assets/logo.svg';
import mobileImg from '../assets/mobile.svg';
import couchImg from '../assets/couch.svg';
import shirtImg from '../assets/shirt.svg';
import checkImg from '../assets/check.svg';
import lockImg from '../assets/lock.svg';
import magnifyImg from '../assets/magnify.svg';
import moneyImg from '../assets/money.svg';
import fileImg from '../assets/file.svg';
import buildingImg from '../assets/globe.svg';
import globeImg from '../assets/globe.svg';
import chartBarImg from '../assets/chart-bar.svg';
import recycleImg from '../assets/recycle.svg';
import arrowImg from '../assets/arrow.svg';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon"><img src={logoImg} alt="Setu logo" /></span>
            <span className="logo-text">Setu</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
            <button className="nav-btn login-btn" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="nav-btn signup-btn" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              GovTech • Public Asset Management • Digital Marketplace
            </div>
            <h1 className="hero-title">
              Unlock Access to
              <span className="gradient-text"> Government Auctions</span>
              <br />
              of Seized Imported Goods
            </h1>
            <p className="hero-description">
              Transforming billions worth of seized goods into affordable opportunities. 
              Connect directly with verified government agencies and discover premium 
              products at unprecedented prices.
            </p>
            <div className="hero-cta">
              <button className="cta-primary" onClick={() => navigate('/signup')}>
                Get Started Free
                <span className="arrow"><img src={arrowImg} alt="arrow" /></span>
              </button>
              <button className="cta-secondary" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">₹100Cr+</div>
                <div className="stat-label">Worth of Goods</div>
              </div>
              <div className="stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Verified Agencies</div>
              </div>
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Products Listed</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-card card-1">
              <div className="card-icon"><img src={mobileImg} alt="Electronics"/></div>
              <div className="card-text">Electronics</div>
              <div className="card-price">Up to 70% Off</div>
            </div>
            <div className="visual-card card-2">
              <div className="card-icon"><img src={couchImg} alt="Furniture"/></div>
              <div className="card-text">Furniture</div>
              <div className="card-price">Premium Quality</div>
            </div>
            <div className="visual-card card-3">
              <div className="card-icon"><img src={shirtImg} alt="Clothing"/></div>
              <div className="card-text">Clothing</div>
              <div className="card-price">Brand New</div>
            </div>
            <div className="floating-badge badge-1">
              <span className="badge-check"><img src={checkImg} alt="verified"/></span> Verified
            </div>
            <div className="floating-badge badge-2">
              <span className="badge-check"><img src={lockImg} alt="secure"/></span> Secure
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="problem-section" id="about">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">The Problem</span>
            <h2>Billions in Seized Goods Go Unsold</h2>
            <p>Government-seized imported goods worth billions remain hidden from the public, creating a massive opportunity gap.</p>
          </div>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon"><img src={magnifyImg} alt="Low visibility"/></div>
              <h3>Low Visibility</h3>
              <p>Auction information scattered across multiple government portals</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon"><img src={moneyImg} alt="High costs"/></div>
              <h3>High Costs</h3>
              <p>Upfront fees and EMD requirements block public access</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon"><img src={fileImg} alt="Compliance"/></div>
              <h3>Complex Compliance</h3>
              <p>KYC, PAN, GST hurdles prevent easy participation</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon"><img src={buildingImg} alt="Centralized power"/></div>
              <h3>Centralized Power</h3>
              <p>Middlemen control access to valuable auction opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Our Solution</span>
            <h2>Transparent, Accessible, Affordable</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><img src={globeImg} alt="Digital marketplace"/></div>
              <h3>Digital Marketplace</h3>
              <p>Centralized platform connecting buyers with verified government agencies</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><img src={checkImg} alt="Verified sellers"/></div>
              <h3>Verified Sellers Only</h3>
              <p>All agencies undergo strict verification for your safety</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><img src={chartBarImg} alt="Smart stock"/></div>
              <h3>Smart Stock Control</h3>
              <p>Real-time inventory tracking and automated updates</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><img src={chartBarImg} alt="Tender tracking"/></div>
              <h3>Tender Tracking Dashboard</h3>
              <p>Monitor all active auctions and your bids in one place</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><img src={lockImg} alt="Safe buys"/></div>
              <h3>Safe & Legal Buys</h3>
              <p>Every transaction is secure, verified, and fully compliant</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><img src={recycleImg} alt="Resource circularity"/></div>
              <h3>Resource Circularity</h3>
              <p>Reducing waste by giving seized goods a second life</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Process</span>
            <h2>How Setu Works</h2>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">01</div>
              <h3>Government Seizes Goods</h3>
              <p>Imported goods seized due to legal violations and unpaid customs</p>
            </div>
            <div className="step-arrow"><img src={arrowImg} alt="arrow"/></div>
            <div className="step">
              <div className="step-number">02</div>
              <h3>Agency Lists on Setu</h3>
              <p>Verified agencies upload goods for public auction after approval</p>
            </div>
            <div className="step-arrow"><img src={arrowImg} alt="arrow"/></div>
            <div className="step">
              <div className="step-number">03</div>
              <h3>You Browse & Buy</h3>
              <p>Discover products, place bids, and purchase at great prices</p>
            </div>
            <div className="step-arrow"><img src={arrowImg} alt="arrow"/></div>
            <div className="step">
              <div className="step-number">04</div>
              <h3>Secure Delivery</h3>
              <p>Complete payment and receive your items safely at home</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Start Saving?</h2>
          <p>Join thousands discovering premium goods at unbeatable prices</p>
          <div className="cta-buttons">
            <button className="cta-btn primary" onClick={() => navigate('/signup')}>
              Create Free Account
            </button>
            <button className="cta-btn secondary" onClick={() => navigate('/login')}>
              I Already Have Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon"><img src={logoImg} alt="Setu logo" /></span>
              <span className="logo-text">Setu</span>
            </div>
            <p>Bridging the gap between government auctions and the public.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <Link to="/features">Features</Link>
              <Link to="/how-it-works">How It Works</Link>
              <Link to="/about">About</Link>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/compliance">Compliance</Link>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/faq">FAQ</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Setu. All rights reserved. | GovTech Public Asset Management Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;