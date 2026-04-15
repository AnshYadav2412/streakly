import React, { useState, useEffect } from 'react';

const InstallInstructions = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState('unknown');
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
    
    if (isIOS || isSafari) {
      setPlatform('ios');
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Chrome/Edge - use native prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstructions(false);
      }
    } else {
      // Show manual instructions
      setShowInstructions(true);
    }
  };

  if (isInstalled) {
    return (
      <div className="card bg-green-50 border-2 border-green-500">
        <div className="card-body p-4 text-center">
          <div className="text-4xl mb-2">✅</div>
          <h3 className="font-bold text-green-900 mb-1">App Installed!</h3>
          <p className="text-sm text-green-700">
            Streakly is installed on your device
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Install Button */}
      <div className="card glass border-2 border-amber-500">
        <div className="card-body p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                📱 Install Streakly App
              </h3>
              <p className="text-sm text-gray-600">
                Get the app for quick access and offline support
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="btn-primary w-full btn-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Install App
          </button>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Works Offline
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Fast & Secure
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No App Store
            </span>
          </div>
        </div>
      </div>

      {/* Manual Instructions */}
      {showInstructions && (
        <div className="card animate-slideUp">
          <div className="card-header flex items-center justify-between">
            <h4 className="font-bold">Installation Instructions</h4>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="card-body">
            {platform === 'ios' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tap the Share button</p>
                    <p className="text-sm text-gray-600">Look for the <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded">□↑</span> icon at the bottom of Safari</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Scroll and tap "Add to Home Screen"</p>
                    <p className="text-sm text-gray-600">You may need to scroll down in the menu</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tap "Add"</p>
                    <p className="text-sm text-gray-600">The app will appear on your home screen!</p>
                  </div>
                </div>
              </div>
            )}

            {platform === 'android' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tap the menu button</p>
                    <p className="text-sm text-gray-600">Look for <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded">⋮</span> (three dots) in the top right</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tap "Install app" or "Add to Home screen"</p>
                    <p className="text-sm text-gray-600">The option may vary by browser</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tap "Install"</p>
                    <p className="text-sm text-gray-600">The app will appear in your app drawer!</p>
                  </div>
                </div>
              </div>
            )}

            {platform === 'desktop' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Look for the install icon</p>
                    <p className="text-sm text-gray-600">Find the <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded">⊕</span> icon in the address bar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Click "Install"</p>
                    <p className="text-sm text-gray-600">Or use menu (⋮) &gt; "Install Streakly"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Launch the app</p>
                    <p className="text-sm text-gray-600">The app will open in its own window!</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>💡 Tip:</strong> Once installed, the app works offline and loads instantly!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallInstructions;
