import { Channel, LiveChannel, ContentType } from '@/types';

// Esta função agora aceita a URL original para caso o link seja direto
export async function parseM3U(url: string): Promise<Channel[]> {
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // Tentamos ler como lista, mas se falhar, usamos a URL como canal direto
    return parseM3UContent(text, url);
  } catch (error) {
    // Se for um link direto que não permite leitura de texto, criamos o canal direto
    return [{
      id: 'manual_link',
      name: 'Canal Adicionado Manualmente',
      url: url,
      category: 'Links Diretos',
      type: 'live',
    }];
  }
}

export function parseM3UContent(content: string, url?: string): Channel[] {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  const entries: any[] = [];
  
  // REGRA PARA LEIGO: Se o link não tiver a marcação de lista (#EXTINF), 
  // tratamos como um link de vídeo direto
  if (!content.includes('#EXTINF') && url) {
    return [{
      id: 'direct_hls',
      name: 'Link Direto (HLS/MP4)',
      url: url,
      category: 'Manual',
      type: 'live',
    }];
  }

  let currentEntry: any = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('#EXTINF:')) {
      const nameMatch = line.match(/,(.+)$/);
      if (nameMatch) {
        currentEntry.name = nameMatch[1].trim();
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        if (logoMatch) currentEntry.logo = logoMatch[1];
        const groupMatch = line.match(/group-title="([^"]+)"/);
        if (groupMatch) currentEntry.category = groupMatch[1];
      }
    } else if (!line.startsWith('#') && currentEntry.name) {
      currentEntry.url = line;
      entries.push({
        id: `ch_${entries.length}`,
        name: currentEntry.name,
        url: currentEntry.url,
        logo: currentEntry.logo,
        category: currentEntry.category || 'Geral',
        type: 'live' // Por padrão, tratamos como TV ao vivo
      });
      currentEntry = {};
    }
  }
  return entries;
}

// Mantemos esta para não quebrar a busca
export function searchChannels(channels: Channel[], query: string): Channel[] {
  return channels.filter(ch => ch.name.toLowerCase().includes(query.toLowerCase()));
}
