import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Languages, 
  X,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { BrowserTab } from '../types';

interface WebPageViewerProps {
  tab: BrowserTab;
  findInPageQuery: string | null;
  onCloseFindInPage: () => void;
  isTranslated: boolean;
  onToggleTranslate: () => void;
  onNavigate: (url: string, title?: string) => void;
  onReload: () => void;
  onOpenVoiceSearch: () => void;
}

export const WebPageViewer: React.FC<WebPageViewerProps> = ({
  tab,
  findInPageQuery,
  onCloseFindInPage,
  isTranslated,
  onToggleTranslate,
  onNavigate,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Directly run official Google with official iframe compatibility parameter (igu=1)
  // or proxy external websites to strip X-Frame-Options
  const getIframeSource = (targetUrl: string): string => {
    const clean = targetUrl.trim();
    if (!clean || clean === 'about:blank' || clean === 'certoflow://newtab') {
      return 'about:blank';
    }

    // Google Oficial
    if (clean.includes('google.com')) {
      if (clean.includes('/search')) {
        return clean.includes('igu=1') 
          ? clean 
          : `${clean}${clean.includes('?') ? '&' : '?'}igu=1`;
      }
      return 'https://www.google.com/webhp?igu=1';
    }

    // Direct search query if not a URL
    if (tab.searchQuery && !clean.startsWith('http')) {
      return `https://www.google.com/search?q=${encodeURIComponent(tab.searchQuery)}&hl=pt-BR&igu=1`;
    }

    // Outros sites da web via proxy para remoção de restrições de iframe
    if (/^https?:\/\//i.test(clean)) {
      return `/api/proxy?url=${encodeURIComponent(clean)}`;
    }

    return `/api/proxy?url=${encodeURIComponent(`https://${clean}`)}`;
  };

  const iframeSrc = getIframeSource(tab.url);

  // Listen to navigation events from proxied sites
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      if (event.data.type === 'CERTOFLOW_NAVIGATE' && event.data.url) {
        onNavigate(event.data.url);
      } else if (event.data.type === 'CERTOFLOW_PAGE_LOADED') {
        setIframeLoading(false);
        if (event.data.title && event.data.title !== tab.title) {
          onNavigate(event.data.url || tab.url, event.data.title);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [tab.url, tab.title, onNavigate]);

  useEffect(() => {
    setIframeLoading(true);
  }, [iframeSrc]);

  return (
    <div className="relative flex-1 w-full h-full bg-white text-[#1F1F1F] flex flex-col overflow-hidden select-text">
      {/* Loading Progress Bar */}
      {iframeLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#EDF4FF] z-40 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#0066FF] to-[#00A3FF] animate-pulse w-full" />
        </div>
      )}

      {/* Floating Find in Page Bar */}
      {findInPageQuery !== null && (
        <div className="w-full px-4 py-2 bg-white border-b border-slate-200 shadow-xs flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#0066FF]" />
            <span className="text-xs text-slate-700">
              Localizando: <span className="font-mono font-bold text-[#0066FF]">"{findInPageQuery}"</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={onCloseFindInPage}
              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Translation Bar */}
      {isTranslated && (
        <div className="w-full px-4 py-2 bg-[#EDF4FF] border-b border-[#0066FF]/20 flex items-center justify-between text-xs text-slate-700 z-30 shrink-0">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-[#0066FF]" />
            <span>Página traduzida para Português</span>
          </div>
          <button 
            onClick={onToggleTranslate}
            className="text-xs font-semibold text-[#0066FF] hover:underline cursor-pointer"
          >
            Exibir Original
          </button>
        </div>
      )}

      {/* Embedded Live Web Viewport (Runs the real Google or the requested site) */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-white">
        <iframe
          ref={iframeRef}
          key={iframeSrc}
          src={iframeSrc}
          title={tab.title || 'Navegador Web'}
          onLoad={() => setIframeLoading(false)}
          className="w-full h-full border-0 bg-white"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; camera; microphone"
          style={{
            zoom: tab.zoomLevel ? `${tab.zoomLevel}%` : '100%',
          }}
        />
      </div>
    </div>
  );
};
