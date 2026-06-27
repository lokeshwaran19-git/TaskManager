import React from 'react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const isOverdue = 
    task.status !== 'COMPLETED' && 
    task.dueDate && 
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'LOW': return 'badge-priority-low';
      case 'MEDIUM': return 'badge-priority-medium';
      case 'HIGH': return 'badge-priority-high';
      default: return 'bg-secondary text-white';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'badge-status-pending';
      case 'IN_PROGRESS': return 'badge-status-in-progress';
      case 'COMPLETED': return 'badge-status-completed';
      default: return 'bg-secondary text-white';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="card glass-panel glass-panel-hover h-100 p-3 d-flex flex-column justify-content-between">
      <div>
        {/* Badges row */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className={`badge px-2.5 py-1 ${getPriorityBadgeClass(task.priority)}`} style={{ fontSize: '0.72rem', fontWeight: 600 }}>
            {task.priority}
          </span>
          <span className={`badge px-2.5 py-1 ${getStatusBadgeClass(task.status)}`} style={{ fontSize: '0.72rem', fontWeight: 600 }}>
            {task.status.replace('_', ' ')}
          </span>
        </div>

        {/* Task Title */}
        <h5 className="card-title fw-bold mb-2 text-truncate" title={task.title} style={{ color: 'var(--text-primary)' }}>
          {task.title}
        </h5>

        {/* Task Description */}
        <p className="card-text text-secondary small mb-3" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '4.5em'
        }}>
          {task.description || <em className="text-muted">No description provided.</em>}
        </p>
      </div>

      <div>
        <hr className="my-2" style={{ borderColor: 'var(--border-color)' }} />
        
        {/* Card footer details */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          {/* Due date status */}
          <div className="d-flex align-items-center gap-2 text-secondary small">
            <i className={`bi bi-calendar3 ${isOverdue ? 'text-danger' : 'text-primary'}`}></i>
            <span className={isOverdue ? 'text-danger fw-bold' : ''}>
              {formatDate(task.dueDate)} {isOverdue && '(Overdue)'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="d-flex gap-1">
            <button 
              className="btn btn-outline-primary btn-sm border-0 p-1 px-2 shadow-none" 
              onClick={() => onEdit(task)} 
              title="Edit Task"
            >
              <i className="bi bi-pencil-fill"></i>
            </button>
            <button 
              className="btn btn-outline-danger btn-sm border-0 p-1 px-2 shadow-none" 
              onClick={() => onDelete(task.id)} 
              title="Delete Task"
            >
              <i className="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
