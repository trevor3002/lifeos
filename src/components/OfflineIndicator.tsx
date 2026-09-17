import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-indicator"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-950/90 px-4 py-2.5 text-xs font-medium text-amber-200 shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3"
    >
      <WifiOff className="h-4 w-4 text-amber-400 shrink-0 animate-pulse" />
      <span>
        <strong>Offline Mode Active</strong> — All tasks, habits, and journals are saved locally and fully functional.
      </span>
    </div>
  );
};
