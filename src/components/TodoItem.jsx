import React, { useState } from 'react';
import { Calendar, Trash2, Edit3, ChevronDown, ChevronUp, Plus, CheckSquare, Square, MoreVertical } from 'lucide-react';

export default function TodoItem({ todo, onToggleComplete, onToggleSubtask, onDelete, onEdit }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const totalSubtasks = todo.subtasks?.length || 0;
  const completedSubtasks = todo.subtasks?.filter(s => s.completed).length || 0;
  const subtaskPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Format date nicely
  const getDueDateLabel = () => {
    if (!todo.dueDate) return null;
    const today = new Date().toISOString().split('T')[0];
    const due = todo.dueDate;
    
    if (due === today) return { text: 'Today', status: 'today' };
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    if (due === tomorrowStr) return { text: 'Tomorrow', status: 'tomorrow' };

    if (due < today) return { text: 'Overdue', status: 'overdue' };

    // Format like "Jun 20"
    const dateObj = new Date(due);
    const formatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { text: formatted, status: 'upcoming' };
  };

  const dueLabel = getDueDateLabel();

  // Priority Styles
  const getPriorityStyle = () => {
    switch (todo.priority) {
      case 'high':
        return {
          background: 'rgba(244, 63, 94, 0.08)',
          color: 'var(--priority-high)',
          border: '1px solid rgba(244, 63, 94, 0.2)',
          boxShadow: '0 0 6px rgba(244, 63, 94, 0.1)'
        };
      case 'medium':
        return {
          background: 'rgba(245, 158, 11, 0.08)',
          color: 'var(--priority-medium)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          boxShadow: '0 0 6px rgba(245, 158, 11, 0.1)'
        };
      default:
        return {
          background: 'rgba(16, 185, 129, 0.08)',
          color: 'var(--priority-low)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          boxShadow: '0 0 6px rgba(16, 185, 129, 0.1)'
        };
    }
  };

  return (
    <div 
      className={`glass-panel animate-fade-in ${todo.completed ? 'completed-task-card' : ''}`}
      style={{
        padding: '16px',
        borderLeft: todo.completed 
          ? '4px solid var(--text-muted)' 
          : `4px solid ${todo.priority === 'high' ? 'var(--priority-high)' : todo.priority === 'medium' ? 'var(--priority-medium)' : 'var(--priority-low)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: todo.completed ? 0.75 : 1,
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Checkbox */}
        <label className="checkbox-container" style={{ marginTop: '2px' }}>
          <input 
            type="checkbox" 
            checked={todo.completed} 
            onChange={() => onToggleComplete(todo.id)} 
          />
          <span className="checkmark"></span>
        </label>

        {/* Task Core Info */}
        <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
          <h3 
            style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: todo.completed ? 'line-through' : 'none',
              lineHeight: '1.4',
              transition: 'var(--transition-smooth)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {todo.title}
          </h3>

          {/* Subtitle / Details row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
            {/* Priority Tag */}
            <span 
              style={{
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '6px',
                letterSpacing: '0.03em',
                ...getPriorityStyle()
              }}
            >
              {todo.priority}
            </span>

            {/* Category Indicator */}
            {todo.category && (
              <span 
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-secondary)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: todo.categoryColor || 'var(--accent-purple)' }}></span>
                {todo.category}
              </span>
            )}

            {/* Due date tag */}
            {dueLabel && (
              <span 
                style={{
                  fontSize: '0.7rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: dueLabel.status === 'overdue' 
                    ? 'var(--priority-high)' 
                    : dueLabel.status === 'today' 
                      ? 'var(--priority-medium)' 
                      : 'var(--text-secondary)'
                }}
              >
                <Calendar size={12} />
                {dueLabel.text}
              </span>
            )}

            {/* Subtask count indicator */}
            {totalSubtasks > 0 && (
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(6, 182, 212, 0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                {completedSubtasks}/{totalSubtasks} steps
              </span>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <button 
            onClick={() => onEdit(todo)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px', borderRadius: '8px', transition: 'var(--transition-smooth)' }}
            className="hover-action-btn"
            title="Edit Task"
          >
            <Edit3 size={15} />
          </button>
          <button 
            onClick={() => onDelete(todo.id)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px', transition: 'var(--transition-smooth)' }}
            className="hover-action-btn-danger"
            title="Delete Task"
          >
            <Trash2 size={15} />
          </button>
          {totalSubtasks > 0 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Subtasks Progress Line & List */}
      {totalSubtasks > 0 && (
        <div style={{ marginTop: '2px' }}>
          {/* Subtask Mini Progress Bar (always visible under title if expanded or not, but nice to show when there's subtasks) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, height: '3px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '2px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${subtaskPercentage}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)',
                  transition: 'width 0.4s ease-out'
                }}
              ></div>
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{subtaskPercentage}%</span>
          </div>

          {/* Subtasks Expanded List */}
          {isExpanded && (
            <div 
              style={{ 
                marginTop: '12px', 
                paddingLeft: '28px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px', 
                borderLeft: '1px dashed rgba(255, 255, 255, 0.1)',
                paddingTop: '4px' 
              }}
              className="animate-fade-in"
            >
              {todo.subtasks.map(sub => (
                <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => onToggleSubtask(todo.id, sub.id)}
                    style={{ background: 'transparent', border: 'none', padding: 0, display: 'inline-flex', cursor: 'pointer', color: sub.completed ? 'var(--accent-purple)' : 'var(--text-muted)' }}
                  >
                    {sub.completed ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                  <span 
                    style={{ 
                      fontSize: '0.8rem', 
                      color: sub.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: sub.completed ? 'line-through' : 'none',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
