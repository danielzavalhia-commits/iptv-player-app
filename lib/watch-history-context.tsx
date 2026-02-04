import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WatchHistory, ContentType } from '@/types';

interface WatchHistoryContextType {
  history: WatchHistory[];
  getProgress: (contentId: string) => number;
  saveProgress: (
    contentId: string,
    contentType: ContentType,
    progress: number,
    duration: number,
    title: string,
    thumbnail?: string
  ) => Promise<void>;
  clearHistory: () => Promise<void>;
}

const WatchHistoryContext = createContext<WatchHistoryContextType | undefined>(undefined);

const HISTORY_KEY = '@iptv_player:watch_history';
const MAX_HISTORY_ITEMS = 50;

export function WatchHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<WatchHistory[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const saveHistoryToStorage = async (newHistory: WatchHistory[]) => {
    try {
      // Manter apenas os últimos MAX_HISTORY_ITEMS
      const trimmed = newHistory.slice(0, MAX_HISTORY_ITEMS);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
      setHistory(trimmed);
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  };

  const getProgress = (contentId: string): number => {
    const item = history.find(h => h.contentId === contentId);
    return item ? item.progress : 0;
  };

  const saveProgress = async (
    contentId: string,
    contentType: ContentType,
    progress: number,
    duration: number,
    title: string,
    thumbnail?: string
  ) => {
    // Remover entrada existente se houver
    const filtered = history.filter(h => h.contentId !== contentId);
    
    // Criar nova entrada
    const newEntry: WatchHistory = {
      id: `history_${Date.now()}`,
      contentId,
      contentType,
      progress,
      duration,
      lastWatchedAt: Date.now(),
      title,
      thumbnail,
    };

    // Adicionar no início da lista
    await saveHistoryToStorage([newEntry, ...filtered]);
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
      setHistory([]);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  };

  return (
    <WatchHistoryContext.Provider
      value={{
        history,
        getProgress,
        saveProgress,
        clearHistory,
      }}
    >
      {children}
    </WatchHistoryContext.Provider>
  );
}

export function useWatchHistory() {
  const context = useContext(WatchHistoryContext);
  if (context === undefined) {
    throw new Error('useWatchHistory deve ser usado dentro de um WatchHistoryProvider');
  }
  return context;
}
