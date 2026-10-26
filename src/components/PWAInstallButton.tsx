import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.js';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If running already in standalone mode, show a small verified badge
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#79DDB0]/20 text-[#26354A] text-[12px] font-black border border-[#26354A]/10">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#26354A]" />
        Installed App
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          if (isInstallable) {
            install();
          } else {
            setShowModal(true);
          }
        }}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#56B7F5] text-white text-[13px] font-black border-2 border-[#26354A] shadow-xs hover:bg-[#43a2dc] active:scale-95 transition-all cursor-pointer"
        aria-label="Install App / Get Android APK"
      >
        <Smartphone className="w-4 h-4 text-white" />
        <span>Install App</span>
      </button>

      {/* Android & APK Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#26354A]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[28px] border-3 border-[#26354A] bg-[#FFFBF2] p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-[#26354A] bg-white flex items-center justify-center text-[#26354A] hover:bg-black/5 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-[18px] bg-[#FFD45C] border-2 border-[#26354A] flex items-center justify-center overflow-hidden shadow-xs">
                <img
                  src="/app-logo.png"
                  alt="Playtown Learn logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-[20px] font-black text-[#26354A]">Install on Android</h3>
                <p className="text-[12px] font-extrabold text-[#26354A]/60">Playtown Mobile App</p>
              </div>
            </div>

            <div className="space-y-3.5 text-[#26354A] text-[14px]">
              <div className="p-3.5 rounded-[18px] bg-white border-2 border-[#26354A]/20">
                <p className="font-black text-[15px] mb-1 text-[#26354A]">
                  Option 1: Direct Android Install (WebAPK)
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[13px] text-[#26354A]/80 font-semibold">
                  <li>Open this URL in Chrome on your Android device</li>
                  <li>Tap the <strong>Chrome menu (⋮)</strong></li>
                  <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong></li>
                </ol>
                <p className="text-[11px] text-[#26354A]/60 mt-1.5 font-bold">
                  Android automatically packages this into a native WebAPK with full offline support and an app launcher icon!
                </p>
              </div>

              <div className="p-3.5 rounded-[18px] bg-white border-2 border-[#26354A]/20">
                <p className="font-black text-[15px] mb-1 text-[#26354A]">
                  Option 2: Download Standalone .APK
                </p>
                <p className="text-[13px] text-[#26354A]/80 font-medium">
                  Because this cloud container runs a web runtime without Android SDK/Gradle, you can download a signed APK file in 1 click using <strong>PWABuilder</strong>:
                </p>
                <p className="text-[12px] font-bold text-[#56B7F5] mt-1 break-all select-all bg-[#56B7F5]/10 p-2 rounded-[10px]">
                  https://www.pwabuilder.com
                </p>
                <p className="text-[11px] text-[#26354A]/70 mt-1">
                  Paste the app URL on PWABuilder and click <strong>"Build Android APK"</strong> to download the ready-to-install .apk file!
                </p>
              </div>

              {isIOS && (
                <div className="p-3 rounded-[14px] bg-[#FFEFAF] text-[12px] font-bold text-[#26354A]">
                  On iPhone/iPad: Tap the Share button in Safari, then tap "Add to Home Screen".
                </div>
              )}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-5 py-3.5 rounded-[20px] bg-[#26354A] text-white font-black text-[16px] hover:bg-[#1a2636] cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
