import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Search, 
  Lock, 
  X, 
  Mic, 
  Star, 
  MoreVertical 
} from 'lucide-react';
import { BrowserTab, UserProfile } from '../types';

interface BrowserTopBarProps {
  currentTab: BrowserTab;
  tabCount: number;
  activeProfile: UserProfile;
  canGoBack: boolean;
  canGoForward: boolean;
  isBookmarked: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onGoHome: () => void;
  onReload: () => void;
  onNavigate: (input: string) => void;
  onToggleBookmark: () => void;
  onOpenVoiceSearch: () => void;
  onOpenSideDrawer: () => void;
  onOpenOptionsPanel: () => void;
}

export const BrowserTopBar: React.FC<BrowserTopBarProps> = ({
  currentTab,
  activeProfile,
  canGoBack,
  canGoForward,
  isBookmarked,
  onGoBack,
  onGoForward,
  onGoHome,
  onReload,
  onNavigate,
  onToggleBookmark,
  onOpenVoiceSearch,
  onOpenSideDrawer,
  onOpenOptionsPanel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const omniboxRef = useRef<HTMLDivElement>(null);

  // Sync address bar input with active tab URL
  useEffect(() => {
    if (!isEditing) {
      if (currentTab.url === 'about:blank' || currentTab.url === 'certoflow://newtab') {
        setInputValue('');
      } else if (currentTab.searchQuery) {
        setInputValue(currentTab.searchQuery);
      } else {
        setInputValue(currentTab.url);
      }
    }
  }, [currentTab.url, currentTab.searchQuery, isEditing]);

  // Click outside to dismiss suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (omniboxRef.current && !omniboxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (suggestion: string) => {
    const clean = suggestion.trim();
    if (!clean) return;
    setInputValue(clean);
    setShowSuggestions(false);
    setIsEditing(false);
    inputRef.current?.blur();
    onNavigate(clean);
  };

  const handleSubmit = (e?: React.FormEvent, overrideVal?: string) => {
    if (e) e.preventDefault();
    const val = (overrideVal || inputValue).trim();
    if (!val) return;

    setShowSuggestions(false);
    setIsEditing(false);
    inputRef.current?.blur();
    onNavigate(val);
  };

  const handleClear = () => {
    setInputValue('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const isHomeTab = currentTab.url === 'about:blank' || currentTab.url === 'certoflow://newtab';

  return (
    <div className="w-full bg-white border-b border-[#E8EAED] px-3 py-1.5 select-none shadow-2xs z-30 shrink-0">
      <div className="flex items-center gap-1.5 sm:gap-2">
        
        {/* Seta de Voltar (<-) */}
        <button
          onClick={onGoBack}
          disabled={!canGoBack}
          aria-label="Voltar"
          title="Voltar (Página anterior)"
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
            canGoBack 
              ? 'text-[#1F1F1F] hover:bg-[#EDF4FF] hover:text-[#0066FF] active:scale-95' 
              : 'text-slate-300 cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Seta de Avançar (->) */}
        <button
          onClick={onGoForward}
          disabled={!canGoForward}
          aria-label="Avançar"
          title="Avançar (Próxima página)"
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
            canGoForward 
              ? 'text-[#1F1F1F] hover:bg-[#EDF4FF] hover:text-[#0066FF] active:scale-95' 
              : 'text-slate-300 cursor-not-allowed'
          }`}
        >
          <ArrowRight className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Recarregar (⟳) */}
        <button
          onClick={onReload}
          aria-label="Recarregar"
          title="Recarregar página atual"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-700 hover:bg-[#EDF4FF] hover:text-[#0066FF] transition-all cursor-pointer"
        >
          <RotateCw className={`w-4 h-4 stroke-[2] ${currentTab.isLoading ? 'animate-spin text-[#0066FF]' : ''}`} />
        </button>

        {/* Início (Home) */}
        <button
          onClick={onGoHome}
          aria-label="Página Inicial"
          title="Página Inicial"
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
            isHomeTab
              ? 'text-[#0066FF] bg-[#EDF4FF]'
              : 'text-slate-700 hover:text-[#0066FF] hover:bg-[#EDF4FF]'
          }`}
        >
          <Home className="w-4 h-4" />
        </button>

        {/* Omnibox / Barra de Endereços Central */}
        <div className="flex-1 relative flex items-center min-w-0 mx-1" ref={omniboxRef}>
          <form onSubmit={handleSubmit} className="w-full">
            <div
              className={`w-full h-9.5 px-3.5 rounded-full flex items-center gap-2.5 transition-all ${
                isEditing
                  ? 'bg-white border-2 border-[#0066FF] shadow-sm ring-2 ring-[#0066FF]/15'
                  : 'bg-[#F1F3F4] hover:bg-[#E8EAED] border border-transparent cursor-text'
              }`}
              onClick={() => {
                if (!isEditing) {
                  setIsEditing(true);
                  setTimeout(() => inputRef.current?.select(), 40);
                }
              }}
            >
              {/* Search or Lock Icon */}
              {isHomeTab ? (
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <div className="flex items-center gap-1 text-emerald-600 shrink-0" title="Conexão Segura">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              )}

              {/* URL or Search Input */}
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => {
                  setIsEditing(true);
                  setTimeout(() => inputRef.current?.select(), 40);
                }}
                placeholder="Pesquise no Google ou digite um URL..."
                className="w-full bg-transparent text-xs sm:text-sm text-[#1F1F1F] placeholder-slate-500 outline-none truncate font-normal"
              />

              {/* Actions inside Omnibox */}
              <div className="flex items-center gap-1 shrink-0">
                {isEditing && inputValue && (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleClear();
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Limpar campo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenVoiceSearch();
                  }}
                  className="p-1.5 rounded-full text-slate-500 hover:text-[#0066FF] hover:bg-[#EDF4FF] transition-colors cursor-pointer"
                  title="Pesquisar por voz"
                >
                  <Mic className="w-4 h-4 text-[#0066FF]" />
                </button>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark();
                    }}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      isBookmarked
                        ? 'text-amber-500'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title={isBookmarked ? 'Página favoritada' : 'Favoritar página'}
                  >
                    <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* User Profile Badge (Clicking opens side drawer in the corner as requested by user) */}
        <button
          onClick={onOpenSideDrawer}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 cursor-pointer shadow-2xs hover:opacity-90 active:scale-95 transition-all"
          style={{ backgroundColor: activeProfile.avatarColor || '#0066FF' }}
          title={`Perfil e Configurações: ${activeProfile.name}`}
        >
          {activeProfile.initials || activeProfile.name.charAt(0).toUpperCase()}
        </button>

        {/* Menu Três Pontinhos (•••) */}
        <button
          onClick={onOpenOptionsPanel}
          aria-label="Opções do Navegador"
          title="Opções do Navegador"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-700 hover:bg-[#EDF4FF] hover:text-[#0066FF] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <MoreVertical className="w-5 h-5 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};
