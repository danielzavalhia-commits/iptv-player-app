import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type VideoQuality = 'auto' | '1080p' | '720p' | '480p';

interface QualityContextType {
  quality: VideoQuality;
  setQuality: (quality: VideoQuality) => Promise<void>;
  isLoading: boolean;
}

const QualityContext = createContext<QualityContextType | undefined>(undefined);

const QUALITY_KEY = 'iptv_player_quality_preference';

export function QualityProvider({ children }: { children: ReactNode }) {
  const [quality, setQualityState] = useState<VideoQuality>('auto');
  const [isLoading, setIsLoading] = useState(true);

  // Carregar preferência salva
  useEffect(() => {
    const loadQuality = async () => {
      try {
        const saved = await AsyncStorage.getItem(QUALITY_KEY);
        if (saved && ['auto', '1080p', '720p', '480p'].includes(saved)) {
          setQualityState(saved as VideoQuality);
        }
      } catch (error) {
        console.error('Erro ao carregar preferência de qualidade:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuality();
  }, []);

  const setQuality = async (newQuality: VideoQuality) => {
    try {
      setQualityState(newQuality);
      await AsyncStorage.setItem(QUALITY_KEY, newQuality);
    } catch (error) {
      console.error('Erro ao salvar preferência de qualidade:', error);
    }
  };

  return (
    <QualityContext.Provider value={{ quality, setQuality, isLoading }}>
      {children}
    </QualityContext.Provider>
  );
}

export function useQuality() {
  const context = useContext(QualityContext);
  if (!context) {
    throw new Error('useQuality deve ser usado dentro de QualityProvider');
  }
  return context;
}

/**
 * Mapear qualidade selecionada para URL com sufixo apropriado
 * Exemplo: 'http://example.com/stream.m3u8' -> 'http://example.com/stream_720p.m3u8'
 */
export function getQualityUrl(baseUrl: string, quality: VideoQuality): string {
  if (quality === 'auto') {
    return baseUrl;
  }

  // Remover sufixo de qualidade existente se houver
  const cleanUrl = baseUrl.replace(/_?(auto|1080p|720p|480p)(\.\w+)?$/i, '$2');

  // Encontrar a extensão do arquivo
  const lastDot = cleanUrl.lastIndexOf('.');
  if (lastDot === -1) {
    return `${cleanUrl}_${quality}`;
  }

  const extension = cleanUrl.substring(lastDot);
  const urlWithoutExtension = cleanUrl.substring(0, lastDot);

  return `${urlWithoutExtension}_${quality}${extension}`;
}
