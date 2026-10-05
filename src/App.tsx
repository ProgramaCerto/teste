import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  UserProfile, 
  ShortcutItem, 
  BrowserTab, 
  WallpaperOption, 
  SearchEngineType, 
  BookmarkItem, 
  HistoryItem, 
  DownloadItem, 
  OfflinePageItem 
} from './types';
import { BrowserTopBar } from './components/BrowserTopBar';
import { BrowserTabsHeader } from './components/BrowserTabsHeader';
import { HomeNewTab } from './components/HomeNewTab';
import { WebPageViewer } from './components/WebPageViewer';
import { SideProfileSettingsDrawer } from './components/SideProfileSettingsDrawer';
import { OperaOptionsPanel } from './components/OperaOptionsPanel';
import { TabManager } from './components/TabManager';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { QrScannerModal } from './components/QrScannerModal';
import { SnapshotModal } from './components/SnapshotModal';
import { ShareModal } from './components/ShareModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';

const DEFAULT_WALLPAPERS: WallpaperOption[] = [
  { id: 'wp-1', name: 'Minimal White', type: 'minimal', value: '#FFFFFF' },
  { id: 'wp-2', name: 'Soft Ice', type: 'gradient', value: 'linear-gradient(135deg, #F0F4F8 0%, #E2E8F0 100%)' },
  { id: 'wp-3', name: 'Clean Blue', type: 'gradient', value: 'linear-gradient(135deg, #EDF4FF 0%, #D0E2FF 100%)' },
  { id: 'wp-4', name: 'Dark Slate', type: 'minimal', value: '#0F172A' },
];

const INITIAL_SHORTCUTS: ShortcutItem[] = [
  { id: 'sc-1', title: 'Google', url: 'https://www.google.com', iconName: 'google', bgColor: '#FFFFFF' },
  { id: 'sc-2', title: 'YouTube', url: 'https://www.youtube.com', iconName: 'youtube', bgColor: '#FFFFFF' },
  { id: 'sc-3', title: 'Wikipédia', url: 'https://pt.wikipedia.org', iconName: 'wikipedia', bgColor: '#FFFFFF' },
  { id: 'sc-4', title: 'G1 Notícias', url: 'https://g1.globo.com', iconName: 'newspaper', bgColor: '#FFFFFF' },
  { id: 'sc-5', title: 'Gov.br', url: 'https://www.gov.br', iconName: 'globe', bgColor: '#FFFFFF' },
  { id: 'sc-6', title: 'Mercado Livre', url: 'https://www.mercadolivre.com.br', iconName: 'shopping-cart', bgColor: '#FFFFFF' },
];

const GUEST_PROFILE: UserProfile = {
  id: 'guest',
  name: 'Visitante',
  avatarColor: '#64748B',
  initials: 'V',
  isGuest: true,
  createdAt: Date.now(),
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-default',
  name: 'Meu Perfil',
  avatarColor: '#0066FF',
  initials: 'MP',
  isGuest: false,
  createdAt: Date.now(),
};

export default function App() {
  // Profiles state
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('certoflow_profiles');
      return saved ? JSON.parse(saved) : [DEFAULT_PROFILE, GUEST_PROFILE];
    } catch {
      return [DEFAULT_PROFILE, GUEST_PROFILE];
    }
  });

  const [activeProfile, setActiveProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('certoflow_active_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Search Engine setting (Google, Bing, Yahoo, DuckDuckGo)
  const [searchEngine, setSearchEngine] = useState<SearchEngineType>(() => {
    try {
      return (localStorage.getItem('certoflow_searchengine') as SearchEngineType) || 'google';
    } catch {
      return 'google';
    }
  });

  // Shortcuts / Speed Dial
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(() => {
    try {
      const saved = localStorage.getItem('certoflow_shortcuts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_SHORTCUTS;
    } catch {
      return INITIAL_SHORTCUTS;
    }
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('certoflow_bookmarks');
      return saved ? JSON.parse(saved) : [
        { id: 'bm-1', title: 'Google Brasil', url: 'https://www.google.com', createdAt: Date.now() },
        { id: 'bm-2', title: 'YouTube', url: 'https://www.youtube.com', createdAt: Date.now() },
        { id: 'bm-3', title: 'Wikipédia', url: 'https://pt.wikipedia.org', createdAt: Date.now() },
      ];
    } catch {
      return [];
    }
  });

  // Downloads
  const [downloads] = useState<DownloadItem[]>([
    { id: 'dl-1', filename: 'certoflow-update.json', url: '/version.json', size: '1.2 KB', date: Date.now(), status: 'completed' },
  ]);

  // Offline Pages
  const [offlinePages] = useState<OfflinePageItem[]>([]);

  // Wallpaper
  const [currentWallpaper, setCurrentWallpaper] = useState<WallpaperOption>(DEFAULT_WALLPAPERS[0]);

  // Browsing History log
  const [browsingHistory, setBrowsingHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('certoflow_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Browser Tabs
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      title: 'Início',
      url: 'certoflow://newtab',
      history: ['certoflow://newtab'],
      historyIndex: 0,
      isLoading: false,
      zoomLevel: 100,
      isDesktopMode: false,
      currentLanguage: 'pt',
      trackersBlocked: 0,
      lastUpdated: Date.now(),
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // Modals & Drawers
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [isOperaPanelOpen, setIsOperaPanelOpen] = useState(false);
  const [isTabManagerOpen, setIsTabManagerOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [shareModalState, setShareModalState] = useState<{ isOpen: boolean; mode: 'share' | 'send' }>({
    isOpen: false,
    mode: 'share',
  });
  const [findInPageQuery, setFindInPageQuery] = useState<string | null>(null);
  const [isTranslated, setIsTranslated] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('certoflow_profiles', JSON.stringify(profiles));
    } catch {}
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem('certoflow_active_profile', JSON.stringify(activeProfile));
    } catch {}
  }, [activeProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('certoflow_searchengine', searchEngine);
    } catch {}
  }, [searchEngine]);

  useEffect(() => {
    try {
      localStorage.setItem('certoflow_shortcuts', JSON.stringify(shortcuts));
    } catch {}
  }, [shortcuts]);

  useEffect(() => {
    try {
      localStorage.setItem('certoflow_bookmarks', JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('certoflow_history', JSON.stringify(browsingHistory));
    } catch {}
  }, [browsingHistory]);

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const canGoBack = currentTab.historyIndex > 0;
  const canGoForward = currentTab.historyIndex < currentTab.history.length - 1;
  const isBookmarked = bookmarks.some((b) => b.url === currentTab.url);

  // Browser Navigation
  const handleNavigate = (input: string, customTitle?: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    let targetUrl = '';
    let searchQuery: string | undefined = undefined;
    let title = customTitle || '';

    const isUrl =
      /^(https?:\/\/)/i.test(trimmed) ||
      /^([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(trimmed) ||
      trimmed.startsWith('certoflow://');

    if (trimmed === 'certoflow://newtab' || trimmed === 'about:blank') {
      targetUrl = 'certoflow://newtab';
      title = 'Início';
    } else if (isUrl) {
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('certoflow://')) {
        targetUrl = trimmed;
      } else {
        targetUrl = `https://${trimmed}`;
      }
      if (!title) {
        try {
          const u = new URL(targetUrl);
          title = u.hostname.replace('www.', '');
        } catch {
          title = targetUrl;
        }
      }
    } else {
      // Direct Search query using selected search engine
      searchQuery = trimmed;
      if (searchEngine === 'bing') {
        targetUrl = `https://www.bing.com/search?q=${encodeURIComponent(trimmed)}`;
        title = `${trimmed} - Bing`;
      } else if (searchEngine === 'yahoo') {
        targetUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(trimmed)}`;
        title = `${trimmed} - Yahoo`;
      } else if (searchEngine === 'duckduckgo') {
        targetUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(trimmed)}`;
        title = `${trimmed} - DuckDuckGo`;
      } else {
        // Default: Google
        targetUrl = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}&hl=pt-BR&igu=1`;
        title = `${trimmed} - Pesquisa Google`;
      }
    }

    // Add to history if not internal newtab
    if (targetUrl !== 'certoflow://newtab') {
      setBrowsingHistory((prev) => [
        { id: `hist-${Date.now()}`, title: title || targetUrl, url: targetUrl, time: Date.now() },
        ...prev.slice(0, 99),
      ]);
    }

    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTabId) {
          const nextHistory = [...t.history.slice(0, t.historyIndex + 1), targetUrl];
          return {
            ...t,
            url: targetUrl,
            title,
            searchQuery,
            history: nextHistory,
            historyIndex: nextHistory.length - 1,
            isLoading: true,
            lastUpdated: Date.now(),
          };
        }
        return t;
      })
    );

    setTimeout(() => {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: false } : t))
      );
    }, 250);

    setFindInPageQuery(null);
    setIsTranslated(false);
  };

  const handleGoBack = () => {
    if (!canGoBack) return;
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTabId && t.historyIndex > 0) {
          const newIndex = t.historyIndex - 1;
          const prevUrl = t.history[newIndex];
          return {
            ...t,
            url: prevUrl,
            historyIndex: newIndex,
            searchQuery: prevUrl.includes('search?q=') ? decodeURIComponent(prevUrl.split('q=')[1]?.split('&')[0] || '') : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleGoForward = () => {
    if (!canGoForward) return;
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTabId && t.historyIndex < t.history.length - 1) {
          const newIndex = t.historyIndex + 1;
          const nextUrl = t.history[newIndex];
          return {
            ...t,
            url: nextUrl,
            historyIndex: newIndex,
            searchQuery: nextUrl.includes('search?q=') ? decodeURIComponent(nextUrl.split('q=')[1]?.split('&')[0] || '') : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleReload = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: true } : t))
    );
    setTimeout(() => {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: false } : t))
      );
    }, 300);
  };

  const handleGoHome = () => {
    handleNavigate('certoflow://newtab', 'Início');
  };

  const handleNewTab = () => {
    const newTabId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newTabId,
      title: 'Início',
      url: 'certoflow://newtab',
      history: ['certoflow://newtab'],
      historyIndex: 0,
      isLoading: false,
      zoomLevel: 100,
      isDesktopMode: false,
      currentLanguage: 'pt',
      trackersBlocked: 0,
      lastUpdated: Date.now(),
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTabId);
  };

  const handleCloseTab = (idToClose: string) => {
    if (tabs.length === 1) {
      setTabs([
        {
          id: `tab-${Date.now()}`,
          title: 'Início',
          url: 'certoflow://newtab',
          history: ['certoflow://newtab'],
          historyIndex: 0,
          isLoading: false,
          zoomLevel: 100,
          isDesktopMode: false,
          currentLanguage: 'pt',
          trackersBlocked: 0,
          lastUpdated: Date.now(),
        },
      ]);
      return;
    }

    const filtered = tabs.filter((t) => t.id !== idToClose);
    setTabs(filtered);

    if (activeTabId === idToClose) {
      setActiveTabId(filtered[filtered.length - 1].id);
    }
  };

  const handleCloseAllTabs = () => {
    const newId = `tab-${Date.now()}`;
    setTabs([
      {
        id: newId,
        title: 'Início',
        url: 'certoflow://newtab',
        history: ['certoflow://newtab'],
        historyIndex: 0,
        isLoading: false,
        zoomLevel: 100,
        isDesktopMode: false,
        currentLanguage: 'pt',
        trackersBlocked: 0,
        lastUpdated: Date.now(),
      },
    ]);
    setActiveTabId(newId);
    setIsTabManagerOpen(false);
  };

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      setBookmarks((prev) => prev.filter((b) => b.url !== currentTab.url));
    } else {
      setBookmarks((prev) => [
        {
          id: `bm-${Date.now()}`,
          title: currentTab.title || currentTab.url,
          url: currentTab.url,
          createdAt: Date.now(),
        },
        ...prev,
      ]);
    }
  };

  // Shortcuts handlers
  const handleAddShortcut = (shortcut: Omit<ShortcutItem, 'id'>) => {
    setShortcuts((prev) => [
      ...prev,
      { ...shortcut, id: `sc-${Date.now()}` },
    ]);
  };

  const handleUpdateShortcut = (id: string, updated: Partial<ShortcutItem>) => {
    setShortcuts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const handleDeleteShortcut = (id: string) => {
    setShortcuts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleReorderShortcuts = (newShortcuts: ShortcutItem[]) => {
    setShortcuts(newShortcuts);
  };

  // Profile management
  const handleAddProfile = (name: string, color: string) => {
    const newP: UserProfile = {
      id: `prof-${Date.now()}`,
      name,
      avatarColor: color,
      initials: name.substring(0, 2).toUpperCase(),
      isGuest: false,
      createdAt: Date.now(),
    };
    setProfiles((prev) => [...prev, newP]);
    setActiveProfile(newP);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, zoomLevel: Math.min(150, t.zoomLevel + 10) } : t))
    );
  };

  const handleZoomOut = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, zoomLevel: Math.max(75, t.zoomLevel - 10) } : t))
    );
  };

  const handleResetZoom = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, zoomLevel: 100 } : t))
    );
  };

  const handleToggleDesktopMode = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, isDesktopMode: !t.isDesktopMode } : t))
    );
  };

  const isHomeTab = currentTab.url === 'about:blank' || currentTab.url === 'certoflow://newtab';

  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col bg-[#F8F9FA] text-[#1F1F1F] font-sans antialiased overflow-hidden select-none">
      
      {/* 1. Header de Guias (Tabs) */}
      <BrowserTabsHeader
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={handleCloseTab}
        onNewTab={handleNewTab}
        onOpenTabManager={() => setIsTabManagerOpen(true)}
      />

      {/* 2. Barra Superior de Navegação (Omnibox, Botão Perfil Lateral, Menu Três Pontinhos) */}
      <BrowserTopBar
        currentTab={currentTab}
        tabCount={tabs.length}
        activeProfile={activeProfile}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isBookmarked={isBookmarked}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onGoHome={handleGoHome}
        onReload={handleReload}
        onNavigate={handleNavigate}
        onToggleBookmark={handleToggleBookmark}
        onOpenVoiceSearch={() => setIsVoiceModalOpen(true)}
        onOpenSideDrawer={() => setIsSideDrawerOpen(true)}
        onOpenOptionsPanel={() => setIsOperaPanelOpen(true)}
      />

      {/* 3. Área Principal do Navegador (Página Inicial ou Visualizador Web Real) */}
      <main className="relative flex-1 w-full h-full overflow-hidden bg-white">
        {isHomeTab ? (
          <HomeNewTab
            shortcuts={shortcuts}
            bookmarks={bookmarks}
            currentWallpaper={currentWallpaper}
            wallpapers={DEFAULT_WALLPAPERS}
            activeProfile={activeProfile}
            onNavigate={handleNavigate}
            onAddShortcut={handleAddShortcut}
            onUpdateShortcut={handleUpdateShortcut}
            onDeleteShortcut={handleDeleteShortcut}
            onReorderShortcuts={handleReorderShortcuts}
            onSelectWallpaper={setCurrentWallpaper}
            onOpenVoiceSearch={() => setIsVoiceModalOpen(true)}
            onOpenQrScanner={() => setIsQrModalOpen(true)}
          />
        ) : (
          <WebPageViewer
            tab={currentTab}
            findInPageQuery={findInPageQuery}
            onCloseFindInPage={() => setFindInPageQuery(null)}
            isTranslated={isTranslated}
            onToggleTranslate={() => setIsTranslated(!isTranslated)}
            onNavigate={handleNavigate}
            onReload={handleReload}
            onOpenVoiceSearch={() => setIsVoiceModalOpen(true)}
          />
        )}
      </main>

      {/* 4. Painel Lateral de Perfis e Configurações (Abre no Canto como solicitado pelo usuário) */}
      <SideProfileSettingsDrawer
        isOpen={isSideDrawerOpen}
        onClose={() => setIsSideDrawerOpen(false)}
        activeProfile={activeProfile}
        profiles={profiles}
        onSelectProfile={setActiveProfile}
        onAddProfile={handleAddProfile}
        currentSearchEngine={searchEngine}
        onSelectSearchEngine={setSearchEngine}
        history={browsingHistory}
        onClearHistory={() => setBrowsingHistory([])}
        onRemoveHistoryItem={(id) => setBrowsingHistory((prev) => prev.filter((h) => h.id !== id))}
        bookmarks={bookmarks}
        onRemoveBookmark={(id) => setBookmarks((prev) => prev.filter((b) => b.id !== id))}
        downloads={downloads}
        offlinePages={offlinePages}
        wallpapers={DEFAULT_WALLPAPERS}
        currentWallpaper={currentWallpaper}
        onSelectWallpaper={setCurrentWallpaper}
        onNavigate={(url, title) => {
          setIsSideDrawerOpen(false);
          handleNavigate(url, title);
        }}
      />

      {/* 5. Menu dos Três Pontinhos (•••) */}
      <OperaOptionsPanel
        isOpen={isOperaPanelOpen}
        currentTab={currentTab}
        activeProfile={activeProfile}
        isBookmarked={isBookmarked}
        onClose={() => setIsOperaPanelOpen(false)}
        onShare={() => setShareModalState({ isOpen: true, mode: 'share' })}
        onToggleDesktopMode={handleToggleDesktopMode}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onTranslate={() => setIsTranslated(true)}
        onFindInPage={() => {
          const q = prompt('Localizar na página:');
          if (q && q.trim()) setFindInPageQuery(q.trim());
        }}
        onSaveAsPdf={() => window.print()}
        onPrint={() => window.print()}
        onToggleBookmark={handleToggleBookmark}
        onOpenHistory={() => setIsSideDrawerOpen(true)}
        onOpenDownloads={() => setIsSideDrawerOpen(true)}
        onOpenSettings={() => setIsSideDrawerOpen(true)}
      />

      {/* 6. Gerenciador de Abas */}
      <AnimatePresence>
        {isTabManagerOpen && (
          <TabManager
            tabs={tabs}
            activeTabId={activeTabId}
            onSelectTab={(id) => {
              setActiveTabId(id);
              setIsTabManagerOpen(false);
            }}
            onCloseTab={handleCloseTab}
            onNewTab={handleNewTab}
            onCloseAllTabs={handleCloseAllTabs}
            onCloseManager={() => setIsTabManagerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 7. Modal de Pesquisa por Voz (Google Style) */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearch={handleNavigate}
      />

      {/* 8. Modal de Leitor QR Code (Câmera ao vivo) */}
      <QrScannerModal
        isOpen={isQrModalOpen}
        currentUrl={currentTab.url}
        onClose={() => setIsQrModalOpen(false)}
        onScanResult={handleNavigate}
      />

      {/* 9. Modal de Captura Instantânea */}
      <SnapshotModal
        isOpen={isSnapshotModalOpen}
        tab={currentTab}
        onClose={() => setIsSnapshotModalOpen(false)}
      />

      {/* 10. Modal de Compartilhamento */}
      <ShareModal
        isOpen={shareModalState.isOpen}
        mode={shareModalState.mode}
        url={currentTab.url}
        title={currentTab.title}
        onClose={() => setShareModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* 11. Banner de Instalação PWA (Adicionar à Tela Inicial) */}
      <PWAInstallBanner />
    </div>
  );
}
