import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const AuthPage = () => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, resetPassword } = useAuth();
  const [view, setView] = useState<'signin' | 'register' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleError = (err: any) => {
    let msg = err.message || 'An error occurred';
    if (msg.includes('auth/invalid-credential')) msg = 'Invalid email or password.';
    if (msg.includes('auth/email-already-in-use')) msg = 'This email is already registered.';
    if (msg.includes('auth/weak-password')) msg = 'Password should be at least 6 characters.';
    if (msg.includes('auth/user-not-found')) msg = 'No user found with this email.';
    setError(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (view === 'signin') {
        await loginWithEmail(email, password);
      } else if (view === 'register') {
        await registerWithEmail(email, password);
      } else if (view === 'forgot') {
        await resetPassword(email);
        setMessage('Password reset email sent! Check your inbox.');
        setView('signin');
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <img src="/jobtracker-logo.png" alt="Jobtrackr Logo" style={{ width: '60px', marginBottom: '1rem', mixBlendMode: 'screen' }} />
        <h1 style={{ fontSize: '2rem', margin: 0 }}>
          {view === 'signin' ? 'Welcome Back' : view === 'register' ? 'Create Account' : 'Reset Password'}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          {view === 'signin' ? 'Sign in to manage your applications' : view === 'register' ? 'Start tracking your applications seamlessly' : 'We will send you a link to reset your password'}
        </p>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: colorMix('in srgb', '#ef4444 15%', 'transparent'), color: '#ef4444', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid #ef4444' }}>
            {error}
          </div>
        )}
        
        {message && (
          <div style={{ padding: '0.75rem', backgroundColor: colorMix('in srgb', '#22c55e 15%', 'transparent'), color: '#22c55e', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid #22c55e' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="you@example.com"
            />
          </div>
          
          {view !== 'forgot' && (
            <div>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Password
                {view === 'signin' && (
                  <button type="button" onClick={() => { setView('forgot'); setError(''); setMessage(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}>
                    Forgot password?
                  </button>
                )}
              </label>
              <input 
                type="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          )}

          <button type="submit" className="btn" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Processing...' : view === 'signin' ? 'Sign In' : view === 'register' ? 'Register' : 'Send Reset Link'}
          </button>
        </form>

        {view !== 'forgot' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
              <span style={{ padding: '0 1rem' }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
            </div>

            <button 
              type="button"
              onClick={loginWithGoogle}
              className="btn btn--ghost"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            >
              Sign in with Google
            </button>
          </>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {view === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={() => { setView('register'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Create one</button>
            </>
          ) : view === 'register' ? (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => { setView('signin'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Sign in</button>
            </>
          ) : (
            <button type="button" onClick={() => { setView('signin'); setError(''); setMessage(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
              Back to Sign in
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

// Helper for inline css colors
function colorMix(method: string, c1: string, c2: string) {
  return `color-mix(${method}, ${c1}, ${c2})`;
}
