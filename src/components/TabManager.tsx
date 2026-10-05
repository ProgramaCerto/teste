import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Globe, Shield } from 'lucide-react';
import { BrowserTab } from '../types';

interface TabManagerProps {
  tabs: BrowserTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTab: () => void;
  onCloseAllTabs: () => void;
  onCloseManager: () => void;
}

export const TabManager: React.FC<TabManagerProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onCloseAllTabs,
  onCloseManager,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F8F9FA] text-[#1F1F1F] select-none">
      {/* Header Bar */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] bg-white shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-base text-[#1F1F1F] font-['Outfit']">
            Guias Abertas
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#EDF4FF] text-[#0066FF] text-xs font-mono font-bold">
            {tabs.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {tabs.length > 1 && (
            <button
              onClick={onCloseAllTabs}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Fechar Todas
            </button>
          )}

          <button
            onClick={onCloseManager}
            className="px-3.5 py-1.5 rounded-xl bg-[#1F1F1F] text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            Concluído
          </button>
        </div>
      </header>

      {/* Main Tabs Grid Container */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 max-w-3xl mx-auto">
          <AnimatePresence mode="popLayout">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              const isHome = tab.url === 'about:blank' || tab.url === 'certoflow://newtab';

              return (
                <motion.div
                  key={tab.id}
                  layout
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`group relative flex flex-col rounded-2xl overflow-hidden bg-white light-card transition-all cursor-pointer ${
                    isActive
                      ? 'ring-2 ring-[#0066FF] border-[#0066FF] shadow-md'
                      : 'hover:border-slate-300'
                  }`}
                  onClick={() => onSelectTab(tab.id)}
                >
                  {/* Tab Card Header */}
                  <div className="flex items-center justify-between px-3 py-2 bg-[#F8F9FA] border-b border-slate-100">
                    <div className="flex items-center gap-1.5 min-w-0 pr-1">
                      {tab.isIncognito ? (
                        <Shield className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-[#1F1F1F] truncate">
                        {isHome ? 'Nova Guia' : tab.title}
                      </span>
                    </div>

                    {/* Close Tab Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id);
                      }}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                      title="Fechar guia"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Tab Card Preview Thumbnail */}
                  <div className="h-32 sm:h-36 bg-gradient-to-b from-white to-[#F8F9FA] p-3 flex flex-col justify-between relative overflow-hidden">
                    {isHome ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-8 h-8 rounded-full bg-[#EDF4FF] text-[#0066FF] flex items-center justify-center mb-1.5">
                          <Globe className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-[#1F1F1F]">
                          CertoFlow Início
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Página de busca & favoritos
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <span className="text-[10px] font-mono text-[#0066FF] truncate block">
                            {tab.url.replace(/^https?:\/\//, '')}
                          </span>
                          <p className="mt-1 text-xs font-bold text-[#1F1F1F] line-clamp-2 leading-snug">
                            {tab.title}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span>Navegador Web</span>
                          <span className="font-mono">{tab.zoomLevel}%</span>
                        </div>
                      </div>
                    )}

                    {/* Active Tab Badge */}
                    {isActive && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#0066FF] text-white font-bold text-[9px]">
                        ATIVA
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* MANDATORY PROMPT REQUIREMENT: */}
            {/* "O botão '+' para abrir uma nova aba deve ficar POSICIONADO EXATAMENTE AO LADO DA ÚLTIMA GUIA ABERTA (como no Google Chrome), facilitando o toque contínuo com o polegar, e NÃO isolado no canto inferior da tela." */}
            <motion.div
              layout
              key="add-new-tab-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col"
            >
              <button
                type="button"
                onClick={onNewTab}
                className="w-full h-full min-h-[160px] sm:min-h-[180px] rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#0066FF] bg-white hover:bg-[#F0F6FF] flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-[#0066FF] transition-all cursor-pointer group shadow-2xs"
                title="Abrir Nova Guia"
              >
                <div className="w-12 h-12 rounded-full bg-[#F1F3F4] group-hover:bg-[#EDF4FF] flex items-center justify-center transition-transform group-hover:scale-110">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="text-center">
                  <span className="block text-xs font-bold text-[#1F1F1F] tracking-wide">
                    Nova Guia
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Toque para abrir
                  </span>
                </div>
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
