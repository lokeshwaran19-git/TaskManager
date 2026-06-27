import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight: '80vh', padding: '2rem' }}
    >
      <div style={{ fontSize: '6rem', lineHeight: 1 }}>
        <span className="gradient-text fw-black">404</span>
      </div>
      <i className="bi bi-compass text-muted mt-2 mb-3" style={{ fontSize: '3rem' }}></i>
      <h3 className="fw-bold mb-2">Page Not Found</h3>
      <p className="text-secondary mb-4" style={{ maxWidth: '400px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn btn-primary glow-btn px-4 d-flex align-items-center gap-2">
        <i className="bi bi-house-fill"></i>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
