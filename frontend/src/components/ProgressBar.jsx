import React from 'react';

const ProgressBar = ({ percentage }) => {
  const rounded = Math.round(percentage) || 0;
  
  return (
    <div className="progress-container w-100">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="text-secondary small fw-medium">Task Completion</span>
        <span className="text-primary small fw-bold">{rounded}%</span>
      </div>
      <div className="progress" style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '10px', overflow: 'visible' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${rounded}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--success))',
            borderRadius: '10px',
            boxShadow: '0 0 10px var(--primary-glow)',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          aria-valuenow={rounded}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
