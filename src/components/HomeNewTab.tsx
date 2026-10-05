import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Mic, 
  QrCode, 
  Plus, 
  Settings, 
  Globe, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  Palette,
  Star,
  Bookmark,
  GripHorizontal
} from 'lucide-react';
import { ShortcutItem, WallpaperOption, UserProfile, BookmarkItem } from '../types';
import { CertoFlowLogo } from './CertoFlowLogo';

interface HomeNewTabProps {
  shortcuts: ShortcutItem[];
  bookmarks: BookmarkItem[];
  currentWallpaper: WallpaperOption;
  wallpapers: WallpaperOption[];
  activeProfile: UserProfile;
  onNavigate: (urlOrQuery: string) => void;
  onAddShortcut: (shortcut: Omit<ShortcutItem, 'id'>) => void;
  onUpdateShortcut: (id: string, updated: Partial<ShortcutItem>) => void;
  onDeleteShortcut: (id: string) => void;
  onReorderShortcuts: (newShortcuts: ShortcutItem[]) => void;
  onSelectWallpaper: (wp: WallpaperOption) => void;
  onOpenVoiceSearch: () => void;
  onOpenQrScanner: () => void;
}

export const HomeNewTab: React.FC<HomeNewTabProps> = ({
  shortcuts,
  bookmarks,
  currentWallpaper,
  wallpapers,
  activeProfile,
  onNavigate,
  onAddShortcut,
  onUpdateShortcut,
  onDeleteShortcut,
  onReorderShortcuts,
  onSelectWallpaper,
  onOpenVoiceSearch,
  onOpenQrScanner,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'bookmarks'>('shortcuts');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<ShortcutItem | null>(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Context Menu / Long Press menu
  const [contextMenuShortcut, setContextMenuShortcut] = useState<ShortcutItem | null>(null);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Handle long press (touch & mouse hold)
  const handleTouchStart = (shortcut: ShortcutItem, e: React.TouchEvent | React.MouseEvent) => {
    longPressTimerRef.current = setTimeout(() => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      setContextMenuShortcut(shortcut);
      setContextMenuPos({ x: clientX, y: clientY });
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onNavigate(searchInput.trim());
  };

  const handleSaveShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) return;

    let formattedUrl = formUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    if (editingShortcut) {
      onUpdateShortcut(editingShortcut.id, {
        title: formTitle.trim(),
        url: formattedUrl,
      });
      setEditingShortcut(null);
    } else {
      onAddShortcut({
        title: formTitle.trim(),
        url: formattedUrl,
        iconName: 'globe',
        bgColor: '#FFFFFF',
      });
      setIsAddModalOpen(false);
    }

    setFormTitle('');
    setFormUrl('');
  };

  const openEditModal = (shortcut: ShortcutItem) => {
    setEditingShortcut(shortcut);
    setFormTitle(shortcut.title);
    setFormUrl(shortcut.url);
    setContextMenuShortcut(null);
  };

  // Helper to extract clean domain favicon
  const getDomainFavicon = (url: string) => {
    try {
      const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    } catch {
      return null;
    }
  };

  // Drag and Drop reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const reordered = [...shortcuts];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    onReorderShortcuts(reordered);
    setDraggedIndex(null);
  };

  return (
    <div 
      onClick={() => setContextMenuShortcut(null)}
      className="relative min-h-full w-full flex flex-col justify-between p-4 sm:p-6 select-none overflow-y-auto"
    >
      {/* Top Header: Profile indicator & Appearance customization */}
      <div className="flex items-center justify-between pt-1 pb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs"
            style={{ backgroundColor: activeProfile.avatarColor || '#0066FF' }}
          >
            {activeProfile.initials || activeProfile.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-medium text-slate-700">
            {activeProfile.isGuest ? 'Visitante' : activeProfile.name}
          </span>
        </div>

        <button
          onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
          className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-[#F1F3F4] transition-colors cursor-pointer"
          title="Personalização de aparência"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Customization Drawer */}
      <AnimatePresence>
        {isCustomizeOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 rounded-3xl bg-white border border-slate-200 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#1F1F1F] flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#0066FF]" />
                Papel de Parede da Nova Guia
              </span>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {wallpapers.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => onSelectWallpaper(wp)}
                  className={`h-16 rounded-2xl overflow-hidden border-2 relative transition-all cursor-pointer ${
                    currentWallpaper.id === wp.id ? 'border-[#0066FF] shadow-sm' : 'border-transparent'
                  }`}
                >
                  {wp.type === 'image' ? (
                    <img src={wp.value} alt={wp.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full" style={{ background: wp.value }} />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 p-0.5 text-[9px] text-white truncate text-center">
                    {wp.name}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Central Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full my-auto py-4">
        
        {/* Logo CertoFlow */}
        <div className="mb-6 flex flex-col items-center">
          <CertoFlowLogo size={56} showText={true} />
        </div>

        {/* Central Search Bar */}
        <div className="w-full relative mb-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="w-full h-13 px-4.5 rounded-[50px] bg-white border border-slate-200 hover:border-slate-300 focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-[#0066FF]/15 shadow-sm flex items-center gap-3 transition-all">
              <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />

              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Pesquise no Google ou digite um URL..."
                className="w-full bg-transparent text-sm sm:text-base text-[#1F1F1F] placeholder-slate-400 outline-none font-normal"
              />

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={onOpenVoiceSearch}
                  aria-label="Pesquisa por voz"
                  title="Pesquisa por voz do Google"
                  className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:text-[#0066FF] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Mic className="w-4.5 h-4.5" />
                </button>

                <button
                  type="button"
                  onClick={onOpenQrScanner}
                  aria-label="Leitor de Código QR"
                  title="Escanear QR Code com a câmera"
                  className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:text-[#0066FF] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <QrCode className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tabs: Atalhos Rápidos & Favoritos */}
        <div className="w-full mb-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('shortcuts')}
              className={`text-xs font-bold transition-all cursor-pointer pb-1 ${
                activeTab === 'shortcuts'
                  ? 'text-[#0066FF] border-b-2 border-[#0066FF]'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Atalhos Rápidos ({shortcuts.length})
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`text-xs font-bold transition-all cursor-pointer pb-1 ${
                activeTab === 'bookmarks'
                  ? 'text-[#0066FF] border-b-2 border-[#0066FF]'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Favoritos ({bookmarks.length})
            </button>
          </div>

          {activeTab === 'shortcuts' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-semibold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </button>
          )}
        </div>

        {/* Content of Tab 1: ATALHOS RÁPIDOS */}
        {activeTab === 'shortcuts' && (
          <div className="w-full">
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {shortcuts.map((shortcut, index) => {
                const favicon = getDomainFavicon(shortcut.url);
                return (
                  <div
                    key={shortcut.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    className="relative flex flex-col items-center group cursor-grab active:cursor-grabbing"
                  >
                    <button
                      onClick={() => onNavigate(shortcut.url)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenuShortcut(shortcut);
                        setContextMenuPos({ x: e.clientX, y: e.clientY });
                      }}
                      onTouchStart={(e) => handleTouchStart(shortcut, e)}
                      onTouchEnd={handleTouchEnd}
                      onMouseDown={(e) => handleTouchStart(shortcut, e)}
                      onMouseUp={handleTouchEnd}
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 hover:border-[#0066FF] shadow-xs hover:shadow-md flex items-center justify-center p-2.5 transition-all relative overflow-hidden group-hover:scale-105"
                      title={`${shortcut.title} (Segure para editar)`}
                    >
                      {favicon ? (
                        <img 
                          src={favicon} 
                          alt={shortcut.title}
                          className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-md"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-[#EDF4FF] text-[#0066FF] font-bold text-sm flex items-center justify-center">
                          {shortcut.title.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>

                    <span className="mt-1.5 text-xs font-semibold text-slate-800 truncate max-w-[72px] text-center">
                      {shortcut.title}
                    </span>
                  </div>
                );
              })}

              {/* Botão Adicionar Atalho */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-300 hover:border-[#0066FF] bg-white hover:bg-[#EDF4FF]/50 flex items-center justify-center text-slate-400 hover:text-[#0066FF] transition-all cursor-pointer shadow-2xs"
                  title="Adicionar novo atalho"
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </button>
                <span className="mt-1.5 text-xs font-medium text-slate-500">
                  Adicionar
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content of Tab 2: FAVORITOS */}
        {activeTab === 'bookmarks' && (
          <div className="w-full">
            {bookmarks.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                Nenhum favorito salvo ainda. Ao navegar, clique no ícone de estrela para favoritar páginas.
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {bookmarks.map((bm) => {
                  const favicon = getDomainFavicon(bm.url);
                  return (
                    <div key={bm.id} className="relative flex flex-col items-center group">
                      <button
                        onClick={() => onNavigate(bm.url)}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md flex items-center justify-center p-2.5 transition-all relative overflow-hidden group-hover:scale-105"
                      >
                        {favicon ? (
                          <img 
                            src={favicon} 
                            alt={bm.title}
                            className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-md"
                          />
                        ) : (
                          <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
                        )}
                      </button>
                      <span className="mt-1.5 text-xs font-semibold text-slate-800 truncate max-w-[72px] text-center">
                        {bm.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="pt-4 pb-2 text-center text-[11px] text-slate-400">
        CertoFlow Web · Navegação Segura e Rápida
      </footer>

      {/* Context Menu on Long Press (Editar / Excluir) */}
      {contextMenuShortcut && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setContextMenuShortcut(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-2"
          >
            <div className="px-2 pb-2 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                {contextMenuShortcut.title}
              </h4>
              <button 
                onClick={() => setContextMenuShortcut(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => openEditModal(contextMenuShortcut)}
              className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-[#0066FF]" />
              <span>Editar Atalho</span>
            </button>

            <button
              onClick={() => {
                onDeleteShortcut(contextMenuShortcut.id);
                setContextMenuShortcut(null);
              }}
              className="w-full px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Excluir Atalho</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal: Adicionar ou Editar Atalho */}
      <AnimatePresence>
        {(isAddModalOpen || editingShortcut) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-white shadow-2xl p-6 relative border border-slate-200"
            >
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingShortcut(null);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-[#1F1F1F] mb-1">
                {editingShortcut ? 'Editar Atalho' : 'Adicionar Novo Atalho'}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Digite o nome e o endereço web para fixar na página inicial.
              </p>

              <form onSubmit={handleSaveShortcut} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome do site
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ex: YouTube, Wikipédia, Notícias"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/15 outline-none text-xs text-[#1F1F1F]"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Endereço Web (URL)
                  </label>
                  <input
                    type="text"
                    required
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="Ex: youtube.com ou https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/15 outline-none text-xs text-[#1F1F1F]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingShortcut(null);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    {editingShortcut ? 'Salvar Alterações' : 'Adicionar Atalho'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
