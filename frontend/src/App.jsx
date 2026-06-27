import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Layout wrapper for authenticated pages
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area - offset by sidebar width on large screens */}
      <div
        style={{
          flex: 1,
          marginLeft: 'var(--sidebar-width)',
          transition: 'margin-left var(--transition-normal)',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
        className="main-content-area"
      >
        <style>{`
          @media (max-width: 991.98px) {
            .main-content-area {
              margin-left: 0 !important;
            }
          }
        `}</style>

        <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

        {/* Page content - push down below navbar */}
        <main style={{ marginTop: 'var(--navbar-height)', flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { token } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes wrapped in AppLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Tasks />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Root redirect */}
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          token ? (
            <AppLayout>
              <NotFound />
            </AppLayout>
          ) : (
            <NotFound />
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            background: 'var(--bg-sidebar)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            borderRadius: '12px',
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
