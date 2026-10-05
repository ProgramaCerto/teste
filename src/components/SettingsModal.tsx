import React from 'react';
import { 
  X, 
  Settings, 
  Search, 
  Trash2, 
  ShieldCheck, 
  Globe, 
  Palette, 
  Download,
  Info,
  Check
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDF4FF] text-[#0066FF] flex items-center justify-center">
              <Settings className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-base font-bold text-[#1F1F1F]">Configurações do Navegador</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* 1. Mecanismo de Pesquisa Padrão */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1F1F1F]">
                <Search className="w-4 h-4 text-[#0066FF]" />
                <span>Mecanismo de Pesquisa</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Padrão
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Mecanismo utilizado para pesquisas na barra de endereços e na página inicial:
            </p>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-[#1F1F1F]">Google (padrão oficial)</span>
            </div>
          </div>

          {/* 2. Privacidade e Dados */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F1F1F] mb-2">
              <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
              <span>Privacidade e Histórico</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Limpe o histórico de páginas acessadas e caches locais a qualquer momento:
            </p>
            <button
              onClick={() => {
                if (confirm('Deseja limpar todo o histórico de navegação local?')) {
                  onClearHistory();
                  alert('Histórico de navegação limpo com sucesso.');
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Dados de Navegação</span>
            </button>
          </div>

          {/* 3. Downloads / Transferências */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F1F1F] mb-1">
              <Download className="w-4 h-4 text-[#0066FF]" />
              <span>Downloads e Arquivos</span>
            </div>
            <div className="text-xs text-slate-600">
              Local padrão de download: <span className="font-mono text-slate-800">Downloads</span>
            </div>
          </div>

          {/* 4. Sobre o CertoFlow */}
          <div className="p-4 rounded-2xl bg-[#EDF4FF]/50 border border-[#0066FF]/20">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0066FF] mb-1">
              <Info className="w-4 h-4 text-[#0066FF]" />
              <span>Sobre o CertoFlow Browser</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              CertoFlow Versão 1.2.0 (Compilação Oficial). Navegador web de alta velocidade integrado à Pesquisa Google e com arquitetura inspirada no Opera.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl brand-gradient text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
