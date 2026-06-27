import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, theme, toggleTheme } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <style>{`
        .custom-navbar {
          height: var(--navbar-height);
          background-color: var(--bg-sidebar);
          border-bottom: 1px solid var(--border-color);
          z-index: 1020;
          backdrop-filter: var(--glass-blur);
          position: fixed;
          top: 0;
          right: 0;
          left: var(--sidebar-width);
          transition: left var(--transition-normal);
        }
        @media (max-width: 991.98px) {
          .custom-navbar {
            left: 0;
          }
        }
      `}</style>
      <nav className="custom-navbar d-flex align-items-center justify-content-between px-4">
        {/* Mobile Toggle Button */}
        <button 
          className="btn btn-link text-secondary d-lg-none p-0 me-3" 
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <i className="bi bi-list fs-3"></i>
        </button>

        {/* Title / Section */}
        <div className="d-flex align-items-center">
          <span className="fs-5 fw-semibold d-none d-md-inline text-secondary">Task Manager Workspace</span>
        </div>

        {/* Right Actions */}
        <div className="d-flex align-items-center gap-3">
          {/* User Welcome */}
          {user && (
            <span className="text-secondary d-none d-sm-inline small">
              Welcome, <strong className="text-primary">{user.fullName}</strong>
            </span>
          )}

          {/* Theme Toggler */}
          <button 
            className="btn btn-link text-secondary p-1 border-0 shadow-none" 
            onClick={toggleTheme} 
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <i className="bi bi-sun-fill text-warning fs-5"></i>
            ) : (
              <i className="bi bi-moon-stars-fill text-primary fs-5"></i>
            )}
          </button>

          {/* User Initials Circle */}
          {user && (
            <div 
              className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle fw-bold shadow-sm"
              style={{ width: '38px', height: '38px', fontSize: '0.9rem' }}
            >
              {getInitials(user.fullName)}
            </div>
          )}

          {/* Logout */}
          <button 
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-3 py-1.5" 
            onClick={() => logout()} 
            style={{ borderRadius: '8px' }}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span className="d-none d-md-inline">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
