import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import TodoList from './components/TodoList';
import TodoModal from './components/TodoModal';
import AIAgent from './components/AIAgent';
import SettingsModal from './components/SettingsModal';
import { Sparkles, Bot, Settings, LogOut, User } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { name: 'Work', color: '#a855f7' },
  { name: 'Personal', color: '#06b6d4' },
  { name: 'Study', color: '#3b82f6' },
  { name: 'Shopping', color: '#ec4899' },
  { name: 'Health', color: '#10b981' },
  { name: 'Finance', color: '#f59e0b' }
];

const DEFAULT_TODOS = [
  {
    id: '1',
    title: 'Design developer portfolio landing page',
    category: 'Personal',
    categoryColor: '#06b6d4',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0], // today
    completed: false,
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-1', title: 'Research portfolio designs', completed: true },
      { id: 'sub-2', title: 'Sketch wireframe on paper', completed: false },
      { id: 'sub-3', title: 'Prepare content copy', completed: false }
    ]
  },
  {
    id: '2',
    title: 'Refactor todo state managers',
    category: 'Work',
    categoryColor: '#a855f7',
    priority: 'medium',
    dueDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 2);
      return d.toISOString().split('T')[0];
    })(), // 2 days from now
    completed: false,
    createdAt: new Date().toISOString(),
    subtasks: []
  },
  {
    id: '3',
    title: 'Review Zenith AI documentation',
    category: 'Study',
    categoryColor: '#3b82f6',
    priority: 'low',
    dueDate: '',
    completed: true,
    createdAt: new Date().toISOString(),
    subtasks: []
  }
];

export default function App() {
  // Auth State
  const [user, setUser] = useState(() => {
    try {
      const session = localStorage.getItem('zenith_session');
      return session ? JSON.parse(session) : null;
    } catch (e) {
      console.error("Error parsing user session:", e);
      return null;
    }
  });

  // Global State
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('zenith_todos');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : DEFAULT_TODOS;
    } catch (e) {
      console.error("Error parsing todos:", e);
      return DEFAULT_TODOS;
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('zenith_categories');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : DEFAULT_CATEGORIES;
    } catch (e) {
      console.error("Error parsing categories:", e);
      return DEFAULT_CATEGORIES;
    }
  });

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('zenith_gemini_apikey') || '';
  });

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('zenith_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('zenith_categories', JSON.stringify(categories));
  }, [categories]);

  const handleLogin = (session) => {
    setUser(session);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out?')) {
      setUser(null);
      localStorage.removeItem('zenith_session');
    }
  };

  // If no user session, show Auth Page
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // Handle tasks updates
  const handleSaveTodo = (taskData) => {
    if (editingTodo) {
      // Update
      setTodos(prev => prev.map(t => t.id === taskData.id ? taskData : t));
      setEditingTodo(null);
    } else {
      // Create
      setTodos(prev => [taskData, ...prev]);
    }
  };

  const handleAddTodoFromAgent = (agentTaskData) => {
    const id = agentTaskData.id || Math.random().toString(36).substr(2, 9);
    const categoryColor = categories.find(c => c.name === agentTaskData.category)?.color || 'var(--accent-purple)';
    
    const newTask = {
      ...agentTaskData,
      id,
      categoryColor,
      createdAt: new Date().toISOString(),
      completed: false,
      subtasks: agentTaskData.subtasks || []
    };

    setTodos(prev => [newTask, ...prev]);
    return id;
  };

  const handleToggleComplete = (id) => {
    setTodos(prev => prev.map(t => {
      if (t.id === id) {
        const updatedStatus = !t.completed;
        // Also toggle all subtasks to match if completed
        const updatedSubtasks = t.subtasks?.map(sub => ({
          ...sub,
          completed: updatedStatus
        })) || [];
        
        return {
          ...t,
          completed: updatedStatus,
          subtasks: updatedSubtasks
        };
      }
      return t;
    }));
  };

  const handleToggleSubtask = (todoId, subtaskId) => {
    setTodos(prev => prev.map(t => {
      if (t.id === todoId) {
        const updatedSubtasks = t.subtasks.map(sub => 
          sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        );
        // If all subtasks are completed, do we auto-complete main task? No, user discretion.
        // But if a subtask is toggled and we want to compute details, update:
        return {
          ...t,
          subtasks: updatedSubtasks
        };
      }
      return t;
    }));
  };

  const handleDeleteTodo = (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTodos(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setIsAddModalOpen(true);
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('zenith_gemini_apikey', key);
  };

  const handleResetApp = () => {
    setTodos(DEFAULT_TODOS);
    setCategories(DEFAULT_CATEGORIES);
    setApiKey('');
    localStorage.removeItem('zenith_gemini_apikey');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Header Panel */}
      <header 
        className="glass-panel" 
        style={{ 
          margin: '20px 20px 0 20px', 
          padding: '16px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'rgba(20, 16, 35, 0.5)',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{ 
              padding: '10px', 
              background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)', 
              borderRadius: '12px',
              color: '#fff',
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)', background: 'linear-gradient(135deg, #fff 30%, var(--text-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              raza's todo app
            </h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Powered by Zenith AI Agent
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* AI Toggle Button */}
          <button 
            className={`btn-premium ${isAgentOpen ? 'btn-primary' : 'btn-glow-cyan'}`}
            onClick={() => setIsAgentOpen(!isAgentOpen)}
            style={{ 
              height: '40px', 
              padding: '0 16px',
              boxShadow: isAgentOpen ? '0 0 15px rgba(139, 92, 246, 0.4)' : '0 0 15px rgba(6, 182, 212, 0.3)'
            }}
          >
            <Bot size={16} />
            <span className="header-btn-text">Ask Agent</span>
            <span 
              style={{ 
                width: '8px', 
                height: '8px', 
                background: '#10b981', 
                borderRadius: '50%', 
                marginLeft: '2px', 
                animation: 'pulseGlow 2s infinite' 
              }}
            ></span>
          </button>

          {/* Settings Button */}
          <button 
            className="btn-premium btn-secondary"
            onClick={() => setIsSettingsOpen(true)}
            style={{ width: '40px', height: '40px', padding: 0, justifyContent: 'center' }}
            title="Settings"
          >
            <Settings size={18} />
          </button>

          {/* User Profile & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px', borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: '14px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: '700',
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.25)'
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
            </div>
            <div className="header-user-info">
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{user.name || 'User'}</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-premium btn-secondary"
              style={{ width: '34px', height: '34px', padding: 0, justifyContent: 'center', flexShrink: 0 }}
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main 
        style={{ 
          flex: 1, 
          padding: '20px', 
          display: 'grid', 
          gridTemplateColumns: '320px 1fr', 
          gap: '20px',
          alignItems: 'start'
        }}
        className="main-grid-container"
      >
        {/* Left Grid: Dashboard */}
        <aside className="dashboard-grid-aside" style={{ position: 'sticky', top: '20px' }}>
          <Dashboard todos={todos} categories={categories} />
        </aside>

        {/* Right Grid: Todo items list and actions */}
        <section className="todo-grid-section" style={{ minWidth: 0 }}>
          <TodoList
            todos={todos}
            categories={categories}
            onToggleComplete={handleToggleComplete}
            onToggleSubtask={handleToggleSubtask}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
            onOpenAddModal={() => { setEditingTodo(null); setIsAddModalOpen(true); }}
          />
        </section>
      </main>

      {/* Footer Branding */}
      <footer style={{ padding: '20px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}>
        raza's todo app &bull; powered by zenith ai &bull; crafted with care
      </footer>

      {/* Modals & Sidebar Drawer */}
      <TodoModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingTodo(null); }}
        onSave={handleSaveTodo}
        editingTodo={editingTodo}
        categories={categories}
      />

      <AIAgent
        isOpen={isAgentOpen}
        onClose={() => setIsAgentOpen(false)}
        todos={todos}
        apiKey={apiKey}
        onAddTask={handleAddTodoFromAgent}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        categories={categories}
        onUpdateCategories={setCategories}
        todos={todos}
        onImportTodos={setTodos}
        onResetApp={handleResetApp}
      />

      {/* Adaptive Mobile Styles injected directly */}
      <style>{`
        @media (max-width: 860px) {
          .main-grid-container {
            grid-template-columns: 1fr !important;
          }
          .dashboard-grid-aside {
            position: relative !important;
            top: 0 !important;
          }
        }

        @media (max-width: 640px) {
          .header-btn-text {
            display: none !important;
          }
          .header-user-info {
            display: none !important;
          }
        }

        .header-btn-text {
          display: inline;
        }

        .header-user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        
        .completed-task-card {
          background: rgba(20, 16, 35, 0.3) !important;
          border-color: rgba(255, 255, 255, 0.03) !important;
        }
        
        .hover-action-btn:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: var(--accent-purple) !important;
        }
        
        .hover-action-btn-danger:hover {
          background: rgba(244, 63, 94, 0.1) !important;
          color: var(--priority-high) !important;
        }
        
        .suggestion-chip-btn:hover {
          background: rgba(139, 92, 246, 0.18) !important;
          border-color: var(--accent-purple) !important;
          transform: translateY(-1px);
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

    </div>
  );
}
