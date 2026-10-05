import React from 'react';
import { Plus, X, Globe, Shield, Minus, Square } from 'lucide-react';
import { BrowserTab } from '../types';

interface BrowserTabsHeaderProps {
  tabs: BrowserTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTab: () => void;
  onOpenTabManager?: () => void;
}

export const BrowserTabsHeader: React.FC<BrowserTabsHeaderProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onOpenTabManager,
}) => {
  return (
    <div className="w-full h-10 bg-[#E8EAED] border-b border-[#D0D4D9] px-2 flex items-end justify-between select-none overflow-hidden shrink-0">
      {/* Tabs list + New Tab button */}
      <div className="flex items-end gap-1 flex-1 min-w-0 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isHome = tab.url === 'about:blank' || tab.url === 'certoflow://newtab';
          const isGoogle = tab.url.includes('google.com') || Boolean(tab.searchQuery);

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative h-9 min-w-[130px] max-w-[220px] flex items-center justify-between px-3 rounded-t-xl text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#1F1F1F] font-semibold shadow-xs z-10'
                  : 'bg-transparent hover:bg-[#DADCE0] text-slate-700 font-medium'
              }`}
            >
              {/* Tab Icon */}
              <div className="flex items-center gap-2 min-w-0 mr-1">
                {isHome ? (
                  <div className="w-4 h-4 rounded-full bg-[#EDF4FF] text-[#0066FF] flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold">C</span>
                  </div>
                ) : isGoogle ? (
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                ) : tab.isIncognito ? (
                  <Shield className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                ) : (
                  <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}

                {/* Tab Title */}
                <span className="truncate text-xs">
                  {isHome ? 'Nova Guia' : tab.title}
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={`p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200/80 transition-colors shrink-0 ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                title="Fechar aba"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* Botão Nova Guia (+) */}
        <button
          type="button"
          onClick={onNewTab}
          className="h-8 w-8 rounded-full hover:bg-[#DADCE0] text-slate-600 hover:text-[#0066FF] flex items-center justify-center mb-0.5 transition-colors cursor-pointer shrink-0"
          title="Abrir Nova Guia"
        >
          <Plus className="w-4.5 h-4.5 stroke-[2.2]" />
        </button>
      </div>

      {/* Janela: Minimizar, Maximizar, Fechar */}
      <div className="flex items-center gap-0.5 mb-1 shrink-0 ml-2">
        <button
          onClick={() => {
            const el = document.documentElement;
            if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {});
            }
          }}
          className="w-8 h-7 flex items-center justify-center text-slate-500 hover:bg-[#DADCE0] hover:text-slate-800 rounded transition-colors"
          title="Minimizar janela"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}
          className="w-8 h-7 flex items-center justify-center text-slate-500 hover:bg-[#DADCE0] hover:text-slate-800 rounded transition-colors"
          title="Maximizar / Restaurar tela cheia"
        >
          <Square className="w-3 h-3" />
        </button>

        <button
          onClick={() => {
            window.close();
          }}
          className="w-8 h-7 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white rounded transition-colors"
          title="Fechar janela"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
