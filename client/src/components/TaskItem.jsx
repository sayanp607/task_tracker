import React from 'react';
import { FaTrash, FaEdit, FaCheck, FaRegClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getStatusBadgeClass = (status) => {
    return `badge badge-status-${status.replace(/\s/g, '')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`task-card glass priority-${task.priority}`}
    >
      <div className="task-header">
        <div>
          <h3 className="task-title" style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none', opacity: task.status === 'Completed' ? 0.6 : 1 }}>
            {task.title}
          </h3>
          <div className="task-meta">
            <span className={getStatusBadgeClass(task.status)}>
              {task.status}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
              <FaRegClock /> {formatDate(task.dueDate)}
            </span>
          </div>
        </div>
        <div className="task-actions">
          {task.status !== 'Completed' && (
            <button 
              className="btn-icon" 
              onClick={() => onStatusChange(task._id, 'Completed')}
              title="Mark as Completed"
            >
              <FaCheck style={{ color: 'var(--success)' }} />
            </button>
          )}
          <button className="btn-icon" onClick={() => onEdit(task)} title="Edit Task">
            <FaEdit style={{ color: 'var(--primary)' }} />
          </button>
          <button className="btn-icon" onClick={() => onDelete(task._id)} title="Delete Task">
            <FaTrash style={{ color: 'var(--danger)' }} />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}
    </motion.div>
  );
};

export default TaskItem;
