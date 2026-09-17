import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
  } catch (err) {
    console.error('Fatal mounting error in Life OS:', err);
    rootElement.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0c0d10;color:#f4f4f5;padding:1.5rem;font-family:ui-sans-serif,system-ui,sans-serif;">
        <div style="max-width:420px;width:100%;border-radius:1rem;border:1px solid rgba(245,158,11,0.3);background:#121316;padding:1.5rem;text-align:center;">
          <div style="font-size:1.5rem;margin-bottom:0.75rem;color:#f59e0b;">⚡</div>
          <h2 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem;color:#f4f4f5;">Life OS Recovery</h2>
          <p style="font-size:0.75rem;color:#a1a1aa;margin-bottom:1rem;line-height:1.4;">
            ${(err instanceof Error ? err.message : String(err)) || 'Failed to initialize the dashboard view.'}
          </p>
          <button onclick="localStorage.removeItem('LIFE_OS_DATA_V1');window.location.reload();" style="border:none;border-radius:0.5rem;background:#f59e0b;color:#090a0c;font-weight:700;font-size:0.75rem;padding:0.6rem 1.2rem;cursor:pointer;">
            Reset &amp; Reload
          </button>
        </div>
      </div>
    `;
  }
}
