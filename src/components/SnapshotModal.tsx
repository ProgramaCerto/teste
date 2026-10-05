import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Download, Check, X } from 'lucide-react';
import { BrowserTab } from '../types';

interface SnapshotModalProps {
  isOpen: boolean;
  tab: BrowserTab;
  onClose: () => void;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({
  isOpen,
  tab,
  onClose,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl bg-white light-floating p-5 relative flex flex-col items-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-4 h-4 text-[#0066FF]" />
          <h3 className="font-bold text-sm text-[#1F1F1F]">Captura Instantânea</h3>
        </div>

        {/* Snapshot Preview Card */}
        <div className="w-full rounded-2xl bg-[#F8F9FA] border border-slate-200 p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-[10px] text-slate-500">
            <span className="font-mono text-[#0066FF] truncate max-w-[180px]">{tab.url}</span>
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <div className="my-3 p-3 rounded-xl bg-white border border-slate-200">
            <h4 className="text-xs font-bold text-[#1F1F1F] line-clamp-2">{tab.title}</h4>
            <p className="mt-1 text-[11px] text-slate-500 line-clamp-3">
              Captura gerada no navegador CertoFlow com renderização limpa e nítida.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-400">
            <span>CertoFlow Browser</span>
            <span className="text-[#0066FF] font-semibold">1080 × 1920 PX</span>
          </div>
        </div>

        <div className="flex w-full gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 px-3 rounded-xl brand-gradient text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs shadow-[#0066FF]/20 hover:opacity-95 transition-all cursor-pointer"
          >
            {downloaded ? <Check className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
            <span>{downloaded ? 'Baixado!' : 'Baixar Imagem'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
