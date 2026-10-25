'use client';

import { useState, useEffect } from 'react';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user already dismissed it in the last 7 days
    const dismissedAt = localStorage.getItem('cba_install_dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show the prompt after a 3-second delay so it doesn't jump scare them
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('cba_install_dismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 md:bottom-6 md:left-auto md:right-6 md:w-96 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/10 flex items-start gap-4">
        <div className="text-3xl">🎂</div>
        <div className="flex-1">
          <h3 className="font-display text-lg text-ink font-medium">Install Cakes by Aspeya</h3>
          <p className="text-xs text-olive-dark mt-1">Add to home screen for a faster, app-like experience.</p>
          <div className="mt-3 flex gap-2">
            <button 
              onClick={handleInstall} 
              className="rounded-full bg-burgundy px-4 py-1.5 text-xs font-medium text-cream hover:bg-burgundy-dark transition shadow"
            >
              Install App
            </button>
            <button 
              onClick={handleDismiss} 
              className="rounded-full bg-cream px-4 py-1.5 text-xs font-medium text-olive-dark hover:bg-cream-dark transition"
            >
              Not now
            </button>
          </div>
        </div>
        <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
      </div>
    </div>
  );
}