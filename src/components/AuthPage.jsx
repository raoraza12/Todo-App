import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export default function AuthPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (isSignUp && !formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setIsLoading(true);

    // Simulate loading
    setTimeout(() => {
      if (isSignUp) {
        // Sign Up - save user to localStorage
        const existingUsers = JSON.parse(localStorage.getItem('zenith_users') || '[]');
        const userExists = existingUsers.find(u => u.email === formData.email.trim().toLowerCase());

        if (userExists) {
          setError('An account with this email already exists. Please sign in.');
          setIsLoading(false);
          return;
        }

        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          createdAt: new Date().toISOString()
        };

        existingUsers.push(newUser);
        localStorage.setItem('zenith_users', JSON.stringify(existingUsers));
        
        // Auto login after signup
        const session = { id: newUser.id, name: newUser.name, email: newUser.email };
        localStorage.setItem('zenith_session', JSON.stringify(session));
        onLogin(session);
      } else {
        // Sign In - verify credentials
        const existingUsers = JSON.parse(localStorage.getItem('zenith_users') || '[]');
        const user = existingUsers.find(
          u => u.email === formData.email.trim().toLowerCase() && u.password === formData.password
        );

        if (!user) {
          setError('Invalid email or password. Please try again.');
          setIsLoading(false);
          return;
        }

        const session = { id: user.id, name: user.name, email: user.email };
        localStorage.setItem('zenith_session', JSON.stringify(session));
        onLogin(session);
      }

      setIsLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Orbs */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        top: '-100px',
        right: '-100px',
        animation: 'float 8s ease-in-out infinite',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
        bottom: '-80px',
        left: '-80px',
        animation: 'float 10s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '440px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        zIndex: 1
      }}>
        {/* Logo Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)',
            borderRadius: '20px',
            color: '#fff',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.15)',
            display: 'inline-flex'
          }}>
            <Sparkles size={32} />
          </div>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '800',
              fontFamily: 'var(--font-heading)',
              background: 'linear-gradient(135deg, #fff 30%, var(--accent-purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em'
            }}>
              raza's todo app
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Powered by Zenith AI — Your smart productivity workspace
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div 
          className="glass-panel"
          style={{
            padding: '32px',
            background: 'rgba(20, 16, 40, 0.75)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <button
              onClick={() => { setIsSignUp(false); setError(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: !isSignUp ? 'linear-gradient(135deg, var(--accent-purple), #7c3aed)' : 'transparent',
                color: !isSignUp ? '#fff' : 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: !isSignUp ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'
              }}
            >
              <LogIn size={16} />
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: isSignUp ? 'linear-gradient(135deg, var(--accent-purple), #7c3aed)' : 'transparent',
                color: isSignUp ? '#fff' : 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: isSignUp ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'
              }}
            >
              <UserPlus size={16} />
              Sign Up
            </button>
          </div>

          {/* Welcome Text */}
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '4px' }}>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {isSignUp ? 'join raza\'s todo app for intelligent task management' : 'sign in to continue to your workspace'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div 
              className="animate-fade-in"
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                color: 'var(--priority-high)',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-premium"
                    style={{ width: '100%', paddingLeft: '42px', height: '46px' }}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-premium"
                  style={{ width: '100%', paddingLeft: '42px', height: '46px' }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-premium"
                  style={{ width: '100%', paddingLeft: '42px', paddingRight: '42px', height: '46px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-premium btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                height: '48px',
                fontSize: '0.95rem',
                fontWeight: '600',
                marginTop: '4px',
                opacity: isLoading ? 0.7 : 1,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isLoading ? (
                <div className="typing-indicator" style={{ gap: '6px' }}>
                  <span className="typing-dot" style={{ width: '8px', height: '8px', background: '#fff' }}></span>
                  <span className="typing-dot" style={{ width: '8px', height: '8px', background: '#fff' }}></span>
                  <span className="typing-dot" style={{ width: '8px', height: '8px', background: '#fff' }}></span>
                </div>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'var(--text-muted)',
            fontSize: '0.75rem'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.06)' }}></div>
            <span>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.06)' }}></div>
          </div>

          {/* Guest Login */}
          <button
            onClick={() => {
              const guestSession = {
                id: 'guest-' + Math.random().toString(36).substr(2, 6),
                name: 'Guest User',
                email: 'guest@zenith.app'
              };
              localStorage.setItem('zenith_session', JSON.stringify(guestSession));
              onLogin(guestSession);
            }}
            className="btn-premium btn-secondary"
            style={{
              width: '100%',
              justifyContent: 'center',
              height: '44px',
              fontSize: '0.85rem'
            }}
          >
            <User size={16} />
            Continue as Guest
          </button>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          by continuing, you agree to raza's todo app terms of service
        </p>
      </div>
    </div>
  );
}
