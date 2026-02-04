import { Channel, ContentType } from '@/types';

export async function parseM3U(url: string): Promise<Channel[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const text = await response.text();
    return parseM3UContent(text, url);
  } catch (error) {
    // Se falhar o download mas for um link direto de vídeo
    if (url.includes('.m3u8') || url.includes('.ts') || url.includes('.mp4')) {
      return [{ id: 'manual', name: 'Canal Direto', url, category: 'Manual', type: 'live' }];
    }
    return [];
  }
}

export function parseM3UContent(content: string, url?: string): Channel[] {
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l);
  const entries: Channel[] = [];
  
  if (!content.includes('#EXTINF') && url) {
    return [{ id: 'direct', name: 'Link Direto', url, category: 'Manual', type: 'live' }];
  }

  let currentInfo: any = null;
  for (const line of lines) {
    if (line.startsWith('#EXTINF:')) {
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      
      currentInfo = {
        name: nameMatch ? nameMatch[1].trim() : 'Canal',
        logo: logoMatch ? logoMatch[1] : undefined,
        category: groupMatch ? groupMatch[1] : 'Geral'
      };
    } else if (line.startsWith('http') && currentInfo) {
      const title = currentInfo.name.toLowerCase();
      let type: ContentType = 'live';
      if (title.includes('filme') || title.includes('movie')) type = 'movie';
      else if (title.includes('série') || title.includes('s0')) type = 'series';

      entries.push({
        id: `ch_${entries.length}`,
        name: currentInfo.name,
        url: line,
        logo: currentInfo.logo,
        category: currentInfo.category,
        type: type
      } as any);
      currentInfo = null;
    }
  }
  return entries;
}

export function searchChannels(channels: Channel[], query: string): Channel[] {
  return channels.filter(ch => ch.name.toLowerCase().includes(query.toLowerCase()));
}
