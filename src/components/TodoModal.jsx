import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Folder, Flag } from 'lucide-react';

export default function TodoModal({ isOpen, onClose, onSave, editingTodo, categories = [] }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '');
      setCategory(editingTodo.category || (categories[0]?.name || ''));
      setPriority(editingTodo.priority || 'medium');
      setDueDate(editingTodo.dueDate || '');
      setSubtasks(editingTodo.subtasks || []);
    } else {
      setTitle('');
      setCategory(categories[0]?.name || 'Personal');
      setPriority('medium');
      setDueDate('');
      setSubtasks([]);
    }
  }, [editingTodo, isOpen, categories]);

  if (!isOpen) return null;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSub = {
      id: Math.random().toString(36).substr(2, 9),
      title: newSubtaskTitle.trim(),
      completed: false
    };

    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const categoryColor = categories.find(c => c.name === category)?.color || 'var(--accent-purple)';

    const taskData = {
      id: editingTodo ? editingTodo.id : Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      category,
      categoryColor,
      priority,
      dueDate,
      subtasks,
      completed: editingTodo ? editingTodo.completed : false,
      createdAt: editingTodo ? editingTodo.createdAt : new Date().toISOString()
    };

    onSave(taskData);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      className="animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: 'rgba(25, 20, 45, 0.9)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(139, 92, 246, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {editingTodo ? 'Modify Task' : 'Draft New Task'}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="hover-action-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Task Name</label>
            <input
              type="text"
              placeholder="What are you planning to do?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-premium"
              autoFocus
            />
          </div>

          {/* Category Selection - Visual Chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Folder size={12} /> Category
            </label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {categories.map(cat => {
                const isSelected = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: isSelected ? `1.5px solid ${cat.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isSelected ? `${cat.color}18` : 'rgba(255, 255, 255, 0.02)',
                      color: isSelected ? cat.color : 'var(--text-secondary)',
                      fontWeight: isSelected ? '600' : '400',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-primary)',
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: isSelected ? `0 0 12px ${cat.color}30` : 'none',
                      transform: isSelected ? 'scale(1.04)' : 'scale(1)'
                    }}
                  >
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: cat.color,
                      boxShadow: isSelected ? `0 0 6px ${cat.color}` : 'none',
                      transition: 'all 0.3s ease'
                    }}></span>
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date - Full Width */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} /> Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-premium"
              style={{ cursor: 'pointer', height: '45px', width: '100%' }}
            />
          </div>

          {/* Priority radio choices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Flag size={12} /> Priority Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {/* Low Priority */}
              <label 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: priority === 'low' ? '1.5px solid var(--priority-low)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: priority === 'low' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  color: priority === 'low' ? 'var(--priority-low)' : 'var(--text-secondary)',
                  fontWeight: priority === 'low' ? '600' : '400',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <input 
                  type="radio" 
                  name="priority" 
                  value="low" 
                  checked={priority === 'low'} 
                  onChange={() => setPriority('low')}
                  style={{ display: 'none' }}
                />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--priority-low)' }}></span>
                Low
              </label>

              {/* Medium Priority */}
              <label 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: priority === 'medium' ? '1.5px solid var(--priority-medium)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: priority === 'medium' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  color: priority === 'medium' ? 'var(--priority-medium)' : 'var(--text-secondary)',
                  fontWeight: priority === 'medium' ? '600' : '400',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <input 
                  type="radio" 
                  name="priority" 
                  value="medium" 
                  checked={priority === 'medium'} 
                  onChange={() => setPriority('medium')}
                  style={{ display: 'none' }}
                />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--priority-medium)' }}></span>
                Medium
              </label>

              {/* High Priority */}
              <label 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: priority === 'high' ? '1.5px solid var(--priority-high)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: priority === 'high' ? 'rgba(244, 63, 94, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  color: priority === 'high' ? 'var(--priority-high)' : 'var(--text-secondary)',
                  fontWeight: priority === 'high' ? '600' : '400',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <input 
                  type="radio" 
                  name="priority" 
                  value="high" 
                  checked={priority === 'high'} 
                  onChange={() => setPriority('high')}
                  style={{ display: 'none' }}
                />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--priority-high)' }}></span>
                High
              </label>
            </div>
          </div>

          {/* Subtasks Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Subtasks checklist</label>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Add subtask step..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="input-premium"
                style={{ flex: 1, height: '38px', fontSize: '0.85rem' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
              />
              <button 
                type="button" 
                onClick={handleAddSubtask}
                className="btn-premium btn-secondary"
                style={{ height: '38px', padding: '0 12px' }}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* List of local subtasks */}
            {subtasks.length > 0 && (
              <div 
                style={{ 
                  marginTop: '6px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '6px', 
                  maxHeight: '120px', 
                  overflowY: 'auto',
                  background: 'rgba(255, 255, 255, 0.01)',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.03)'
                }}
              >
                {subtasks.map((sub, index) => (
                  <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {index + 1}. {sub.title}
                    </span>
                    <button 
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-premium btn-secondary"
              style={{ padding: '10px 20px' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-premium btn-primary"
              style={{ padding: '10px 24px' }}
            >
              {editingTodo ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
