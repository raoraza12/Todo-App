import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, MessageSquare, ChevronRight, X, Trash2 } from 'lucide-react';
import { parseLocalCommand, askGemini } from '../utils/nlp';

export default function AIAgent({ 
  isOpen, 
  onClose, 
  todos = [], 
  apiKey = '', 
  onAddTask, 
  onAddSubtasksToTask 
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am **Zenith AI**, your smart task partner. 🤖⚡\n\nI can create tasks, break down complex goals, and analyze your productivity.\n\nTry asking: *\"Add high priority task code review tomorrow\"* or *\"Break down study React\"*.",
      suggestions: ["Add task...", "Break down...", "Check productivity stats"]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // System Prompt for Gemini LLM to maintain personality
  const systemPrompt = `You are "Zenith AI", an elite agentic task assistant inside a professional Todo web app.
Your tone is professional, futuristic, encouraging, and highly efficient. 
You speak in short paragraphs. When the user requests a task action, parse it and format a JSON block at the very end of your response. 
Format your responses using markdown. Keep advice action-oriented.`;

  useEffect(() => {
    // Scroll to bottom
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: text.trim()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // AI thinking delay
    setTimeout(async () => {
      let aiResponseObj;
      if (apiKey) {
        aiResponseObj = await askGemini(text, systemPrompt, apiKey, todos);
      } else {
        aiResponseObj = parseLocalCommand(text, todos);
      }

      const aiMsg = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'ai',
        text: aiResponseObj.response,
        action: aiResponseObj.action,
        actionData: aiResponseObj.data,
        suggestions: aiResponseObj.suggestions
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleSuggestionClick = (suggestion) => {
    let text = '';
    if (suggestion === "Add task...") {
      text = "Add task Submit assignment tomorrow High priority Category Study";
    } else if (suggestion === "Break down...") {
      text = "Break down build a portfolio website";
    } else if (suggestion === "Check productivity stats" || suggestion === "Show stats") {
      text = "Analyze my productivity progress";
    } else if (suggestion === "Confirm Task" || suggestion === "Confirm Task Creation" || suggestion === "Create Task with Checklist") {
      // Find last message with action data
      const lastActionMsg = [...messages].reverse().find(m => m.action && m.actionData);
      if (lastActionMsg) {
        handleExecuteAction(lastActionMsg);
        return;
      }
      text = "Yes, execute action";
    } else if (suggestion === "Cancel" || suggestion === "No thanks") {
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'ai',
        text: "Understood. Action cancelled. What else can I assist you with?"
      }]);
      return;
    } else {
      text = suggestion;
    }
    
    handleSend(text);
  };

  const handleExecuteAction = (msg) => {
    if (!msg.actionData) return;

    if (msg.action === 'add') {
      onAddTask(msg.actionData);
      
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'ai',
        text: `🚀 **Success!** Task *"${msg.actionData.title}"* has been added to your board.`
      }]);
    } else if (msg.action === 'breakdown') {
      // Add the main task first
      const mainTaskId = onAddTask({
        title: msg.actionData.title,
        priority: msg.actionData.priority,
        category: msg.actionData.category,
        dueDate: msg.actionData.dueDate,
        subtasks: msg.actionData.subtasks, // Attach subtasks directly
        completed: false
      });

      setMessages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'ai',
        text: `⚡ **Cheklist Created!** Added task *"${msg.actionData.title}"* with **${msg.actionData.subtasks.length}** subtask steps.`
      }]);
    }

    // Clear action so it can't be clicked twice
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, action: null, actionData: null, suggestions: [] } : m));
  };

  const handleClearHistory = () => {
    if (confirm('Clear assistant conversation history?')) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: "History cleared. I am ready for new tasks. How can I help you?",
          suggestions: ["Add task...", "Break down...", "Check productivity stats"]
        }
      ]);
    }
  };

  // Render markdown bold and links into HTML elements safely
  const renderMessageText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Simple regex replacement for bold **text**
      let parts = [];
      let currentString = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;
      let lastIndex = 0;

      while ((match = boldRegex.exec(line)) !== null) {
        const index = match.index;
        // Text before bold
        if (index > lastIndex) {
          parts.push(line.substring(lastIndex, index));
        }
        // Bold text
        parts.push(<strong key={index} style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <p key={idx} style={{ margin: '4px 0', minHeight: '1.2em', lineHeight: '1.5', fontSize: '0.85rem' }}>
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  return (
    <div 
      className="glass-panel"
      style={{
        position: 'fixed',
        top: isOpen ? '0' : '100%',
        right: '0',
        bottom: '0',
        width: '100%',
        maxWidth: '420px',
        height: '100vh',
        zIndex: 999,
        background: 'rgba(15, 12, 30, 0.95)',
        borderLeft: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-premium), 0 0 50px rgba(139, 92, 246, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), top 0s',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        overflow: 'hidden'
      }}
    >
      {/* Agent Header */}
      <div 
        style={{ 
          padding: '18px 20px', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'rgba(25, 20, 45, 0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{ 
              padding: '8px', 
              background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)', 
              borderRadius: '10px', 
              color: '#fff',
              boxShadow: '0 0 12px var(--accent-purple-glow)'
            }}
            className="glow-active"
          >
            <Bot size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '5px' }}>
              Zenith AI Agent
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
              {apiKey ? 'Powered by Gemini 1.5 Flash' : 'Offline Intelligent Assistant'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button 
            onClick={handleClearHistory}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '50%' }}
            title="Clear Chat Logs"
            className="hover-action-btn-danger"
          >
            <Trash2 size={15} />
          </button>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px', borderRadius: '50%' }}
            className="hover-action-btn"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages Log Container */}
      <div 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px' 
        }}
      >
        {messages.map(msg => (
          <div 
            key={msg.id} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
            className="animate-fade-in"
          >
            {/* Bubble */}
            <div 
              style={{
                padding: '12px 16px',
                borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                background: msg.sender === 'user' 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(124, 58, 237, 0.2) 100%)' 
                  : 'rgba(255, 255, 255, 0.03)',
                border: msg.sender === 'user' 
                  ? '1px solid rgba(139, 92, 246, 0.2)' 
                  : '1px solid rgba(255, 255, 255, 0.05)',
                color: 'var(--text-primary)',
                boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(139, 92, 246, 0.05)' : 'none'
              }}
            >
              {renderMessageText(msg.text)}

              {/* Action confirmation panel within chatbot bubble */}
              {msg.actionData && (msg.action === 'add' || msg.action === 'breakdown') && (
                <div 
                  style={{ 
                    marginTop: '12px', 
                    padding: '10px', 
                    background: 'rgba(0, 0, 0, 0.2)', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                    Parsed action details:
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                    {msg.actionData.title}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                      Priority: {msg.actionData.priority}
                    </span>
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                      Category: {msg.actionData.category}
                    </span>
                    {msg.actionData.dueDate && (
                      <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                        Due: {msg.actionData.dueDate}
                      </span>
                    )}
                  </div>
                  {msg.actionData.subtasks && msg.actionData.subtasks.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '6px' }}>
                      Checklist: {msg.actionData.subtasks.length} subtasks ready.
                    </div>
                  )}
                  <button 
                    onClick={() => handleExecuteAction(msg)}
                    className="btn-premium btn-glow-cyan"
                    style={{ fontSize: '0.75rem', padding: '6px 12px', justifyContent: 'center', width: '100%', height: '30px', borderRadius: '6px' }}
                  >
                    Create Task Now
                  </button>
                </div>
              )}
            </div>
            
            {/* Timestamp label */}
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', padding: '0 4px' }}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', alignSelf: 'flex-start' }}>
            <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 2px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div className="typing-indicator">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message input drawer */}
      <div 
        style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
          background: 'rgba(20, 16, 35, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {/* Suggestion Chips */}
        {messages[messages.length - 1]?.suggestions && (
          <div 
            style={{ 
              display: 'flex', 
              gap: '6px', 
              overflowX: 'auto',
              paddingBottom: '2px'
            }}
            className="no-scrollbar"
          >
            {messages[messages.length - 1].suggestions.map(s => (
              <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  background: 'rgba(139, 92, 246, 0.08)',
                  color: 'var(--accent-purple)',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition-bounce)'
                }}
                className="suggestion-chip-btn"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
        >
          <input
            type="text"
            placeholder="Type a command or chat..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="input-premium"
            style={{ flex: 1, height: '40px', fontSize: '0.85rem' }}
          />
          <button 
            type="submit" 
            className="btn-premium btn-primary animate-pulseGlow" 
            style={{ width: '40px', height: '40px', padding: 0, justifyContent: 'center', flexShrink: 0 }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>

    </div>
  );
}
