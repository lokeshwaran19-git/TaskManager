import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfileState } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile Update State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.success) {
          setProfile(res.data);
          setFullName(res.data.fullName || '');
          setEmail(res.data.email || '');
        }
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setProfileLoading(true);
    try {
      const res = await api.put('/profile', { fullName, email });
      if (res.success) {
        setProfile(res.data);
        updateProfileState(res.data.email, res.data.fullName);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await api.put('/profile/change-password', {
        currentPassword,
        newPassword
      });
      if (res.success) {
        toast.success('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="container-fluid py-4 px-md-4 animate-fade-in">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold m-0" style={{ color: 'var(--text-primary)' }}>My Profile</h2>
        <p className="text-secondary small m-0">Manage your account details and security settings</p>
      </div>

      <div className="row g-4">
        {/* Left Column: Profile Card */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 text-center h-100">
            {/* Avatar */}
            <div
              className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle fw-bold mx-auto mb-3"
              style={{ width: '90px', height: '90px', fontSize: '2rem', boxShadow: '0 8px 20px var(--primary-glow)' }}
            >
              {getInitials(profile?.fullName)}
            </div>

            <h4 className="fw-bold mb-1">{profile?.fullName}</h4>
            <p className="text-secondary small mb-3">{profile?.email}</p>

            <hr style={{ borderColor: 'var(--border-color)' }} />

            {/* User info rows */}
            <div className="text-start">
              <div className="d-flex justify-content-between align-items-center py-2">
                <span className="text-secondary small d-flex align-items-center gap-2">
                  <i className="bi bi-shield-check text-primary"></i> Role
                </span>
                <span className="badge badge-status-in-progress px-2">{user?.role || 'USER'}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2">
                <span className="text-secondary small d-flex align-items-center gap-2">
                  <i className="bi bi-calendar3 text-primary"></i> Joined
                </span>
                <span className="small text-secondary">{formatDate(profile?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-4">
          {/* Update Profile Form */}
          <div className="glass-panel p-4">
            <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2">
              <i className="bi bi-person-fill text-primary"></i>
              Update Profile
            </h5>
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-3">
                <label htmlFor="profile-name" className="form-label small fw-semibold text-secondary">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 text-secondary" style={{ borderColor: 'var(--border-color)' }}>
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    id="profile-name"
                    type="text"
                    className="form-control border-start-0 ps-0"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="profile-email" className="form-label small fw-semibold text-secondary">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 text-secondary" style={{ borderColor: 'var(--border-color)' }}>
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    id="profile-email"
                    type="email"
                    className="form-control border-start-0 ps-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary glow-btn d-flex align-items-center gap-2"
                disabled={profileLoading}
              >
                {profileLoading && (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                )}
                <i className="bi bi-floppy-fill"></i>
                Save Changes
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="glass-panel p-4">
            <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2">
              <i className="bi bi-lock-fill text-warning"></i>
              Change Password
            </h5>
            <form onSubmit={handlePasswordChange}>
              <div className="mb-3">
                <label htmlFor="current-pass" className="form-label small fw-semibold text-secondary">Current Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 text-secondary" style={{ borderColor: 'var(--border-color)' }}>
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    id="current-pass"
                    type="password"
                    className="form-control border-start-0 ps-0"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="new-pass" className="form-label small fw-semibold text-secondary">New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 text-secondary" style={{ borderColor: 'var(--border-color)' }}>
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    id="new-pass"
                    type="password"
                    className="form-control border-start-0 ps-0"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="confirm-new-pass" className="form-label small fw-semibold text-secondary">Confirm New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 text-secondary" style={{ borderColor: 'var(--border-color)' }}>
                    <i className="bi bi-shield-lock"></i>
                  </span>
                  <input
                    id="confirm-new-pass"
                    type="password"
                    className="form-control border-start-0 ps-0"
                    placeholder="Repeat new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-warning d-flex align-items-center gap-2 fw-semibold"
                disabled={passwordLoading}
                style={{ borderRadius: '8px', color: '#000' }}
              >
                {passwordLoading && (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                )}
                <i className="bi bi-key-fill"></i>
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
