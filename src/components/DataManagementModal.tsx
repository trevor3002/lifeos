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
    if (window.confirm('Reset all Life OS data to default starter template? This will replace your current entries.')) {
      onReset();
      setFeedback({ type: 'success', message: 'Reset to sample Life OS data!' });
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Data &amp; Backup Hub
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-400 leading-relaxed">
          Life OS operates 100% client-side with offline PWA storage. Your data is stored securely in your browser. Use the options below to back up or migrate your records.
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

        <div className="mt-4 space-y-3">
          {/* Export */}
          <button
            onClick={onExport}
            className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 hover:border-indigo-500/40 hover:bg-slate-950 transition text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Export Backup (JSON)</div>
                <div className="text-[11px] text-slate-400">Download all your tasks, habits &amp; journal logs</div>
              </div>
            </div>
            <span className="text-xs text-indigo-400 group-hover:translate-x-0.5 transition">Save</span>
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
              className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 hover:border-teal-500/40 hover:bg-slate-950 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600/20 text-teal-400 border border-teal-500/30">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Import Backup (JSON)</div>
                  <div className="text-[11px] text-slate-400">Restore or transfer from another device</div>
                </div>
              </div>
              <span className="text-xs text-teal-400 group-hover:translate-x-0.5 transition">Open</span>
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={handleConfirmReset}
            className="w-full flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 hover:border-rose-500/40 transition text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600/10 text-rose-400 border border-rose-500/20">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-300">Reset to Starter Demo</div>
                <div className="text-[11px] text-slate-500">Restore default demo templates &amp; habits</div>
              </div>
            </div>
            <span className="text-xs text-slate-500 group-hover:text-rose-400 transition">Reset</span>
          </button>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 text-xs font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
