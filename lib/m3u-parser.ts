import { Channel, ContentType } from '@/types';

export async function parseM3U(url: string): Promise<Channel[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro na rede: ${response.status}`);
    const text = await response.text();
    
    if (!text || text.length < 10) {
      throw new Error('O servidor retornou uma lista vazia.');
    }

    return parseM3UContent(text, url);
  } catch (error) {
    console.error('Erro ao processar M3U:', error);
    // Fallback: Se for um link direto de vídeo, cria um canal único
    if (url.includes('.m3u8') || url.includes('.ts') || url.includes('.mp4')) {
      return [{
        id: 'direct_link',
        name: 'Canal Direto / HLS',
        url: url,
        category: 'Manual',
        type: 'live'
      }];
    }
    return [];
  }
}

export function parseM3UContent(content: string, url?: string): Channel[] {
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l);
  const entries: Channel[] = [];
  
  // Se não tem a tag #EXTM3U, mas temos uma URL, tratamos como link direto
  if (!content.includes('#EXTINF') && url) {
    return [{ id: 'direct', name: 'Link Direto', url, category: 'Manual', type: 'live' }];
  }

  let currentInfo: any = null;

  for (const line of lines) {
    if (line.startsWith('#EXTINF:')) {
      // Extrai nome, logo e grupo usando Regex para maior precisão
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      
      currentInfo = {
        name: nameMatch ? nameMatch[1].trim() : 'Canal sem nome',
        logo: logoMatch ? logoMatch[1] : undefined,
        category: groupMatch ? groupMatch[1] : 'Geral'
      };
    } else if (line.startsWith('http') && currentInfo) {
      const title = currentInfo.name.toLowerCase();
      let type: ContentType = 'live';
      
      // Inteligência para separar Filmes e Séries automaticamente
      if (title.includes('filme') || title.includes('movie') || currentInfo.category.toLowerCase().includes('vod')) {
        type = 'movie';
      } else if (title.includes('série') || title.includes('s0') || title.includes('e0')) {
        type = 'series';
      }

      entries.push({
        id: `ch_${entries.length}`,
        name: currentInfo.name,
        url: line,
        logo: currentInfo.logo,
        category: currentInfo.category,
        type: type
      });
      currentInfo = null;
    }
  }
  return entries;
}

export function searchChannels(channels: Channel[], query: string): Channel[] {
  const q = query.toLowerCase();
  return channels.filter(ch => ch.name.toLowerCase().includes(q));
}
