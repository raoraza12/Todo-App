import React, { useState, useEffect } from 'react';
import { X, Save, Key, Eye, EyeOff, Plus, Trash2, Download, Upload, RotateCcw } from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  apiKey, 
  onSaveApiKey, 
  categories = [], 
  onUpdateCategories, 
  todos = [], 
  onImportTodos, 
  onResetApp 
}) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#8b5cf6');

  useEffect(() => {
    setKeyInput(apiKey || '');
  }, [apiKey, isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    onSaveApiKey(keyInput.trim());
    alert('API Key updated successfully! Zenith AI will now use Gemini.');
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    if (categories.some(c => c.name.toLowerCase() === newCatName.trim().toLowerCase())) {
      alert('Category already exists!');
      return;
    }

    const updated = [...categories, { name: newCatName.trim(), color: newCatColor }];
    onUpdateCategories(updated);
    setNewCatName('');
  };

  const handleRemoveCategory = (name) => {
    if (categories.length <= 1) {
      alert('You must have at least one category!');
      return;
    }
    const updated = categories.filter(c => c.name !== name);
    onUpdateCategories(updated);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ todos, categories }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "zenith-todo-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.todos && Array.isArray(parsed.todos)) {
          onImportTodos(parsed.todos);
          if (parsed.categories && Array.isArray(parsed.categories)) {
            onUpdateCategories(parsed.categories);
          }
          alert('Data imported successfully!');
        } else {
          alert('Invalid file format. Make sure it contains "todos".');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    fileReader.readAsText(file);
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
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          background: 'rgba(25, 20, 45, 0.95)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(139, 92, 246, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            System Settings
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

        {/* Gemini API Key */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '20px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Key size={14} style={{ color: 'var(--accent-purple)' }} />
            Gemini API Key
          </label>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Enter your Gemini API key to enable dynamic interactive chat, smart suggestions, and planning. Leave empty to use local rule-based parsing.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="Enter Gemini API Key..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="input-premium"
                style={{ width: '100%', paddingRight: '40px', height: '40px', fontSize: '0.85rem' }}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button 
              onClick={handleSaveKey}
              className="btn-premium btn-primary"
              style={{ height: '40px', padding: '0 16px' }}
            >
              <Save size={16} />
            </button>
          </div>
        </div>

        {/* Categories Customization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '20px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Manage Categories
          </label>
          
          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              placeholder="New category..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="input-premium"
              style={{ flex: 1, height: '36px', fontSize: '0.8rem' }}
            />
            <input
              type="color"
              value={newCatColor}
              onChange={(e) => setNewCatColor(e.target.value)}
              style={{
                width: '36px',
                height: '36px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                background: 'transparent'
              }}
            />
            <button 
              type="submit" 
              className="btn-premium btn-secondary"
              style={{ height: '36px', padding: '0 12px' }}
            >
              <Plus size={16} />
            </button>
          </form>

          {/* List of categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto', paddingRight: '4px' }}>
            {categories.map(cat => (
              <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color }}></span>
                  {cat.name}
                </div>
                <button
                  onClick={() => handleRemoveCategory(cat.name)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  className="hover-action-btn-danger"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Data Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Backup & Reset
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {/* Export */}
            <button 
              onClick={handleExportData}
              className="btn-premium btn-secondary"
              style={{ justifyContent: 'center', padding: '10px', fontSize: '0.8rem' }}
            >
              <Download size={14} />
              Export JSON
            </button>

            {/* Import */}
            <label 
              className="btn-premium btn-secondary"
              style={{ justifyContent: 'center', padding: '10px', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              <Upload size={14} />
              Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Reset button */}
          <button 
            onClick={() => {
              if (confirm('Are you absolutely sure you want to reset all tasks and categories to factory defaults?')) {
                onResetApp();
                onClose();
              }
            }}
            className="btn-premium"
            style={{ 
              justifyContent: 'center', 
              padding: '10px', 
              fontSize: '0.8rem', 
              color: 'var(--priority-high)', 
              borderColor: 'rgba(244, 63, 94, 0.2)', 
              background: 'rgba(244, 63, 94, 0.03)',
              marginTop: '4px'
            }}
          >
            <RotateCcw size={14} />
            Reset Application
          </button>
        </div>

      </div>
    </div>
  );
}
