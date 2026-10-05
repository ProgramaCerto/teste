import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Copy, Check, X, Upload, VideoOff, RefreshCw } from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  currentUrl: string;
  onClose: () => void;
  onScanResult: (scannedText: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  currentUrl,
  onClose,
  onScanResult,
}) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'generate'>('scan');
  const [copied, setCopied] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera stream when modal is opened on 'scan' tab
  useEffect(() => {
    if (!isOpen || activeTab !== 'scan') {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setHasCameraPermission(true);
      } else {
        setHasCameraPermission(false);
      }
    } catch (err) {
      setHasCameraPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl bg-white p-6 relative text-center flex flex-col items-center shadow-2xl border border-slate-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switchers */}
        <div className="flex p-1 bg-[#F1F3F4] rounded-2xl mb-4 w-full">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'scan'
                ? 'bg-white text-[#0066FF] shadow-xs'
                : 'text-slate-500 hover:text-[#1F1F1F]'
            }`}
          >
            Digitalizar com Câmera
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'generate'
                ? 'bg-white text-[#0066FF] shadow-xs'
                : 'text-slate-500 hover:text-[#1F1F1F]'
            }`}
          >
            Meu QR Code
          </button>
        </div>

        {activeTab === 'scan' ? (
          <div className="w-full flex flex-col items-center">
            {/* Viewfinder Graphic with Live Video Feed */}
            <div className="relative w-56 h-56 rounded-3xl bg-black border-2 border-[#0066FF] flex items-center justify-center overflow-hidden my-1 shadow-inner">
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-40 h-40 border-2 border-white/60 rounded-2xl relative">
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#0066FF]" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#0066FF]" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#0066FF]" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#0066FF]" />
                </div>
              </div>

              {/* Animated Laser Scan Line */}
              <motion.div
                animate={{ y: [-90, 90, -90] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-[#0066FF] to-transparent shadow-[0_0_12px_#0066FF]"
              />

              {hasCameraPermission === false && (
                <div className="absolute inset-0 bg-slate-900/90 text-white flex flex-col items-center justify-center p-4 text-center">
                  <VideoOff className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs font-semibold mb-1">Câmera não disponível</p>
                  <p className="text-[11px] text-slate-400 mb-3">Permita o acesso à câmera para escanear QR codes ao vivo.</p>
                  <button
                    onClick={startCamera}
                    className="px-3 py-1.5 rounded-xl bg-[#0066FF] text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Tentar Novamente</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-2 mb-3">
              Aponte para qualquer código QR ou escolha um atalho:
            </p>

            <div className="w-full space-y-1.5">
              <button
                onClick={() => {
                  stopCamera();
                  onScanResult('https://www.google.com');
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-[#EDF4FF] text-xs text-slate-800 font-semibold transition-colors cursor-pointer text-left flex items-center justify-between"
              >
                <span>Google Brasil</span>
                <span className="text-[10px] text-slate-400 font-mono">google.com</span>
              </button>

              <button
                onClick={() => {
                  stopCamera();
                  onScanResult('https://pt.wikipedia.org');
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-[#EDF4FF] text-xs text-slate-800 font-semibold transition-colors cursor-pointer text-left flex items-center justify-between"
              >
                <span>Wikipédia em Português</span>
                <span className="text-[10px] text-slate-400 font-mono">pt.wikipedia.org</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm my-2 flex items-center justify-center">
              <svg className="w-40 h-40" viewBox="0 0 100 100" fill="#1F1F1F">
                <rect x="5" y="5" width="25" height="25" fill="#1F1F1F" rx="3" />
                <rect x="9" y="9" width="17" height="17" fill="white" rx="2" />
                <rect x="13" y="13" width="9" height="9" fill="#0066FF" rx="1" />

                <rect x="70" y="5" width="25" height="25" fill="#1F1F1F" rx="3" />
                <rect x="74" y="9" width="17" height="17" fill="white" rx="2" />
                <rect x="78" y="13" width="9" height="9" fill="#0066FF" rx="1" />

                <rect x="5" y="70" width="25" height="25" fill="#1F1F1F" rx="3" />
                <rect x="9" y="74" width="17" height="17" fill="white" rx="2" />
                <rect x="13" y="78" width="9" height="9" fill="#0066FF" rx="1" />

                <rect x="35" y="10" width="5" height="5" />
                <rect x="45" y="15" width="5" height="5" fill="#0066FF" />
                <rect x="55" y="10" width="5" height="5" />
                <rect x="40" y="35" width="5" height="5" fill="#0066FF" />
                <rect x="50" y="45" width="5" height="5" />
                <rect x="60" y="35" width="5" height="5" />
                <rect x="15" y="45" width="5" height="5" />
                <rect x="25" y="55" width="5" height="5" fill="#0066FF" />
                <rect x="45" y="65" width="5" height="5" />
                <rect x="70" y="55" width="5" height="5" />
                <rect x="85" y="65" width="5" height="5" fill="#0066FF" />
                <rect x="75" y="80" width="5" height="5" />
                <rect x="50" y="80" width="5" height="5" />
              </svg>
            </div>

            <span className="text-xs font-mono text-slate-600 mt-2 truncate max-w-[240px]">
              {currentUrl}
            </span>

            <button
              onClick={handleCopyUrl}
              className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F1F3F4] hover:bg-[#E8EAED] text-xs font-semibold text-[#1F1F1F] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copiado!' : 'Copiar Endereço'}</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
