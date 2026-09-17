import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Life OS Uncaught Runtime Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetAndReload = () => {
    try {
      localStorage.removeItem('LIFE_OS_DATA_V1');
      // Also unregister any broken service workers if available
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }
    } catch (e) {
      console.error('Error clearing data:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected application error occurred.';

      return (
        <div className="min-h-screen bg-[#0c0d10] text-zinc-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl border border-amber-500/30 bg-[#121316] p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-zinc-100">Life OS Recovery Mode</h1>
                <p className="text-xs text-zinc-400">A runtime error occurred during rendering</p>
              </div>
            </div>

            <div className="rounded-xl border border-[#24282f] bg-[#0c0d10] p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Error Diagnostic</span>
              </div>
              <p className="text-xs font-mono text-zinc-300 break-words leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              This can happen if stored local data from an earlier version was structured differently or if an asset failed to load. You can reload or reset your local data cache.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2.5 text-xs transition active:scale-95 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload App</span>
              </button>

              <button
                onClick={this.handleResetAndReload}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#2e333b] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold px-4 py-2.5 text-xs transition active:scale-95 cursor-pointer"
                title="Clears corrupted localStorage and restores defaults"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Reset Local Data</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
