import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPTVConfig, Channel, Movie, Series, LiveChannel, ContentType } from '@/types';

interface IPTVContextType {
  config: IPTVConfig | null;
  isConfigured: boolean;
  isLoading: boolean;
  channels: Channel[];
  movies: Movie[];
  series: Series[];
  liveChannels: LiveChannel[];
  saveConfig: (config: IPTVConfig) => Promise<void>;
  loadPlaylist: () => Promise<boolean>;
  clearConfig: () => Promise<void>;
}

const IPTVContext = createContext<IPTVContextType | undefined>(undefined);

const IPTV_CONFIG_KEY = '@iptv_player:config';
const IPTV_CHANNELS_KEY = '@iptv_player:channels';

export function IPTVProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<IPTVConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [liveChannels, setLiveChannels] = useState<LiveChannel[]>([]);

  useEffect(() => {
    loadStoredConfig();
  }, []);

  const loadStoredConfig = async () => {
    try {
      const [storedConfig, storedChannels] = await Promise.all([
        AsyncStorage.getItem(IPTV_CONFIG_KEY),
        AsyncStorage.getItem(IPTV_CHANNELS_KEY),
      ]);

      if (storedConfig) {
        setConfig(JSON.parse(storedConfig));
      }

      if (storedChannels) {
        const parsedChannels = JSON.parse(storedChannels) as Channel[];
        setChannels(parsedChannels);
        categorizeChannels(parsedChannels);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração IPTV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categorizeChannels = (allChannels: Channel[]) => {
    const moviesList: Movie[] = [];
    const seriesList: Series[] = [];
    const liveList: LiveChannel[] = [];

    allChannels.forEach((channel) => {
      if (channel.type === 'movie') {
        moviesList.push(channel as Movie);
      } else if (channel.type === 'series') {
        seriesList.push(channel as Series);
      } else if (channel.type === 'live') {
        liveList.push(channel as LiveChannel);
      }
    });

    setMovies(moviesList);
    setSeries(seriesList);
    setLiveChannels(liveList);
  };

  const saveConfig = async (newConfig: IPTVConfig) => {
    try {
      await AsyncStorage.setItem(IPTV_CONFIG_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);
    } catch (error) {
      console.error('Erro ao salvar configuração IPTV:', error);
      throw error;
    }
  };

  const loadPlaylist = async (): Promise<boolean> => {
    if (!config) {
      return false;
    }

    try {
      setIsLoading(true);
      
      // Importar o parser M3U
      const { parseM3U } = await import('@/lib/m3u-parser');
      
      let playlistUrl: string;
      
      if (config.mode === 'server') {
        // Construir URL da playlist a partir das credenciais do servidor
        playlistUrl = `${config.url}/get.php?username=${config.username}&password=${config.password}&type=m3u_plus&output=ts`;
      } else {
        playlistUrl = config.url;
      }

      // Fazer download e parse da playlist
      const parsedChannels = await parseM3U(playlistUrl);
      
      // Salvar canais
      await AsyncStorage.setItem(IPTV_CHANNELS_KEY, JSON.stringify(parsedChannels));
      setChannels(parsedChannels);
      categorizeChannels(parsedChannels);

      return true;
    } catch (error) {
      console.error('Erro ao carregar playlist:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearConfig = async () => {
    try {
      await AsyncStorage.multiRemove([IPTV_CONFIG_KEY, IPTV_CHANNELS_KEY]);
      setConfig(null);
      setChannels([]);
      setMovies([]);
      setSeries([]);
      setLiveChannels([]);
    } catch (error) {
      console.error('Erro ao limpar configuração:', error);
    }
  };

  return (
    <IPTVContext.Provider
      value={{
        config,
        isConfigured: !!config && channels.length > 0,
        isLoading,
        channels,
        movies,
        series,
        liveChannels,
        saveConfig,
        loadPlaylist,
        clearConfig,
      }}
    >
      {children}
    </IPTVContext.Provider>
  );
}

export function useIPTV() {
  const context = useContext(IPTVContext);
  if (context === undefined) {
    throw new Error('useIPTV deve ser usado dentro de um IPTVProvider');
  }
  return context;
}
