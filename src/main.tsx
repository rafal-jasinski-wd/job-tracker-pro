import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>,
    );
  } catch (error) {
    console.error("CRITICAL BOOT ERROR:", error);
    rootElement.innerHTML = `
      <div style="padding: 2rem; font-family: sans-serif; text-align: center; color: #ef4444;">
        <h1 style="font-size: 1.5rem;">Application Failed to Load</h1>
        <p>A critical error occurred during startup. Please check your internet connection and try again.</p>
        <pre style="text-align: left; background: #1a1a1a; padding: 1rem; border-radius: 8px; font-size: 0.8rem; overflow: auto; max-width: 600px; margin: 2rem auto;">
          ${error}
        </pre>
        <p style="color: #666; font-size: 0.8rem;">Note: If you are the developer, ensure all environment variables are set in Netlify.</p>
      </div>
    `;
  }
}
