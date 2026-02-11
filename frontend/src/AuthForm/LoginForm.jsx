import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './AuthForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { userType } = useParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const { token, user } = response.data;

      // Check if user role matches the selected userType
      if (user.role !== userType) {
        setError(`This account is registered as ${user.role}. Please use the correct portal.`);
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('Login successful:', response.data);
      
      // Redirect to appropriate dashboard
      if (userType === 'customer') {
        navigate('/dashboard/customer');
      } else {
        navigate('/dashboard/agency');
      }
      
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-content">
        <button className="back-btn" onClick={() => navigate('/login')}>
          ← Back to Selection
        </button>

        <div className="form-card">
          <div className="form-header">
            <div className="form-icon">
              {userType === 'customer' ? '👤' : '🏢'}
            </div>
            <h2>{userType === 'customer' ? 'Customer' : 'Agency'} Login</h2>
            <p>Welcome back! Please login to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button type="button" className="link-btn">
                Forgot password?
              </button>
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${userType}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="form-footer">
            <p>
              Don't have an account?{' '}
              <button 
                onClick={() => navigate(`/signup/${userType}`)} 
                className="link-btn"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;