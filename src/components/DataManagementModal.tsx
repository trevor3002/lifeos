import React, { useRef, useState } from 'react';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  Database,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: (jsonStr: string) => { success: boolean; message: string };
  onReset: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  onExport,
  onImport,
  onReset,
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = onImport(content);
        if (result.success) {
          setFeedback({ type: 'success', message: result.message });
          setTimeout(() => {
            onClose();
            setFeedback(null);
          }, 1200);
        } else {
          setFeedback({ type: 'error', message: result.message });
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmReset = () => {
    if (window.confirm('Reset all Life OS data to starter template? This will restore initial habits and tasks.')) {
      onReset();
      setFeedback({ type: 'success', message: 'Reset to sample Life OS data!' });
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border-t sm:border border-[#24282f] bg-[#121316] p-5 sm:p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto">
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1 rounded-full bg-zinc-700 mx-auto mb-3 sm:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-[#1f2228]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
              Data &amp; Backup Hub
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
          Life OS operates 100% client-side with offline PWA caching. All entries reside in your browser's persistent storage. Back up or migrate your records anytime.
        </p>

        {feedback && (
          <div
            className={`mt-3 flex items-center gap-2 rounded-xl p-3 text-xs ${
              feedback.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="mt-4 space-y-2.5">
          {/* Export */}
          <button
            onClick={onExport}
            className="w-full flex items-center justify-between rounded-xl border border-[#24282f] bg-[#16181d] p-3.5 hover:border-amber-500/40 transition text-left group min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-amber-400 border border-zinc-700">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-100">Export Backup (JSON)</div>
                <div className="text-[11px] text-zinc-400">Download tasks, habits &amp; journal records</div>
              </div>
            </div>
            <span className="text-xs font-mono text-amber-400 group-hover:translate-x-0.5 transition">Save</span>
          </button>

          {/* Import */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between rounded-xl border border-[#24282f] bg-[#16181d] p-3.5 hover:border-emerald-500/40 transition text-left group min-h-[52px]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-emerald-400 border border-zinc-700">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-100">Import Backup (JSON)</div>
                  <div className="text-[11px] text-zinc-400">Restore or transfer from another device</div>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 group-hover:translate-x-0.5 transition">Open</span>
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={handleConfirmReset}
            className="w-full flex items-center justify-between rounded-xl border border-[#24282f] bg-[#0c0d10] p-3.5 hover:border-rose-500/40 transition text-left group min-h-[52px]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-rose-400 border border-zinc-800">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-300">Reset to Starter Demo</div>
                <div className="text-[11px] text-zinc-500">Restore default demo templates &amp; habits</div>
              </div>
            </div>
            <span className="text-xs font-mono text-zinc-500 group-hover:text-rose-400 transition">Reset</span>
          </button>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 text-xs font-medium min-h-[40px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
