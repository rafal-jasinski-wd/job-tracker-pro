import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught render error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: '500px', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#ef4444', marginBottom: '1rem' }}>
              <AlertTriangle size={48} />
            </div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: 0 }}>Something went wrong</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              We're sorry, but the application encountered an unexpected error. 
              Refreshing the page usually fixes this.
            </p>
            {this.state.error && (
              <pre style={{ 
                background: 'var(--bg-accent)', 
                padding: '1rem', 
                borderRadius: '8px', 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)',
                overflowX: 'auto',
                maxWidth: '100%',
                textAlign: 'left',
                marginBottom: '2rem'
              }}>
                {this.state.error.message}
              </pre>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="btn"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RefreshCw size={16} /> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
