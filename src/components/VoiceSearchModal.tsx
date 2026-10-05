import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, X } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Fale agora...');

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      return;
    }

    setIsListening(true);
    setStatusMessage('Ouvindo...');

    const SpeechRecognition = 
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || 
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    let recognition: any = null;

    if (SpeechRecognition) {
      try {
        recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          if (event.results[current].isFinal) {
            setIsListening(false);
            setStatusMessage('Pesquisando...');
            setTimeout(() => {
              onSearch(text);
              onClose();
            }, 500);
          }
        };

        recognition.onerror = () => {
          setStatusMessage('Não foi possível ouvir. Toque no microfone para tentar novamente.');
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (e) {
        setIsListening(false);
      }
    } else {
      setStatusMessage('Reconhecimento de voz não suportado neste navegador.');
      setIsListening(false);
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    };
  }, [isOpen, onSearch, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl bg-white p-7 relative text-center flex flex-col items-center shadow-2xl border border-slate-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          {statusMessage}
        </h3>
        <p className="text-xs text-slate-500 mb-6">Pesquisa por voz no Google</p>

        {/* Animated Google-Style Mic Button */}
        <div className="relative my-6 flex items-center justify-center">
          {isListening && (
            <>
              <div className="absolute w-32 h-32 rounded-full bg-[#4285F4]/15 animate-ping" />
              <div className="absolute w-24 h-24 rounded-full bg-[#EA4335]/20 animate-pulse" />
              <div className="absolute w-20 h-20 rounded-full bg-[#FBBC05]/25 animate-pulse" />
            </>
          )}

          <div
            className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
              isListening
                ? 'bg-gradient-to-tr from-[#4285F4] to-[#34A853] text-white scale-110 shadow-[#4285F4]/30'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isListening ? (
              <Mic className="w-9 h-9" />
            ) : (
              <MicOff className="w-8 h-8" />
            )}
          </div>
        </div>

        {transcript && (
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm max-w-xs truncate">
            "{transcript}"
          </div>
        )}
      </motion.div>
    </div>
  );
};
