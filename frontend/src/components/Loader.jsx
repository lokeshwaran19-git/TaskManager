import React from 'react';

const Loader = ({ fullScreen = false }) => {
  return (
    <div 
      className={`d-flex justify-content-center align-items-center ${
        fullScreen ? 'vw-100 vh-100 position-fixed top-0 start-0' : 'py-5'
      }`} 
      style={{ 
        zIndex: 9999,
        background: fullScreen ? 'var(--bg-app)' : 'transparent' 
      }}
    >
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
