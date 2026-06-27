import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { to: '/tasks', label: 'Tasks', icon: 'bi-check2-square' },
    { to: '/profile', label: 'Profile', icon: 'bi-person-circle' }
  ];

  return (
    <>
      <style>{`
        .custom-sidebar {
          width: var(--sidebar-width);
          background-color: var(--bg-sidebar);
          border-right: 1px solid var(--border-color);
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 1040;
          transition: transform var(--transition-normal);
        }
        
        .sidebar-link {
          color: var(--text-secondary);
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 16px;
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .sidebar-link:hover {
          color: var(--text-primary);
          background-color: rgba(255, 255, 255, 0.03);
        }

        .sidebar-link.active {
          color: white !important;
          background-color: var(--primary) !important;
          box-shadow: 0 4px 12px var(--primary-glow) !important;
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1035;
        }

        @media (max-width: 991.98px) {
          .custom-sidebar {
            transform: translateX(${isOpen ? '0' : '-100%'});
          }
          .sidebar-overlay {
            display: ${isOpen ? 'block' : 'none'};
          }
        }
      `}</style>

      {/* Mobile overlay backdrop */}
      <div className="sidebar-overlay" onClick={onClose}></div>

      {/* Sidebar navigation */}
      <aside className="custom-sidebar d-flex flex-column py-4">
        {/* Brand Logo header */}
        <div className="px-4 mb-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-rocket-takeoff-fill text-primary fs-3 animate-bounce"></i>
            <span className="fs-4 fw-bold gradient-text">TaskFlow</span>
          </div>
          {/* Close for mobile */}
          <button 
            className="btn btn-link text-secondary d-lg-none p-0" 
            onClick={onClose} 
            aria-label="Close Sidebar"
          >
            <i className="bi bi-x-lg fs-5"></i>
          </button>
        </div>

        {/* Nav list */}
        <nav className="flex-grow-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${link.icon} fs-5`}></i>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer info box */}
        <div className="px-4 mt-auto">
          <div className="glass-panel p-3 border-0 bg-opacity-10" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <span className="small text-muted d-block text-center">Version 1.0.0</span>
            <span className="small text-muted d-block text-center">© 2026 TaskFlow</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
