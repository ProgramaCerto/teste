import React, { useState } from 'react';
import { 
  ArrowLeft, 
  X, 
  User, 
  Settings, 
  Search, 
  History, 
  Star, 
  Download, 
  WifiOff, 
  Palette, 
  Lock, 
  KeyRound, 
  RefreshCw, 
  ShieldCheck, 
  Info, 
  Trash2, 
  Plus, 
  ExternalLink,
  ChevronRight,
  Check
} from 'lucide-react';
import { 
  UserProfile, 
  SearchEngineType, 
  BookmarkItem, 
  HistoryItem, 
  DownloadItem, 
  OfflinePageItem, 
  WallpaperOption 
} from '../types';

export const SEARCH_ENGINES: { id: SearchEngineType; name: string; icon: string; url: string; color: string }[] = [
  { id: 'google', name: 'Google', icon: 'G', url: 'https://www.google.com/search?q=%s&igu=1', color: '#4285F4' },
  { id: 'bing', name: 'Microsoft Bing', icon: 'B', url: 'https://www.bing.com/search?q=%s', color: '#008373' },
  { id: 'yahoo', name: 'Yahoo! Search', icon: 'Y', url: 'https://search.yahoo.com/search?p=%s', color: '#6001D2' },
  { id: 'duckduckgo', name: 'DuckDuckGo', icon: 'D', url: 'https://html.duckduckgo.com/html/?q=%s', color: '#DE5833' },
];

interface SideProfileSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: UserProfile;
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  onAddProfile: (name: string, color: string) => void;
  currentSearchEngine: SearchEngineType;
  onSelectSearchEngine: (engine: SearchEngineType) => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onRemoveHistoryItem: (id: string) => void;
  bookmarks: BookmarkItem[];
  onRemoveBookmark: (id: string) => void;
  downloads: DownloadItem[];
  offlinePages: OfflinePageItem[];
  wallpapers: WallpaperOption[];
  currentWallpaper: WallpaperOption;
  onSelectWallpaper: (wp: WallpaperOption) => void;
  onNavigate: (url: string, title?: string) => void;
}

type DrawerView = 
  | 'main' 
  | 'profiles' 
  | 'searchengine' 
  | 'history' 
  | 'bookmarks' 
  | 'downloads' 
  | 'offline' 
  | 'appearance' 
  | 'privacy' 
  | 'passwords' 
  | 'sync' 
  | 'about';

export const SideProfileSettingsDrawer: React.FC<SideProfileSettingsDrawerProps> = ({
  isOpen,
  onClose,
  activeProfile,
  profiles,
  onSelectProfile,
  onAddProfile,
  currentSearchEngine,
  onSelectSearchEngine,
  history,
  onClearHistory,
  onRemoveHistoryItem,
  bookmarks,
  onRemoveBookmark,
  downloads,
  offlinePages,
  wallpapers,
  currentWallpaper,
  onSelectWallpaper,
  onNavigate,
}) => {
  const [currentView, setCurrentView] = useState<DrawerView>('main');
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#0066FF');
  const [showAddProfileInput, setShowAddProfileInput] = useState(false);

  if (!isOpen) return null;

  const handleBack = () => {
    if (currentView === 'main') {
      onClose();
    } else {
      setCurrentView('main');
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    onAddProfile(newProfileName.trim(), selectedColor);
    setNewProfileName('');
    setShowAddProfileInput(false);
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'profiles': return 'Gerenciar Perfis';
      case 'searchengine': return 'Mecanismo de Pesquisa';
      case 'history': return 'Histórico de Navegação';
      case 'bookmarks': return 'Favoritos';
      case 'downloads': return 'Transferências';
      case 'offline': return 'Páginas Offline';
      case 'appearance': return 'Aparência e Temas';
      case 'privacy': return 'Privacidade e Segurança';
      case 'passwords': return 'Senhas Salvas';
      case 'sync': return 'Sincronização';
      case 'about': return 'Sobre o CertoFlow';
      default: return 'Configurações e Perfil';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
      />

      {/* Side Drawer in the corner/edge of screen */}
      <div className="relative w-full max-w-sm sm:max-w-md h-full bg-white text-[#1F1F1F] shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250 border-l border-slate-200">
        
        {/* Top Header with Back Arrow and Title */}
        <header className="h-14 px-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title={currentView === 'main' ? 'Fechar painel' : 'Voltar'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-slate-800">{getViewTitle()}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans select-text">

          {/* ========================================================
              VIEW: MAIN MENU
             ======================================================== */}
          {currentView === 'main' && (
            <div className="space-y-4">
              {/* Active Profile Card */}
              <div 
                onClick={() => setCurrentView('profiles')}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-[#EDF4FF] to-white border border-[#0066FF]/20 flex items-center justify-between cursor-pointer hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-11 h-11 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-sm"
                    style={{ backgroundColor: activeProfile.avatarColor || '#0066FF' }}
                  >
                    {activeProfile.initials || activeProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{activeProfile.name}</h4>
                    <span className="text-[11px] text-[#0066FF] font-semibold">
                      {activeProfile.isGuest ? 'Perfil Visitante' : 'Perfil Ativo'} · Alternar
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Quick Settings Group */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-2xs">
                {/* Mecanismo de Pesquisa */}
                <button
                  onClick={() => setCurrentView('searchengine')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Mecanismo de Pesquisa</span>
                      <span className="text-[11px] text-slate-500 capitalize">Atual: {currentSearchEngine}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Histórico */}
                <button
                  onClick={() => setCurrentView('history')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Histórico de Navegação</span>
                      <span className="text-[11px] text-slate-500">{history.length} páginas recentes</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Favoritos */}
                <button
                  onClick={() => setCurrentView('bookmarks')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Favoritos</span>
                      <span className="text-[11px] text-slate-500">{bookmarks.length} favoritos salvos</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Transferências */}
                <button
                  onClick={() => setCurrentView('downloads')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Transferências (Downloads)</span>
                      <span className="text-[11px] text-slate-500">{downloads.length} arquivos</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Páginas Offline */}
                <button
                  onClick={() => setCurrentView('offline')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                      <WifiOff className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Páginas Offline</span>
                      <span className="text-[11px] text-slate-500">{offlinePages.length} salvas para ler sem internet</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Personalization & Privacy Group */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-2xs">
                {/* Aparência */}
                <button
                  onClick={() => setCurrentView('appearance')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Aparência</span>
                      <span className="text-[11px] text-slate-500">Temas e Papel de parede</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Sincronização */}
                <button
                  onClick={() => setCurrentView('sync')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Sincronização</span>
                      <span className="text-[11px] text-slate-500">Sincronizar abas e dados</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Senhas */}
                <button
                  onClick={() => setCurrentView('passwords')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Senhas</span>
                      <span className="text-[11px] text-slate-500">Gerenciador de senhas seguras</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Privacidade */}
                <button
                  onClick={() => setCurrentView('privacy')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Privacidade e Segurança</span>
                      <span className="text-[11px] text-slate-500">Bloqueio de rastreadores e cookies</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Sobre */}
                <button
                  onClick={() => setCurrentView('about')}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Sobre o Navegador</span>
                      <span className="text-[11px] text-slate-500">Versão 2.4.0 (Build 20261005)</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW: MECANISMO DE PESQUISA (Google, Bing, Yahoo, DuckDuckGo)
             ======================================================== */}
          {currentView === 'searchengine' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 mb-2">
                Escolha o mecanismo de pesquisa padrão utilizado na barra de navegação e nas pesquisas rápidas:
              </p>

              {SEARCH_ENGINES.map((engine) => (
                <div
                  key={engine.id}
                  onClick={() => {
                    onSelectSearchEngine(engine.id);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    currentSearchEngine === engine.id
                      ? 'border-[#0066FF] bg-[#EDF4FF]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs"
                      style={{ backgroundColor: engine.color }}
                    >
                      {engine.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{engine.name}</h4>
                      <span className="text-[11px] text-slate-500 truncate block max-w-xs">{engine.url}</span>
                    </div>
                  </div>

                  {currentSearchEngine === engine.id && (
                    <div className="w-6 h-6 rounded-full bg-[#0066FF] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ========================================================
              VIEW: GERENCIAR PERFIS
             ======================================================== */}
          {currentView === 'profiles' && (
            <div className="space-y-4">
              <div className="space-y-2">
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProfile(p)}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      activeProfile.id === p.id
                        ? 'border-[#0066FF] bg-[#EDF4FF]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-xs"
                        style={{ backgroundColor: p.avatarColor }}
                      >
                        {p.initials || p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{p.name}</h4>
                        <span className="text-[10px] text-slate-500">
                          {p.isGuest ? 'Perfil Temporário' : 'Perfil Salvo'}
                        </span>
                      </div>
                    </div>

                    {activeProfile.id === p.id && (
                      <span className="text-[11px] font-bold text-[#0066FF]">Ativo</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Profile Section */}
              {showAddProfileInput ? (
                <form onSubmit={handleCreateProfile} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800">Novo Perfil de Usuário</h4>
                  <input
                    type="text"
                    required
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Nome do perfil (ex: Trabalho, Pessoal)"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#0066FF]"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    {['#0066FF', '#00C2FF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-6 h-6 rounded-full transition-transform ${selectedColor === c ? 'scale-125 ring-2 ring-slate-800' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-[#0066FF] text-white text-xs font-bold hover:bg-[#0052CC]"
                    >
                      Salvar Perfil
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddProfileInput(false)}
                      className="px-3 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowAddProfileInput(true)}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#0066FF] text-[#0066FF] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Novo Perfil</span>
                </button>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW: HISTÓRICO
             ======================================================== */}
          {currentView === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{history.length} páginas registradas</span>
                {history.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Limpar Histórico</span>
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Nenhum histórico de navegação registrado.
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-between group transition-all"
                    >
                      <div 
                        onClick={() => {
                          onClose();
                          onNavigate(item.url, item.title);
                        }}
                        className="flex-1 min-w-0 cursor-pointer"
                      >
                        <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-[#0066FF]">
                          {item.title || item.url}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono truncate block">
                          {item.url}
                        </span>
                      </div>

                      <button
                        onClick={() => onRemoveHistoryItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Remover do histórico"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW: FAVORITOS
             ======================================================== */}
          {currentView === 'bookmarks' && (
            <div className="space-y-3">
              {bookmarks.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Nenhum favorito adicionado ainda. Toque na estrela da barra de navegação para salvar páginas.
                </div>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-between group transition-all"
                    >
                      <div 
                        onClick={() => {
                          onClose();
                          onNavigate(bm.url, bm.title);
                        }}
                        className="flex-1 min-w-0 cursor-pointer"
                      >
                        <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-amber-600">
                          {bm.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono truncate block">
                          {bm.url}
                        </span>
                      </div>

                      <button
                        onClick={() => onRemoveBookmark(bm.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Remover favorito"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW: TRANSFERÊNCIAS (DOWNLOADS)
             ======================================================== */}
          {currentView === 'downloads' && (
            <div className="space-y-3">
              {downloads.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Nenhum arquivo baixado no momento.
                </div>
              ) : (
                <div className="space-y-2">
                  {downloads.map((dl) => (
                    <div key={dl.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate">{dl.filename}</h4>
                          <span className="text-[10px] text-slate-400">{dl.size} · Concluído</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW: PÁGINAS OFFLINE
             ======================================================== */}
          {currentView === 'offline' && (
            <div className="space-y-3">
              {offlinePages.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Nenhuma página offline salva. Páginas salvas como offline ficam disponíveis mesmo sem conexão com a internet.
                </div>
              ) : (
                <div className="space-y-2">
                  {offlinePages.map((op) => (
                    <div key={op.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{op.title}</h4>
                        <span className="text-[10px] text-slate-400">{op.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW: APARÊNCIA E PAPÉIS DE PAREDE
             ======================================================== */}
          {currentView === 'appearance' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800">Papéis de Parede da Nova Guia</h4>
              <div className="grid grid-cols-2 gap-2.5">
                {wallpapers.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => onSelectWallpaper(wp)}
                    className={`h-20 rounded-xl overflow-hidden border-2 relative transition-all cursor-pointer ${
                      currentWallpaper.id === wp.id ? 'border-[#0066FF] shadow-sm' : 'border-transparent'
                    }`}
                  >
                    {wp.type === 'image' ? (
                      <img src={wp.value} alt={wp.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" style={{ background: wp.value }} />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[10px] text-white truncate text-center">
                      {wp.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW: PRIVACIDADE E SEGURANÇA
             ======================================================== */}
          {currentView === 'privacy' && (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 mb-1 text-emerald-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Proteção contra Rastreadores Ativa</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  O CertoFlow bloqueia ativamente rastreadores de terceiros, scripts invasivos e requisições de anúncios para garantir sua privacidade.
                </p>
              </div>

              <button
                onClick={onClearHistory}
                className="w-full py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 transition-colors cursor-pointer"
              >
                Limpar Todos os Dados de Navegação e Cookies
              </button>
            </div>
          )}

          {/* ========================================================
              VIEW: SENHAS
             ======================================================== */}
          {currentView === 'passwords' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <KeyRound className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-800">Cofre de Senhas CertoFlow</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  As senhas salvas são criptografadas localmente com chaves seguras e nunca são compartilhadas com terceiros.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW: SINCRONIZAÇÃO
             ======================================================== */}
          {currentView === 'sync' && (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center">
                <RefreshCw className="w-8 h-8 text-[#0066FF] mx-auto mb-2 animate-spin-slow" />
                <h4 className="text-xs font-bold text-slate-800">Sincronização Ativa</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Seus favoritos, configurações e abas abertas estão sincronizados no perfil atual: <strong>{activeProfile.name}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW: SOBRE
             ======================================================== */}
          {currentView === 'about' && (
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-sm font-bold text-slate-900">CertoFlow Browser</h4>
                <p className="text-xs text-slate-600">
                  Navegador web moderno e premium com suporte a múltiplos motores de busca, atalhos personalizáveis e compatibilidade PWA.
                </p>
                <div className="pt-2 text-[11px] text-slate-500 space-y-1 font-mono border-t border-slate-100">
                  <div>Versão: 2.4.0 (Stable)</div>
                  <div>Build: 20261005</div>
                  <div>Motor: Chromium Core Enhanced</div>
                  <div>Arquivo de versão: <a href="/version.json" target="_blank" className="text-[#0066FF] underline">version.json</a></div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
