import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ProgressBar from '../components/ProgressBar';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await api.get('/dashboard/stats');
        const tasksRes = await api.get('/tasks?page=0&size=4&sortBy=newest&sortDir=desc');
        
        if (statsRes.success) {
          setStats(statsRes.data);
        }
        if (tasksRes.success) {
          setRecentTasks(tasksRes.data.content || []);
        }
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const cards = [
    {
      title: 'Total Tasks',
      value: stats?.totalTasks || 0,
      icon: 'bi-list-task',
      glowColor: 'var(--primary-glow)',
      textColor: 'text-primary'
    },
    {
      title: 'Completed',
      value: stats?.completedTasks || 0,
      icon: 'bi-check-circle-fill',
      glowColor: 'var(--success-glow)',
      textColor: 'text-success'
    },
    {
      title: 'Pending',
      value: stats?.pendingTasks || 0,
      icon: 'bi-clock-fill',
      glowColor: 'var(--warning-glow)',
      textColor: 'text-warning'
    },
    {
      title: 'High Priority',
      value: stats?.highPriorityTasks || 0,
      icon: 'bi-exclamation-triangle-fill',
      glowColor: 'var(--danger-glow)',
      textColor: 'text-danger'
    },
    {
      title: 'Overdue Tasks',
      value: stats?.overdueTasks || 0,
      icon: 'bi-calendar-x-fill',
      glowColor: stats?.overdueTasks > 0 ? 'var(--danger-glow)' : 'var(--border-color)',
      textColor: stats?.overdueTasks > 0 ? 'text-danger' : 'text-muted'
    }
  ];

  return (
    <div className="container-fluid py-4 px-md-4 animate-fade-in">
      {/* Dashboard Welcome Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold m-0" style={{ color: 'var(--text-primary)' }}>Dashboard</h2>
          <p className="text-secondary small m-0">Review your statistics and recent task progression</p>
        </div>
        <div 
          className="glass-panel p-3 border-0 d-flex align-items-center gap-3" 
          style={{ width: '100%', maxWidth: '350px', background: 'rgba(255,255,255,0.02)' }}
        >
          <i className="bi bi-person-badge text-primary fs-3 animate-pulse"></i>
          <div>
            <span className="small text-muted d-block">Logged in as</span>
            <span className="small fw-semibold text-truncate d-block" style={{ maxWidth: '240px' }}>{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Progress overview */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="glass-panel p-4">
            <h5 className="fw-semibold mb-3">Overall Task Progress</h5>
            <ProgressBar percentage={stats?.completionPercentage || 0} />
          </div>
        </div>
      </div>

      {/* Stats row cards */}
      <div className="row g-4 mb-4">
        {cards.map((card, idx) => (
          <div key={idx} className="col-6 col-md-4 col-xxl-2.4 flex-fill">
            <div 
              className="card glass-panel h-100 p-3 d-flex flex-column justify-content-between position-relative overflow-hidden" 
              style={{ boxShadow: `0 8px 24px ${card.glowColor}`, border: '1px solid var(--border-color)' }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-secondary small fw-medium">{card.title}</span>
                <i className={`bi ${card.icon} fs-4 ${card.textColor}`}></i>
              </div>
              <h3 className="fw-bold m-0 mt-2" style={{ fontSize: '2rem' }}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent tasks list */}
      <div className="row g-4">
        <div className="col-12">
          <div className="glass-panel p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-semibold m-0">Recent Tasks</h5>
              <Link to="/tasks" className="btn btn-sm btn-outline-primary px-3" style={{ borderRadius: '8px' }}>
                View All <i className="bi bi-arrow-right small"></i>
              </Link>
            </div>

            {recentTasks.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-clipboard-x text-muted fs-2"></i>
                <p className="text-secondary small mt-2">No tasks found. Click "View All" to create one!</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTasks.map((task) => (
                      <tr key={task.id}>
                        <td>
                          <span className="fw-medium">{task.title}</span>
                          <span className="d-block text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                            {task.description || 'No description'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            task.priority === 'HIGH' ? 'badge-priority-high' :
                            task.priority === 'MEDIUM' ? 'badge-priority-medium' :
                            'badge-priority-low'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            task.status === 'COMPLETED' ? 'badge-status-completed' :
                            task.status === 'IN_PROGRESS' ? 'badge-status-in-progress' :
                            'badge-status-pending'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="text-secondary small">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
