// Tipos de autenticação
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Tipos de configuração IPTV
export type IPTVConfigMode = 'server' | 'm3u';

export interface IPTVServerConfig {
  mode: 'server';
  url: string;
  username: string;
  password: string;
}

export interface IPTVM3UConfig {
  mode: 'm3u';
  url: string;
}

export type IPTVConfig = IPTVServerConfig | IPTVM3UConfig;

// Tipos de conteúdo
export type ContentType = 'movie' | 'series' | 'live';

export interface Channel {
  id: string;
  name: string;
  logo?: string;
  url: string;
  category: string;
  type: ContentType;
  groupTitle?: string;
}

export interface Movie extends Channel {
  type: 'movie';
  year?: string;
  duration?: string;
  description?: string;
  poster?: string;
  rating?: string;
  genre?: string;
}

export interface Series extends Channel {
  type: 'series';
  seasons?: Season[];
  poster?: string;
  description?: string;
  year?: string;
  genre?: string;
}

export interface Season {
  number: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  url: string;
  duration?: string;
  thumbnail?: string;
}

export interface LiveChannel extends Channel {
  type: 'live';
  epgId?: string;
  currentProgram?: string;
}

// Tipos de favoritos e histórico
export interface Favorite {
  id: string;
  contentId: string;
  contentType: ContentType;
  addedAt: number;
}

export interface WatchHistory {
  id: string;
  contentId: string;
  contentType: ContentType;
  progress: number; // em segundos
  duration: number; // em segundos
  lastWatchedAt: number;
  thumbnail?: string;
  title: string;
}

// Tipos de categoria
export interface Category {
  id: string;
  name: string;
  type: ContentType;
  count: number;
}
