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

  const handleError = (err: unknown) => {
    let msg = err instanceof Error ? err.message : 'An error occurred';
    if (msg.includes('auth/invalid-credential')) msg = 'Invalid email or password.';
    if (msg.includes('auth/email-already-in-use')) msg = 'This email is already registered.';
    if (msg.includes('auth/weak-password')) msg = 'Password should be at least 6 characters.';
    if (msg.includes('auth/user-not-found')) msg = 'No user found with this email.';
    if (msg.includes('auth/unauthorized-domain')) {
      msg = 'This domain is not authorized in your Firebase Console. Please add your Netlify URL to the "Authorized Domains" list.';
    }
    setError(msg);
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      handleError(err);
    }
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
    <div className="app-container auth-container">
      
      <div className="auth-brand">
        <img src="/jobtracker-logo.webp" alt="Jobtrackr Logo" className="auth-brand-logo" />
        <h1 className="auth-brand-title">
          {view === 'signin' ? 'Welcome Back' : view === 'register' ? 'Create Account' : 'Reset Password'}
        </h1>
        <p className="auth-brand-subtitle">
          {view === 'signin' ? 'Sign in to manage your applications' : view === 'register' ? 'Start tracking your applications seamlessly' : 'We will send you a link to reset your password'}
        </p>
      </div>

      <div className="card auth-card">
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        {message && (
          <div className="auth-success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
              <label className="form-label auth-label-row">
                Password
                {view === 'signin' && (
                  <button type="button" onClick={() => { setView('forgot'); setError(''); setMessage(''); }} className="auth-link-btn auth-link-btn--small">
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

          <button type="submit" className="btn auth-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : view === 'signin' ? 'Sign In' : view === 'register' ? 'Register' : 'Send Reset Link'}
          </button>
        </form>

        {view !== 'forgot' && (
          <>
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">OR</span>
              <div className="auth-divider-line" />
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="btn btn--ghost auth-google-btn"
            >
              Sign in with Google
            </button>
          </>
        )}


        <div className="auth-footer">
          {view === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={() => { setView('register'); setError(''); }} className="auth-link-btn">Create one</button>
            </>
          ) : view === 'register' ? (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => { setView('signin'); setError(''); }} className="auth-link-btn">Sign in</button>
            </>
          ) : (
            <button type="button" onClick={() => { setView('signin'); setError(''); setMessage(''); }} className="auth-link-btn">
              Back to Sign in
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
