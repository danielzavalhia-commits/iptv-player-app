import { Channel, Movie, Series, LiveChannel, ContentType } from '@/types';

interface M3UEntry {
  name: string;
  url: string;
  logo?: string;
  groupTitle?: string;
  tvgId?: string;
}

/**
 * Parse de playlist M3U
 * Suporta formato M3U e M3U8 com tags EXTINF
 */
export async function parseM3U(url: string): Promise<Channel[]> {
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    return parseM3UContent(text);
  } catch (error) {
    console.error('Erro ao fazer download da playlist:', error);
    throw new Error('Não foi possível baixar a playlist');
  }
}

export function parseM3UContent(content: string): Channel[] {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  const entries: M3UEntry[] = [];
  
  let currentEntry: Partial<M3UEntry> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Pular header #EXTM3U
    if (line.startsWith('#EXTM3U')) {
      continue;
    }
    
    // Parse da linha EXTINF
    if (line.startsWith('#EXTINF:')) {
      // Extrair informações da tag EXTINF
      // Formato: #EXTINF:-1 tvg-id="..." tvg-name="..." tvg-logo="..." group-title="...",Nome do Canal
      
      const infoMatch = line.match(/#EXTINF:(-?\d+)\s*(.*?),(.+)$/);
      if (infoMatch) {
        const attributes = infoMatch[2];
        const name = infoMatch[3].trim();
        
        currentEntry = { name };
        
        // Extrair atributos
        const logoMatch = attributes.match(/tvg-logo="([^"]+)"/);
        if (logoMatch) {
          currentEntry.logo = logoMatch[1];
        }
        
        const groupMatch = attributes.match(/group-title="([^"]+)"/);
        if (groupMatch) {
          currentEntry.groupTitle = groupMatch[1];
        }
        
        const tvgIdMatch = attributes.match(/tvg-id="([^"]+)"/);
        if (tvgIdMatch) {
          currentEntry.tvgId = tvgIdMatch[1];
        }
      }
    } 
    // URL do stream (linha após EXTINF)
    else if (!line.startsWith('#') && currentEntry.name) {
      currentEntry.url = line;
      entries.push(currentEntry as M3UEntry);
      currentEntry = {};
    }
  }
  
  // Converter entries para Channel objects com categorização
  return entries.map((entry, index) => {
    const type = categorizeContent(entry);
    const id = `channel_${index}`;
    
    const baseChannel: Channel = {
      id,
      name: entry.name,
      url: entry.url,
      logo: entry.logo,
      category: entry.groupTitle || 'Sem Categoria',
      groupTitle: entry.groupTitle,
      type,
    };
    
    if (type === 'movie') {
      return {
        ...baseChannel,
        type: 'movie',
      } as Movie;
    } else if (type === 'series') {
      return {
        ...baseChannel,
        type: 'series',
        seasons: [],
      } as Series;
    } else {
      return {
        ...baseChannel,
        type: 'live',
        epgId: entry.tvgId,
      } as LiveChannel;
    }
  });
}

/**
 * Categoriza o conteúdo baseado no nome e grupo
 */
function categorizeContent(entry: M3UEntry): ContentType {
  const name = entry.name.toLowerCase();
  const group = (entry.groupTitle || '').toLowerCase();
  
  // Palavras-chave para filmes
  const movieKeywords = ['filme', 'movie', 'cinema', 'film', 'vod'];
  
  // Palavras-chave para séries
  const seriesKeywords = ['série', 'series', 'season', 'temporada', 'episódio', 'episode', 's0', 's1', 's2'];
  
  // Verificar grupo primeiro
  if (movieKeywords.some(keyword => group.includes(keyword))) {
    return 'movie';
  }
  
  if (seriesKeywords.some(keyword => group.includes(keyword))) {
    return 'series';
  }
  
  // Verificar nome
  if (movieKeywords.some(keyword => name.includes(keyword))) {
    return 'movie';
  }
  
  if (seriesKeywords.some(keyword => name.includes(keyword))) {
    return 'series';
  }
  
  // Padrão: canal ao vivo
  return 'live';
}

/**
 * Agrupa canais por categoria
 */
export function groupByCategory(channels: Channel[]): Map<string, Channel[]> {
  const grouped = new Map<string, Channel[]>();
  
  channels.forEach(channel => {
    const category = channel.category || 'Sem Categoria';
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(channel);
  });
  
  return grouped;
}

/**
 * Filtra canais por tipo
 */
export function filterByType(channels: Channel[], type: ContentType): Channel[] {
  return channels.filter(channel => channel.type === type);
}

/**
 * Busca canais por nome
 */
export function searchChannels(channels: Channel[], query: string): Channel[] {
  const lowerQuery = query.toLowerCase();
  return channels.filter(channel => 
    channel.name.toLowerCase().includes(lowerQuery) ||
    (channel.category || '').toLowerCase().includes(lowerQuery)
  );
}
