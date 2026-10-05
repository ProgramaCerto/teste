export type SearchEngineType = 'google' | 'bing' | 'yahoo' | 'duckduckgo';

export interface SearchEngineOption {
  id: SearchEngineType;
  name: string;
  url: string; // Query placeholder with %s
  homeUrl: string;
  iconName: string;
  color: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarColor: string;
  initials: string;
  isGuest: boolean;
  avatarIcon?: string;
  createdAt: number;
}

export interface ShortcutItem {
  id: string;
  title: string;
  url: string;
  iconName: string;
  bgColor: string;
  category?: string;
}

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  createdAt: number;
  favicon?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  time: number;
}

export interface DownloadItem {
  id: string;
  filename: string;
  url: string;
  size: string;
  date: number;
  status: 'completed' | 'in_progress' | 'failed';
}

export interface OfflinePageItem {
  id: string;
  title: string;
  url: string;
  savedAt: number;
  size: string;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isIncognito?: boolean;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
  zoomLevel: number; // 75 - 150
  isDesktopMode: boolean;
  currentLanguage: 'pt' | 'en' | 'es';
  trackersBlocked: number;
  lastUpdated: number;
  searchQuery?: string;
}

export interface WallpaperOption {
  id: string;
  name: string;
  type: 'image' | 'gradient' | 'minimal';
  value: string; // url or css gradient
}

export type DeviceMode = 'mobile' | 'tablet' | 'fullscreen';
export type AppScreen = 'splash' | 'profile-select' | 'browser';
