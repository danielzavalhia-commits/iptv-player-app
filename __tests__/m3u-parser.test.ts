import { describe, it, expect } from 'vitest';
import { parseM3UContent, searchChannels, filterByType } from '@/lib/m3u-parser';
import { Channel } from '@/types';

describe('M3U Parser', () => {
  const sampleM3U = `#EXTM3U
#EXTINF:-1 tvg-id="1" tvg-name="Canal 1" tvg-logo="http://example.com/logo1.png" group-title="Canais ao Vivo",Canal 1
http://example.com/stream1.m3u8
#EXTINF:-1 tvg-id="2" tvg-name="Filme Teste" tvg-logo="http://example.com/logo2.png" group-title="Filmes",Filme Teste
http://example.com/movie1.mp4
#EXTINF:-1 tvg-id="3" tvg-name="Serie S01E01" tvg-logo="http://example.com/logo3.png" group-title="Series",Serie S01E01
http://example.com/series1.mp4`;

  it('deve fazer parse de playlist M3U corretamente', () => {
    const channels = parseM3UContent(sampleM3U);
    
    expect(channels).toHaveLength(3);
    expect(channels[0].name).toBe('Canal 1');
    expect(channels[0].url).toBe('http://example.com/stream1.m3u8');
    expect(channels[0].logo).toBe('http://example.com/logo1.png');
    expect(channels[0].category).toBe('Canais ao Vivo');
  });

  it('deve categorizar conteúdo como filme', () => {
    const channels = parseM3UContent(sampleM3U);
    const movies = channels.filter(ch => ch.type === 'movie');
    
    expect(movies).toHaveLength(1);
    expect(movies[0].name).toBe('Filme Teste');
  });

  it('deve categorizar conteúdo como série', () => {
    const channels = parseM3UContent(sampleM3U);
    const series = channels.filter(ch => ch.type === 'series');
    
    expect(series).toHaveLength(1);
    expect(series[0].name).toBe('Serie S01E01');
  });

  it('deve categorizar conteúdo como canal ao vivo', () => {
    const channels = parseM3UContent(sampleM3U);
    const live = channels.filter(ch => ch.type === 'live');
    
    expect(live).toHaveLength(1);
    expect(live[0].name).toBe('Canal 1');
  });

  it('deve buscar canais por nome', () => {
    const channels = parseM3UContent(sampleM3U);
    const results = searchChannels(channels, 'filme');
    
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Filme Teste');
  });

  it('deve filtrar canais por tipo', () => {
    const channels = parseM3UContent(sampleM3U);
    const movies = filterByType(channels, 'movie');
    
    expect(movies).toHaveLength(1);
    expect(movies[0].type).toBe('movie');
  });

  it('deve lidar com playlist vazia', () => {
    const channels = parseM3UContent('');
    expect(channels).toHaveLength(0);
  });

  it('deve lidar com playlist sem tags EXTINF', () => {
    const simpleM3U = `#EXTM3U
http://example.com/stream.m3u8`;
    
    const channels = parseM3UContent(simpleM3U);
    expect(channels).toHaveLength(0);
  });
});
