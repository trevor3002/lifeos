import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, do not show
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2.5 py-1.5 text-xs font-semibold shadow-sm transition active:scale-95 min-h-[34px]"
        title="Install Life OS to your home screen"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-ios-btn"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-[#2e333b] bg-[#14161a] hover:bg-zinc-800 text-zinc-300 px-2.5 py-1.5 text-xs font-medium transition active:scale-95 min-h-[34px]"
          title="Add Life OS to Home Screen"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in">
            <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl border-t sm:border border-[#24282f] bg-[#121316] p-6 shadow-2xl text-zinc-100">
              <div className="w-12 h-1 rounded-full bg-zinc-700 mx-auto mb-3 sm:hidden" />
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1f2228]">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Download className="w-4 h-4 text-amber-400" />
                  Install Life OS on iOS
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-start gap-3 rounded-xl bg-[#16181d] border border-[#24282f] p-3">
                  <Share2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-100 block">Step 1: Tap Share</strong>
                    In the Safari bottom toolbar, tap the <strong>Share</strong> button.
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-[#16181d] border border-[#24282f] p-3">
                  <PlusSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-100 block">Step 2: Add to Home Screen</strong>
                    Scroll down in the share sheet and select <strong>Add to Home Screen</strong>.
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 pt-1">
                  Life OS will launch standalone without browser address bars with instant offline capabilities!
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-semibold text-zinc-100 border border-zinc-700 transition min-h-[44px]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
