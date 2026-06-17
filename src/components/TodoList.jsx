import React, { useState } from 'react';
import TodoItem from './TodoItem';
import { Search, Filter, Plus, Calendar, AlertCircle } from 'lucide-react';

export default function TodoList({ 
  todos = [], 
  categories = [], 
  onToggleComplete, 
  onToggleSubtask, 
  onDelete, 
  onEdit, 
  onOpenAddModal 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All' | 'Active' | 'Completed'

  // Apply filters
  const filteredTodos = todos.filter(todo => {
    // Search filter
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'All' || todo.category === selectedCategory;
    
    // Priority filter
    const matchesPriority = selectedPriority === 'All' || todo.priority === selectedPriority;
    
    // Status filter
    const matchesStatus = 
      selectedStatus === 'All' || 
      (selectedStatus === 'Active' && !todo.completed) || 
      (selectedStatus === 'Completed' && todo.completed);

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Filter and Search Bar */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px' 
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Search box */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} 
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium"
              style={{ 
                width: '100%', 
                paddingLeft: '44px',
                height: '44px'
              }}
            />
          </div>

          {/* Quick Add Button */}
          <button 
            className="btn-premium btn-primary"
            onClick={onOpenAddModal}
            style={{ height: '44px', padding: '0 20px', flexShrink: 0 }}
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>

        {/* Categorized Filter Tabs & Advanced Dropdowns */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '12px'
          }}
        >
          {/* Category Tabs */}
          <div 
            style={{ 
              display: 'flex', 
              gap: '6px', 
              overflowX: 'auto', 
              paddingBottom: '2px',
              maxWidth: '100%'
            }}
            className="no-scrollbar"
          >
            <button
              onClick={() => setSelectedCategory('All')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: selectedCategory === 'All' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                color: selectedCategory === 'All' ? 'var(--accent-purple)' : 'var(--text-secondary)',
                fontWeight: selectedCategory === 'All' ? '600' : '400',
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: 'var(--transition-smooth)'
              }}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedCategory === cat.name ? `${cat.color}22` : 'transparent',
                  color: selectedCategory === cat.name ? cat.color : 'var(--text-secondary)',
                  fontWeight: selectedCategory === cat.name ? '600' : '400',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  transition: 'var(--transition-smooth)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cat.color }}></span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Priority & Status Filters */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Status Select */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-premium"
                style={{ 
                  height: '32px', 
                  padding: '0 24px 0 10px', 
                  fontSize: '0.75rem', 
                  background: 'rgba(255, 255, 255, 0.03)',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority Select */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="input-premium"
                style={{ 
                  height: '32px', 
                  padding: '0 24px 0 10px', 
                  fontSize: '0.75rem', 
                  background: 'rgba(255, 255, 255, 0.03)',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Todos Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredTodos.length > 0 ? (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onToggleSubtask={onToggleSubtask}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        ) : (
          /* Empty State */
          <div 
            className="glass-panel" 
            style={{ 
              padding: '40px 20px', 
              textAlign: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px' 
            }}
          >
            <div style={{ padding: '16px', background: 'rgba(139, 92, 246, 0.04)', borderRadius: '50%', color: 'var(--accent-purple)', animation: 'float 6s ease-in-out infinite' }}>
              <AlertCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>No tasks found</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '320px', lineHeight: '1.5' }}>
              Try adjusting your filters, or chat with **Zenith AI** in the sidebar to auto-schedule some tasks for you!
            </p>
            <button 
              className="btn-premium btn-secondary"
              onClick={onOpenAddModal}
              style={{ marginTop: '8px' }}
            >
              Add a task manually
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
