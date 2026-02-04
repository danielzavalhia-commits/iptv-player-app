import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Favorite, ContentType } from '@/types';

interface FavoritesContextType {
  favorites: Favorite[];
  isFavorite: (contentId: string) => boolean;
  addFavorite: (contentId: string, contentType: ContentType) => Promise<void>;
  removeFavorite: (contentId: string) => Promise<void>;
  toggleFavorite: (contentId: string, contentType: ContentType) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_KEY = '@iptv_player:favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const saveFavorites = async (newFavorites: Favorite[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  const isFavorite = (contentId: string): boolean => {
    return favorites.some(fav => fav.contentId === contentId);
  };

  const addFavorite = async (contentId: string, contentType: ContentType) => {
    if (isFavorite(contentId)) {
      return;
    }

    const newFavorite: Favorite = {
      id: `fav_${Date.now()}`,
      contentId,
      contentType,
      addedAt: Date.now(),
    };

    await saveFavorites([...favorites, newFavorite]);
  };

  const removeFavorite = async (contentId: string) => {
    const filtered = favorites.filter(fav => fav.contentId !== contentId);
    await saveFavorites(filtered);
  };

  const toggleFavorite = async (contentId: string, contentType: ContentType) => {
    if (isFavorite(contentId)) {
      await removeFavorite(contentId);
    } else {
      await addFavorite(contentId, contentType);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
}
