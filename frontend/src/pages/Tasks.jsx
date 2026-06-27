import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { toast } from 'react-toastify';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [sortDir, setSortDir] = useState('desc');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Custom Delete Confirm States
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      let query = `/tasks?page=${currentPage}&size=10&sortBy=${sortBy}&sortDir=${sortDir}`;
      if (search.trim()) query += `&search=${encodeURIComponent(search)}`;
      if (statusFilter) query += `&status=${statusFilter}`;
      if (priorityFilter) query += `&priority=${priorityFilter}`;
      if (dueDateFilter) query += `&dueDate=${dueDateFilter}`;

      const res = await api.get(query);
      if (res.success) {
        setTasks(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter, priorityFilter, dueDateFilter, sortBy, sortDir]);

  useEffect(() => {
    // Fetch immediately on filters change
    fetchTasks();
  }, [fetchTasks]);

  // Reset page when filters change
  const handleFilterChange = (filterSetter, val) => {
    filterSetter(val);
    setCurrentPage(0);
  };

  // Submit Handler for Task Creation/Update
  const handleTaskSubmit = async (taskData) => {
    try {
      let res;
      if (editingTask) {
        res = await api.put(`/tasks/${editingTask.id}`, taskData);
        if (res.success) {
          toast.success('Task updated successfully');
          fetchTasks();
        }
      } else {
        res = await api.post('/tasks', taskData);
        if (res.success) {
          toast.success('Task created successfully');
          fetchTasks();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Action failed');
      throw err;
    }
  };

  // Trigger Delete confirmation
  const handleDeleteTrigger = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!taskToDelete) return;
    try {
      const res = await api.delete(`/tasks/${taskToDelete}`);
      if (res.success) {
        toast.success('Task deleted successfully');
        // If last item deleted on last page, step back page
        if (tasks.length === 1 && currentPage > 0) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchTasks();
        }
      }
    } catch (err) {
      toast.error('Failed to delete task');
    } finally {
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleEditTrigger = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleCreateTrigger = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

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

  return (
    <div className="container-fluid py-4 px-md-4 animate-fade-in">
      
      {/* Title & Actions Row */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold m-0" style={{ color: 'var(--text-primary)' }}>Task Workspace</h2>
          <p className="text-secondary small m-0">Create, search, filter, and structure your backlog</p>
        </div>
        <button className="btn btn-primary glow-btn d-flex align-items-center gap-2 py-2" onClick={handleCreateTrigger}>
          <i className="bi bi-plus-lg fs-5"></i>
          <span>Add Task</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel p-4 mb-4">
        <div className="row g-3 align-items-end">
          {/* Search bar */}
          <div className="col-12 col-md-4 col-lg-3">
            <label htmlFor="search" className="form-label small fw-semibold text-secondary">Search</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-secondary" style={{ borderColor: 'var(--border-color)' }}>
                <i className="bi bi-search"></i>
              </span>
              <input
                id="search"
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => handleFilterChange(setSearch, e.target.value)}
              />
            </div>
          </div>

          {/* Status filter */}
          <div className="col-6 col-md-2 col-lg-2">
            <label htmlFor="statusFilter" className="form-label small fw-semibold text-secondary">Status</label>
            <select
              id="statusFilter"
              className="form-select"
              value={statusFilter}
              onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="col-6 col-md-2 col-lg-2">
            <label htmlFor="priorityFilter" className="form-label small fw-semibold text-secondary">Priority</label>
            <select
              id="priorityFilter"
              className="form-select"
              value={priorityFilter}
              onChange={(e) => handleFilterChange(setPriorityFilter, e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Due date filter */}
          <div className="col-6 col-md-2 col-lg-2">
            <label htmlFor="dueDateFilter" className="form-label small fw-semibold text-secondary">Due Date</label>
            <input
              id="dueDateFilter"
              type="date"
              className="form-control"
              value={dueDateFilter}
              onChange={(e) => handleFilterChange(setDueDateFilter, e.target.value)}
            />
          </div>

          {/* Sorting */}
          <div className="col-6 col-md-2 col-lg-3 flex-grow-1">
            <label htmlFor="sortSelect" className="form-label small fw-semibold text-secondary">Sort By</label>
            <select
              id="sortSelect"
              className="form-select"
              value={`${sortBy}-${sortDir}`}
              onChange={(e) => {
                const [by, dir] = e.target.value.split('-');
                setSortBy(by);
                setSortDir(dir);
                setCurrentPage(0);
              }}
            >
              <option value="newest-desc">Newest First</option>
              <option value="oldest-asc">Oldest First</option>
              <option value="dueDate-asc">Due Date (Closest)</option>
              <option value="priority-desc">Priority (Highest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid / List Toggler & Totals */}
      <div className="d-flex justify-content-between align-items-center mb-3 px-1">
        <span className="small text-secondary">
          Showing <strong className="text-primary">{tasks.length}</strong> of {totalElements} tasks
        </span>
        
        {/* Toggle view buttons */}
        <div className="d-flex gap-1 bg-dark bg-opacity-25 rounded p-1" style={{ border: '1px solid var(--border-color)' }}>
          <button 
            className={`btn btn-sm border-0 p-1 px-2.5 ${viewMode === 'grid' ? 'btn-primary text-white shadow-sm' : 'text-secondary'}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
            style={{ borderRadius: '6px' }}
          >
            <i className="bi bi-grid-fill"></i>
          </button>
          <button 
            className={`btn btn-sm border-0 p-1 px-2.5 ${viewMode === 'table' ? 'btn-primary text-white shadow-sm' : 'text-secondary'}`}
            onClick={() => setViewMode('table')}
            title="List/Table View"
            style={{ borderRadius: '6px' }}
          >
            <i className="bi bi-list-ul"></i>
          </button>
        </div>
      </div>

      {/* Tasks Content rendering */}
      {loading ? (
        <Loader />
      ) : tasks.length === 0 ? (
        <div className="glass-panel text-center py-5">
          <i className="bi bi-journal-x text-muted fs-1"></i>
          <h4 className="fw-semibold mt-3">No Tasks Found</h4>
          <p className="text-secondary small mt-1">Try relaxing filters or create a new task!</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid view */
        <div className="row g-4 mb-4">
          {tasks.map((task) => (
            <div key={task.id} className="col-12 col-md-6 col-xl-4 col-xxl-3">
              <TaskCard task={task} onEdit={handleEditTrigger} onDelete={handleDeleteTrigger} />
            </div>
          ))}
        </div>
      ) : (
        /* Table view */
        <div className="glass-panel p-3 mb-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <span className="fw-semibold d-block">{task.title}</span>
                      <span className="text-secondary small d-block text-truncate" style={{ maxWidth: '250px' }}>
                        {task.description || 'No description'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-secondary small">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-outline-primary btn-sm px-2.5 py-1" onClick={() => handleEditTrigger(task)}>
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button className="btn btn-outline-danger btn-sm px-2.5 py-1" onClick={() => handleDeleteTrigger(task.id)}>
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
          <button 
            className="btn btn-outline-secondary btn-sm p-1.5 px-3" 
            disabled={currentPage === 0} 
            onClick={() => setCurrentPage(prev => prev - 1)}
            style={{ borderRadius: '8px' }}
          >
            <i className="bi bi-chevron-left me-1"></i> Prev
          </button>
          
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`btn btn-sm px-3 ${currentPage === idx ? 'btn-primary text-white shadow-sm' : 'btn-outline-secondary'}`}
              onClick={() => setCurrentPage(idx)}
              style={{ borderRadius: '8px' }}
            >
              {idx + 1}
            </button>
          ))}

          <button 
            className="btn btn-outline-secondary btn-sm p-1.5 px-3" 
            disabled={currentPage === totalPages - 1} 
            onClick={() => setCurrentPage(prev => prev + 1)}
            style={{ borderRadius: '8px' }}
          >
            Next <i className="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      )}

      {/* Task Creation / Edit Modal */}
      <TaskModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        task={editingTask} 
        onSubmit={handleTaskSubmit} 
      />

      {/* Custom Confirmation Alert Modal */}
      {deleteConfirmOpen && (
        <>
          <style>{`
            .custom-confirm-overlay {
              position: fixed;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              background-color: rgba(0, 0, 0, 0.65);
              backdrop-filter: blur(4px);
              z-index: 1100;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .custom-confirm-card {
              max-width: 400px;
              background-color: var(--bg-sidebar);
              border: 1px solid var(--border-color);
              border-radius: 14px;
              box-shadow: var(--shadow-lg);
              animation: popIn 0.2s ease-out;
            }
            @keyframes popIn {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
          <div className="custom-confirm-overlay" onClick={() => setDeleteConfirmOpen(false)}>
            <div className="custom-confirm-card p-4 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle mb-3" style={{ width: '50px', height: '50px' }}>
                <i className="bi bi-exclamation-triangle fs-3"></i>
              </div>
              <h5 className="fw-bold mb-2">Delete Task?</h5>
              <p className="text-secondary small mb-4">Are you sure you want to permanently delete this task? This action cannot be undone.</p>
              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-outline-secondary px-3.5" onClick={() => setDeleteConfirmOpen(false)} style={{ borderRadius: '8px' }}>
                  Cancel
                </button>
                <button className="btn btn-danger px-3.5" onClick={executeDelete} style={{ borderRadius: '8px' }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Tasks;
