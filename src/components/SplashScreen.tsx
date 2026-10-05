import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CertoFlowLogo } from './CertoFlowLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Exactly 1.5s splash screen duration
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 300);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 select-none cursor-pointer"
      onClick={onFinish}
    >
      <div className="flex flex-col items-center">
        {/* Central Logo in High Definition */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center mb-8"
        >
          <CertoFlowLogo size={72} showText={false} />
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1F1F1F] font-['Outfit'] mt-3">
            Certo<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#00A3FF]">Flow</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 tracking-wide">
            Navegador Web Leve & Moderno
          </p>
        </motion.div>

        {/* Fine Fluid Circular Spinner with Brand Gradient */}
        <div className="w-7 h-7 spinner-flow mb-3" />
        <span className="text-[11px] font-medium text-slate-400">
          Iniciando...
        </span>
      </div>
    </motion.div>
  );
};
