import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaFilter, FaSort, FaCheck, FaSearch, FaChartBar, FaTasks } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import { fetchTasks, fetchStats, createTask, updateTask, deleteTask } from '../api';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTask, setCurrentTask] = useState(null);
  
  // Desktop form toggle
  const [showForm, setShowForm] = useState(false);
  
  // Mobile Tab State
  const [activeTab, setActiveTab] = useState(null); // 'form', 'filters', 'stats', or null
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filters, Sorting & Search
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    sortBy: 'createdAt',
    order: 'desc',
    search: ''
  });

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksRes, statsRes] = await Promise.all([
        fetchTasks(filters),
        fetchStats()
      ]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdate = async (taskData) => {
    try {
      if (currentTask) {
        await updateTask(currentTask._id, taskData);
        toast.success('Task updated successfully');
      } else {
        await createTask(taskData);
        toast.success('Task created successfully');
      }
      setCurrentTask(null);
      setShowForm(false);
      setActiveTab(null);
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        toast.success('Task deleted');
        loadTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTask(id, { status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
      loadTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const editTask = (task) => {
    setCurrentTask(task);
    if (isMobile) {
      setActiveTab('form');
    } else {
      setShowForm(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setCurrentTask(null);
    setShowForm(false);
    setActiveTab(null);
  };

  const toggleTab = (tab) => {
    setActiveTab(prev => prev === tab ? null : tab);
  };

  const renderFilters = () => (
    <div className="glass" style={{ padding: '1.5rem', marginBottom: isMobile ? '1.5rem' : '0' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
        <FaFilter /> Filters & Sorting
      </h3>
      <div className={isMobile ? "filters-grid-mobile" : ""} style={isMobile ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' } : {}}>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-control" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select className="form-control" name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Sort By</label>
          <select className="form-control" name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Order</label>
          <select className="form-control" name="order" value={filters.order} onChange={handleFilterChange}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStats = () => (
    stats && (
      <motion.div 
        className="stats-grid"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <div className="stat-card glass">
          <h3>Total Tasks</h3>
          <span className="stat-value">{stats.totalTasks[0]?.count || 0}</span>
        </div>
        <div className="stat-card glass">
          <h3>Completed</h3>
          <span className="stat-value">
            {stats.byStatus.find(s => s._id === 'Completed')?.count || 0}
          </span>
        </div>
        <div className="stat-card glass">
          <h3>Pending</h3>
          <span className="stat-value">
            {stats.byStatus.find(s => s._id === 'Pending')?.count || 0}
          </span>
        </div>
      </motion.div>
    )
  );

  return (
    <div className="dashboard animate-fade-in" style={isMobile ? { display: 'flex', flexDirection: 'column' } : {}}>
      
      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <aside style={{ position: 'sticky', top: '2rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginBottom: '1.5rem', padding: '0.8rem' }}
            onClick={() => { setShowForm(!showForm); setCurrentTask(null); }}
          >
            <FaPlus /> {showForm && !currentTask ? 'Close Form' : 'Add New Task'}
          </button>
          {renderFilters()}
        </aside>
      )}

      <main style={isMobile ? { order: 1, width: '100%' } : {}}>
        
        {/* DESKTOP STATS */}
        {!isMobile && renderStats()}

        {/* SEARCH BAR (Always Visible) */}
        <div className="search-bar" style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }}>
          <FaSearch />
          <input 
            type="text" 
            className="form-control glass" 
            placeholder="Search tasks..." 
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        {/* MOBILE TABS */}
        {isMobile && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button className={`btn ${activeTab === 'form' ? 'btn-primary' : 'btn-icon'}`} style={{ flex: 1 }} onClick={() => toggleTab('form')}>
              <FaPlus /> Add
            </button>
            <button className={`btn ${activeTab === 'filters' ? 'btn-primary' : 'btn-icon'}`} style={{ flex: 1 }} onClick={() => toggleTab('filters')}>
              <FaFilter /> Filters
            </button>
            <button className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-icon'}`} style={{ flex: 1 }} onClick={() => toggleTab('stats')}>
              <FaChartBar /> Stats
            </button>
          </div>
        )}

        {/* MOBILE TAB CONTENT */}
        <AnimatePresence>
          {isMobile && activeTab === 'filters' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              {renderFilters()}
            </motion.div>
          )}
          {isMobile && activeTab === 'stats' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              {renderStats()}
            </motion.div>
          )}
          {((isMobile && activeTab === 'form') || (!isMobile && showForm)) && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <TaskForm currentTask={currentTask} onSubmit={handleCreateOrUpdate} onCancel={cancelEdit} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* TASKS LIST (Limited to 3) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Recent Tasks</h2>
        </div>
        
        <motion.div layout className="task-list">
          {loading ? (
            <div className="empty-state">
              <div className="spinner">Loading tasks...</div>
            </div>
          ) : tasks.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="empty-state glass">
              <FaCheck />
              <h2>No Tasks Found</h2>
              <p>You're all caught up! Create a new task to get started.</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {tasks.slice(0, 3).map(task => (
                <TaskItem key={task._id} task={task} onEdit={editTask} onDelete={handleDelete} onStatusChange={handleStatusChange} />
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* LOAD MORE / VIEW ALL BUTTON */}
        {tasks.length > 0 && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link to="/tasks">
              <button className="btn glass" style={{ width: '100%', padding: '1rem', color: 'var(--primary)', border: '1px solid var(--primary)', fontSize: '1rem' }}>
                <FaTasks /> View All {tasks.length} Tasks
              </button>
            </Link>
          </div>
        )}
        
      </main>
    </div>
  );
};

export default HomePage;
