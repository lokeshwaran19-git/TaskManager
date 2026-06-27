import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect if already authenticated
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  // Read cookies/local storage for saved email
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    
    // Check if redirect due to expired session
    if (searchParams.get('expired') === 'true') {
      toast.warning('Session expired. Please log in again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      if (response.success) {
        login(
          response.data.token, 
          response.data.email, 
          response.data.fullName, 
          response.data.role
        );
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 px-3" style={{ background: 'linear-gradient(135deg, #090a0f 0%, #151929 100%)' }}>
      <div className="card glass-panel p-4 p-md-5 animate-fade-in" style={{ width: '100%', maxWidth: '450px' }}>
        
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
            <i className="bi bi-rocket-takeoff-fill fs-2"></i>
          </div>
          <h2 className="fw-bold m-0 gradient-text" style={{ fontSize: '2rem' }}>TaskFlow</h2>
          <p className="text-secondary small mt-1">Sign in to manage your tasks efficiently</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div className="mb-3">
            <label htmlFor="login-email" className="form-label small fw-semibold text-secondary">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-secondary" style={{ borderColor: 'var(--border-color)' }}>
                <i className="bi bi-envelope"></i>
              </span>
              <input
                id="login-email"
                type="email"
                className="form-control border-start-0 ps-0"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="mb-3">
            <label htmlFor="login-password" className="form-label small fw-semibold text-secondary">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-secondary" style={{ borderColor: 'var(--border-color)' }}>
                <i className="bi bi-lock"></i>
              </span>
              <input
                id="login-password"
                type="password"
                className="form-control border-start-0 ps-0"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Extra options */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input
                id="remember-me"
                type="checkbox"
                className="form-check-input"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="form-check-label text-secondary small" style={{ userSelect: 'none' }}>
                Remember me
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100 glow-btn mb-3 d-flex align-items-center justify-content-center" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            Sign In
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center mt-3">
          <p className="text-secondary small m-0">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary fw-semibold text-decoration-none">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
