import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Send, Copy, Check, Laptop, Tablet, X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  mode: 'share' | 'send';
  url: string;
  title: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  mode,
  url,
  title,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [sentDevice, setSentDevice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToDevice = (deviceName: string) => {
    setSentDevice(deviceName);
    setTimeout(() => {
      setSentDevice(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl bg-white light-floating p-5 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          {mode === 'share' ? (
            <Share2 className="w-4 h-4 text-[#0066FF]" />
          ) : (
            <Send className="w-4 h-4 text-[#0066FF]" />
          )}
          <h3 className="font-bold text-sm text-[#1F1F1F]">
            {mode === 'share' ? 'Compartilhar Página' : 'Enviar para Dispositivo'}
          </h3>
        </div>

        <div className="p-3 rounded-xl bg-[#F8F9FA] border border-slate-200 mb-4">
          <span className="block text-xs font-semibold text-[#1F1F1F] truncate">{title}</span>
          <span className="block text-[11px] font-mono text-[#0066FF] truncate mt-0.5">{url}</span>
        </div>

        {mode === 'share' ? (
          <div className="space-y-2.5">
            <button
              onClick={handleCopy}
              className="w-full py-2.5 px-4 rounded-xl bg-[#F1F3F4] hover:bg-[#E8EAED] text-[#1F1F1F] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Endereço Copiado!' : 'Copiar Link'}</span>
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={() => {
                  navigator.share({ title, url }).catch(() => {});
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl brand-gradient text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Menu de Partilha do Sistema</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <span className="text-[11px] text-slate-500 block mb-1">
              Dispositivos locais CertoFlow:
            </span>

            {[
              { id: 'dev-1', name: 'Notebook Pessoal', icon: Laptop },
              { id: 'dev-2', name: 'Tablet CertoFlow', icon: Tablet },
            ].map((device) => {
              const Icon = device.icon;
              const isSelected = sentDevice === device.name;

              return (
                <button
                  key={device.id}
                  onClick={() => handleSendToDevice(device.name)}
                  disabled={Boolean(sentDevice)}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F0F6FF] border-[#0066FF] text-[#0066FF]'
                      : 'bg-white border-slate-200 hover:bg-[#F8F9FA] text-[#1F1F1F]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F1F3F4] flex items-center justify-center text-slate-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold">{device.name}</span>
                      <span className="block text-[10px] text-slate-400">Pronto para receber</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}

            {sentDevice && (
              <p className="text-center text-xs text-emerald-600 pt-1 font-medium animate-pulse">
                Página enviada com sucesso para {sentDevice}!
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
