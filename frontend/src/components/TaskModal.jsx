import React, { useState, useEffect } from 'react';

const TaskModal = ({ isOpen, onClose, task, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('PENDING');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'MEDIUM');
      setStatus(task.status || 'PENDING');
      setDueDate(task.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setStatus('PENDING');
      setDueDate('');
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        title,
        description,
        priority,
        status,
        dueDate: dueDate || null
      });
      onClose();
    } catch (err) {
      // Error handles in parent component
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .custom-modal-overlay {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(5px);
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .custom-modal-container {
          width: 100%;
          max-width: 550px;
          background-color: var(--bg-sidebar);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          box-shadow: var(--shadow-lg);
          animation: modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="custom-modal-overlay" onClick={onClose}>
        <div className="custom-modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modal-header d-flex justify-content-between align-items-center p-3 px-4">
            <h5 className="modal-title fw-bold m-0" style={{ color: 'var(--text-primary)' }}>
              {task ? 'Edit Task' : 'Create New Task'}
            </h5>
            <button 
              className="btn btn-link text-secondary p-0 shadow-none" 
              onClick={onClose} 
              aria-label="Close"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              
              {/* Title input */}
              <div className="mb-3">
                <label htmlFor="task-title" className="form-label small fw-semibold text-secondary">Title *</label>
                <input
                  id="task-title"
                  type="text"
                  className="form-control"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description input */}
              <div className="mb-3">
                <label htmlFor="task-desc" className="form-label small fw-semibold text-secondary">Description</label>
                <textarea
                  id="task-desc"
                  className="form-control"
                  rows="3"
                  placeholder="Describe your task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              {/* Priority and Status dropdowns */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="task-priority" className="form-label small fw-semibold text-secondary">Priority</label>
                  <select
                    id="task-priority"
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="task-status" className="form-label small fw-semibold text-secondary">Status</label>
                  <select
                    id="task-status"
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              {/* Due date datepicker */}
              <div className="mb-2">
                <label htmlFor="task-due" className="form-label small fw-semibold text-secondary">Due Date</label>
                <input
                  id="task-due"
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // Block yesterday
                />
              </div>
            </div>

            {/* Modal actions footer */}
            <div className="modal-footer p-3 px-4 d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-outline-secondary px-4 shadow-none" 
                onClick={onClose} 
                style={{ borderRadius: '8px' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary glow-btn px-4 shadow-none" 
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                ) : null}
                {task ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TaskModal;
