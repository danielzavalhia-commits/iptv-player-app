import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Channel, LiveChannel, Movie, Series, IPTVConfig } from '@/types';

interface IPTVContextType {
  channels: Channel[];
  liveChannels: LiveChannel[];
  movies: Movie[];
  series: Series[];
  isLoading: boolean;
  isConfigured: boolean;
  loadPlaylist: (config?: IPTVConfig) => Promise<boolean>;
  logout: () => Promise<void>;
}

const IPTVContext = createContext<IPTVContextType | undefined>(undefined);

export function IPTVProvider({ children }: { children: React.ReactNode }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [liveChannels, setLiveChannels] = useState<LiveChannel[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const savedConfig = await AsyncStorage.getItem('@iptv_config');
      const savedChannels = await AsyncStorage.getItem('@iptv_channels');
      
      if (savedConfig && savedChannels) {
        const parsed = JSON.parse(savedChannels);
        setChannels(parsed);
        organizeContent(parsed);
        setIsConfigured(true);
      }
    } catch (e) {
      console.error('Erro ao iniciar IPTV:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const organizeContent = (allChannels: Channel[]) => {
    setLiveChannels(allChannels.filter(c => c.type === 'live') as any);
    setMovies(allChannels.filter(c => c.type === 'movie') as any);
    setSeries(allChannels.filter(c => c.type === 'series') as any);
  };

  const loadPlaylist = async (newConfig?: IPTVConfig): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { parseM3U } = await import('@/lib/m3u-parser');
      
      // Usa a config passada ou a salva
      const configToUse = newConfig || JSON.parse(await AsyncStorage.getItem('@iptv_config') || '{}');
      
      if (!configToUse.url) return false;

      let url = configToUse.url;
      if (configToUse.mode === 'server') {
        url = `${configToUse.url}/get.php?username=${configToUse.username}&password=${configToUse.password}&type=m3u_plus&output=ts`;
      }

      const parsed = await parseM3U(url);
      
      if (parsed.length > 0) {
        if (newConfig) await AsyncStorage.setItem('@iptv_config', JSON.stringify(newConfig));
        await AsyncStorage.setItem('@iptv_channels', JSON.stringify(parsed));
        
        setChannels(parsed);
        organizeContent(parsed);
        setIsConfigured(true);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setChannels([]);
    setLiveChannels([]);
    setMovies([]);
    setSeries([]);
    setIsConfigured(false);
  };

  return (
    <IPTVContext.Provider value={{ channels, liveChannels, movies, series, isLoading, isConfigured, loadPlaylist, logout }}>
      {children}
    </IPTVContext.Provider>
  );
}

export const useIPTV = () => {
  const context = useContext(IPTVContext);
  if (!context) throw new Error('useIPTV deve ser usado dentro de um IPTVProvider');
  return context;
};
