import React from 'react';
import { CheckCircle, Clock, ListTodo, Award, TrendingUp } from 'lucide-react';

export default function Dashboard({ todos = [], categories = [] }) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Overdue calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const overdue = todos.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr).length;

  // Priority counts
  const high = todos.filter(t => t.priority === 'high').length;
  const med = todos.filter(t => t.priority === 'medium').length;
  const low = todos.filter(t => t.priority === 'low').length;

  // Category progress
  const categoryStats = categories.map(cat => {
    const catTodos = todos.filter(t => t.category === cat.name);
    const catTotal = catTodos.length;
    const catCompleted = catTodos.filter(t => t.completed).length;
    const catRate = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;
    return { name: cat.name, color: cat.color, total: catTotal, completed: catCompleted, rate: catRate };
  }).filter(c => c.total > 0);

  // SVG Circular progress details
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completionRate / 100) * circumference;

  return (
    <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} style={{ color: 'var(--accent-cyan)' }} />
          Productivity Panel
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: '500', padding: '4px 8px', borderRadius: '20px', background: 'rgba(139, 92, 246, 0.1)' }}>
          Active Session
        </span>
      </div>

      {/* Progress ring and big percentage */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0', position: 'relative' }}>
        <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            {/* Background Circle */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="8"
            />
            {/* Foreground Circle */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-purple)" />
                <stop offset="100%" stopColor="var(--accent-cyan)" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
              {completionRate}%
            </span>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              Completed
            </span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(169, 131, 255, 0.08)', borderRadius: '8px', color: 'var(--accent-purple)' }}>
            <ListTodo size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pending</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{pending}</div>
          </div>
        </div>
        
        <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', color: '#10b981' }}>
            <CheckCircle size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Completed</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{completed}</div>
          </div>
        </div>

        <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', gridColumn: 'span 2' }}>
          <div style={{ padding: '8px', background: overdue > 0 ? 'rgba(244, 63, 94, 0.08)' : 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', color: overdue > 0 ? 'var(--priority-high)' : 'var(--text-muted)' }}>
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Overdue Tasks</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: overdue > 0 ? 'var(--priority-high)' : 'var(--text-primary)' }}>{overdue}</div>
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Priority Volume</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* High */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '45px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>High</span>
            <div style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${total > 0 ? (high / total) * 100 : 0}%`, height: '100%', background: 'var(--priority-high)', boxShadow: '0 0 8px var(--priority-high)' }}></div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', width: '12px', textAlign: 'right' }}>{high}</span>
          </div>
          
          {/* Medium */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '45px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Medium</span>
            <div style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${total > 0 ? (med / total) * 100 : 0}%`, height: '100%', background: 'var(--priority-medium)', boxShadow: '0 0 8px var(--priority-medium)' }}></div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', width: '12px', textAlign: 'right' }}>{med}</span>
          </div>

          {/* Low */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '45px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Low</span>
            <div style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${total > 0 ? (low / total) * 100 : 0}%`, height: '100%', background: 'var(--priority-low)', boxShadow: '0 0 8px var(--priority-low)' }}></div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', width: '12px', textAlign: 'right' }}>{low}</span>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      {categoryStats.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Category Progress</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto', paddingRight: '4px' }}>
            {categoryStats.map(cat => (
              <div key={cat.name} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }}></span>
                    {cat.name}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{cat.completed}/{cat.total} ({cat.rate}%)</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.rate}%`, height: '100%', background: cat.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Premium Motivation Quote */}
      <div style={{ marginTop: 'auto', padding: '12px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)', border: '1px solid rgba(139, 92, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <Award size={18} style={{ color: 'var(--accent-purple)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: '1.3' }}>
            "Efficiency is doing things right; effectiveness is doing the right things."
          </p>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>- Peter Drucker</span>
        </div>
      </div>
    </section>
  );
}
