import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        fullName,
        email,
        password
      });

      if (response.success) {
        toast.success('Registration successful! Please log in.');
        navigate('/login');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 px-3" style={{ background: 'linear-gradient(135deg, #090a0f 0%, #151929 100%)' }}>
      <div className="card glass-panel p-4 p-md-5 animate-fade-in" style={{ width: '100%', maxWidth: '480px' }}>
        
        {/* Header logo & title */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
            <i className="bi bi-person-plus-fill fs-2"></i>
          </div>
          <h2 className="fw-bold m-0 gradient-text" style={{ fontSize: '2rem' }}>Create Account</h2>
          <p className="text-secondary small mt-1">Sign up to get started with TaskFlow</p>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSubmit}>
          {/* Full Name field */}
          <div className="mb-3">
            <label htmlFor="reg-name" className="form-label small fw-semibold text-secondary">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-secondary" style={{ borderColor: 'var(--border-color)' }}>
                <i className="bi bi-person"></i>
              </span>
              <input
                id="reg-name"
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email field */}
          <div className="mb-3">
            <label htmlFor="reg-email" className="form-label small fw-semibold text-secondary">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-secondary" style={{ borderColor: 'var(--border-color)' }}>
                <i className="bi bi-envelope"></i>
              </span>
              <input
                id="reg-email"
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
            <label htmlFor="reg-pass" className="form-label small fw-semibold text-secondary">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-secondary" style={{ borderColor: 'var(--border-color)' }}>
                <i className="bi bi-lock"></i>
              </span>
              <input
                id="reg-pass"
                type="password"
                className="form-control border-start-0 ps-0"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password confirmation */}
          <div className="mb-4">
            <label htmlFor="reg-confirm" className="form-label small fw-semibold text-secondary">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-secondary" style={{ borderColor: 'var(--border-color)' }}>
                <i className="bi bi-shield-lock"></i>
              </span>
              <input
                id="reg-confirm"
                type="password"
                className="form-control border-start-0 ps-0"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="btn btn-primary w-100 glow-btn mb-3 d-flex align-items-center justify-content-center" 
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            Sign Up
          </button>
        </form>

        {/* Foot links */}
        <div className="text-center mt-2">
          <p className="text-secondary small m-0">
            Already have an account?{' '}
            <Link to="/login" className="text-primary fw-semibold text-decoration-none">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
