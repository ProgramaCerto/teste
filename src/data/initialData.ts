import { UserProfile, ShortcutItem, WallpaperOption } from '../types';
import wallpaperAurora from '../assets/images/wallpaper_aurora_1791054576362.jpg';
import wallpaperObsidian from '../assets/images/wallpaper_obsidian_1791054586266.jpg';
import wallpaperSunset from '../assets/images/wallpaper_sunset_1791054595909.jpg';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'profile-primary',
    name: 'Alexandre Ramos',
    avatarColor: 'from-cyan-500 to-blue-600',
    initials: 'AR',
    isGuest: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: 'profile-work',
    name: 'Trabalho & Projetos',
    avatarColor: 'from-emerald-500 to-teal-700',
    initials: 'TP',
    isGuest: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
];

export const GUEST_PROFILE: UserProfile = {
  id: 'guest',
  name: 'Modo Visitante',
  avatarColor: '#0066FF',
  initials: 'V',
  isGuest: true,
  createdAt: Date.now(),
};

export const DEFAULT_WALLPAPERS: WallpaperOption[] = [
  { id: 'pure-white', name: 'Branco Puro', type: 'minimal', value: '#FFFFFF' },
  { id: 'soft-gray', name: 'Cinza Suave', type: 'minimal', value: '#F8F9FA' },
  { id: 'blue-flow', name: 'Azul Opera', type: 'minimal', value: '#F0F6FF' },
  { id: 'warm-clean', name: 'Warm Clean', type: 'minimal', value: '#FAF9F6' },
];

export const INITIAL_SHORTCUTS: ShortcutItem[] = [
  {
    id: 'sc-google',
    title: 'Google',
    url: 'https://www.google.com',
    iconName: 'google',
    bgColor: '#ffffff',
  },
  {
    id: 'sc-youtube',
    title: 'YouTube',
    url: 'https://www.youtube.com',
    iconName: 'youtube',
    bgColor: '#FF0000',
  },
  {
    id: 'sc-wiki',
    title: 'Wikipédia',
    url: 'https://pt.wikipedia.org',
    iconName: 'wikipedia',
    bgColor: '#ffffff',
  },
  {
    id: 'sc-news',
    title: 'CertoNews',
    url: 'https://certoflow.app/news',
    iconName: 'newspaper',
    bgColor: '#0ea5e9',
  },
  {
    id: 'sc-github',
    title: 'GitHub',
    url: 'https://github.com',
    iconName: 'github',
    bgColor: '#24292e',
  },
  {
    id: 'sc-reddit',
    title: 'Reddit',
    url: 'https://www.reddit.com',
    iconName: 'reddit',
    bgColor: '#FF4500',
  },
  {
    id: 'sc-tech',
    title: 'TechPulse',
    url: 'https://certoflow.app/tech',
    iconName: 'cpu',
    bgColor: '#8b5cf6',
  },
  {
    id: 'sc-translate',
    title: 'Tradutor',
    url: 'https://translate.google.com',
    iconName: 'languages',
    bgColor: '#4285F4',
  },
];

export const WALLPAPER_OPTIONS: WallpaperOption[] = [
  {
    id: 'wp-aurora',
    name: 'Aurora Ciano',
    type: 'image',
    value: wallpaperAurora,
  },
  {
    id: 'wp-obsidian',
    name: 'Obsidian Minimal',
    type: 'image',
    value: wallpaperObsidian,
  },
  {
    id: 'wp-sunset',
    name: 'Cyber Sunset',
    type: 'image',
    value: wallpaperSunset,
  },
  {
    id: 'wp-dark-onyx',
    name: 'Onyx Puro',
    type: 'minimal',
    value: '#07090e',
  },
  {
    id: 'wp-deep-indigo',
    name: 'Índigo Noturno',
    type: 'gradient',
    value: 'linear-gradient(145deg, #090e1a 0%, #171b30 50%, #0c0f1d 100%)',
  },
];
