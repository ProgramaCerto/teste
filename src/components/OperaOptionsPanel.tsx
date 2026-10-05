import React from 'react';
import { 
  Share2, 
  Monitor, 
  Smartphone, 
  ZoomIn, 
  ZoomOut, 
  Languages, 
  Search, 
  FileDown, 
  Printer, 
  Bookmark, 
  BookmarkCheck, 
  History, 
  Download, 
  Settings, 
  X, 
  DownloadCloud
} from 'lucide-react';
import { BrowserTab, UserProfile } from '../types';

interface OperaOptionsPanelProps {
  isOpen: boolean;
  currentTab: BrowserTab;
  activeProfile: UserProfile;
  isBookmarked: boolean;
  onClose: () => void;
  onShare: () => void;
  onToggleDesktopMode: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onTranslate: () => void;
  onFindInPage: () => void;
  onSaveAsPdf: () => void;
  onPrint: () => void;
  onToggleBookmark: () => void;
  onOpenHistory: () => void;
  onOpenDownloads: () => void;
  onOpenSettings: () => void;
  onInstallPwa?: () => void;
  isPwaInstallable?: boolean;
}

export const OperaOptionsPanel: React.FC<OperaOptionsPanelProps> = ({
  isOpen,
  currentTab,
  activeProfile,
  isBookmarked,
  onClose,
  onShare,
  onToggleDesktopMode,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onTranslate,
  onFindInPage,
  onSaveAsPdf,
  onPrint,
  onToggleBookmark,
  onOpenHistory,
  onOpenDownloads,
  onOpenSettings,
  onInstallPwa,
  isPwaInstallable,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs select-none animate-in fade-in duration-150">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white border border-slate-200 p-5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-250">
        
        {/* Grab Handle for Mobile */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-xs"
              style={{ backgroundColor: activeProfile.avatarColor || '#0066FF' }}
            >
              {activeProfile.initials || activeProfile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-900 leading-tight">
                Menu de Opções
              </span>
              <span className="block text-[11px] text-slate-500 truncate max-w-[200px]">
                {currentTab.title || currentTab.url}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nível de Zoom */}
        <div className="my-3 p-2.5 rounded-2xl bg-[#F8F9FA] border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 pl-2">
            <ZoomIn className="w-4 h-4 text-[#0066FF]" />
            <span className="text-xs font-bold text-slate-700">
              Nível de Zoom
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onZoomOut}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer shadow-2xs"
            >
              -
            </button>
            <button
              onClick={onResetZoom}
              className="min-w-[48px] py-1 px-2 rounded-lg bg-white border border-slate-200 text-center font-mono text-xs font-bold text-[#0066FF] cursor-pointer shadow-2xs"
              title="Redefinir para 100%"
            >
              {currentTab.zoomLevel}%
            </button>
            <button
              onClick={onZoomIn}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer shadow-2xs"
            >
              +
            </button>
          </div>
        </div>

        {/* Quick Grid: Versão para Computador & Favoritar */}
        <div className="grid grid-cols-2 gap-2.5 my-2">
          {/* Desktop Mode Toggle */}
          <button
            onClick={() => {
              onToggleDesktopMode();
            }}
            className={`p-3 rounded-2xl flex items-center gap-3 border transition-all cursor-pointer text-left ${
              currentTab.isDesktopMode
                ? 'bg-[#EDF4FF] border-[#0066FF] text-[#0066FF]'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {currentTab.isDesktopMode ? (
              <Monitor className="w-5 h-5 text-[#0066FF]" />
            ) : (
              <Smartphone className="w-5 h-5 text-slate-500" />
            )}
            <div>
              <span className="block text-xs font-bold leading-tight">
                {currentTab.isDesktopMode ? 'Computador' : 'Mobile'}
              </span>
              <span className="block text-[10px] text-slate-500">
                {currentTab.isDesktopMode ? 'Modo desktop ativo' : 'Alternar visualização'}
              </span>
            </div>
          </button>

          {/* Favoritar */}
          <button
            onClick={() => {
              onToggleBookmark();
            }}
            className={`p-3 rounded-2xl flex items-center gap-3 border transition-all cursor-pointer text-left ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-amber-500" />
            ) : (
              <Bookmark className="w-5 h-5 text-slate-500" />
            )}
            <div>
              <span className="block text-xs font-bold leading-tight">
                {isBookmarked ? 'Salvo' : 'Favoritar'}
              </span>
              <span className="block text-[10px] text-slate-500">
                {isBookmarked ? 'Nos favoritos' : 'Salvar página'}
              </span>
            </div>
          </button>
        </div>

        {/* Detailed Options List */}
        <div className="bg-[#F8F9FA] rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden my-3">
          
          {/* Compartilhar */}
          <button
            onClick={() => {
              onClose();
              onShare();
            }}
            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Compartilhar</span>
              <span className="text-[10px] text-slate-500">Copiar link, QR code ou enviar</span>
            </div>
          </button>

          {/* Traduzir */}
          <button
            onClick={() => {
              onClose();
              onTranslate();
            }}
            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white transition-colors cursor-pointer"
          >
            <Languages className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Traduzir página</span>
              <span className="text-[10px] text-slate-500">Traduzir para Português</span>
            </div>
          </button>

          {/* Localizar na Página */}
          <button
            onClick={() => {
              onClose();
              onFindInPage();
            }}
            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 text-purple-600" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Localizar na página</span>
              <span className="text-[10px] text-slate-500">Buscar palavras ou termos</span>
            </div>
          </button>

          {/* Salvar como PDF */}
          <button
            onClick={() => {
              onClose();
              onSaveAsPdf();
            }}
            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-rose-600" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Salvar como PDF</span>
              <span className="text-[10px] text-slate-500">Exportar documento</span>
            </div>
          </button>

          {/* Imprimir */}
          <button
            onClick={() => {
              onClose();
              onPrint();
            }}
            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Imprimir</span>
              <span className="text-[10px] text-slate-500">Imprimir esta página</span>
            </div>
          </button>

          {/* Histórico */}
          <button
            onClick={() => {
              onClose();
              onOpenHistory();
            }}
            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white transition-colors cursor-pointer"
          >
            <History className="w-4 h-4 text-indigo-600" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Histórico</span>
              <span className="text-[10px] text-slate-500">Páginas navegadas recentemente</span>
            </div>
          </button>

          {/* Downloads */}
          <button
            onClick={() => {
              onClose();
              onOpenDownloads();
            }}
            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-600" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Transferências</span>
              <span className="text-[10px] text-slate-500">Arquivos e documentos baixados</span>
            </div>
          </button>

          {/* Configurações */}
          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-700" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Configurações do Navegador</span>
              <span className="text-[10px] text-slate-500">Mecanismos de busca, perfis e dados</span>
            </div>
          </button>
        </div>

        {/* PWA Install Button inside menu if available */}
        {onInstallPwa && (
          <button
            onClick={() => {
              onClose();
              onInstallPwa();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#00C2FF] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>Instalar Aplicativo (Adicionar à Tela Inicial)</span>
          </button>
        )}
      </div>
    </div>
  );
};
