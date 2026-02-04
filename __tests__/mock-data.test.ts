import { describe, it, expect } from 'vitest';
import { enrichChannelWithMockData, enrichChannelsWithMockData } from '@/lib/mock-data';
import { Channel, Movie, Series } from '@/types';

describe('Mock Data Enrichment', () => {
  it('deve enriquecer um filme com dados de exemplo', () => {
    const movie: Channel = {
      id: '1',
      name: 'Filme Teste',
      url: 'http://example.com/movie.mp4',
      category: 'Filmes',
      type: 'movie',
    };

    const enriched = enrichChannelWithMockData(movie) as Movie;

    expect(enriched.synopsis).toBeDefined();
    expect(enriched.cast).toBeDefined();
    expect(enriched.cast?.length).toBeGreaterThan(0);
    expect(enriched.director).toBeDefined();
    expect(enriched.imdbRating).toBeDefined();
    expect(enriched.imdbRating).toBeGreaterThan(0);
    expect(enriched.imdbRating).toBeLessThanOrEqual(10);
  });

  it('deve enriquecer uma série com dados de exemplo', () => {
    const series: Channel = {
      id: '2',
      name: 'Série Teste',
      url: 'http://example.com/series.mp4',
      category: 'Series',
      type: 'series',
    };

    const enriched = enrichChannelWithMockData(series) as Series;

    expect(enriched.synopsis).toBeDefined();
    expect(enriched.cast).toBeDefined();
    expect(enriched.cast?.length).toBeGreaterThan(0);
    expect(enriched.creator).toBeDefined();
    expect(enriched.imdbRating).toBeDefined();
    expect(enriched.totalSeasons).toBeDefined();
    expect(enriched.status).toMatch(/ongoing|completed/);
  });

  it('deve manter dados originais do canal', () => {
    const movie: Channel = {
      id: '3',
      name: 'Filme Original',
      url: 'http://example.com/movie.mp4',
      category: 'Filmes',
      type: 'movie',
    };

    const enriched = enrichChannelWithMockData(movie);

    expect(enriched.id).toBe(movie.id);
    expect(enriched.name).toBe(movie.name);
    expect(enriched.url).toBe(movie.url);
    expect(enriched.category).toBe(movie.category);
    expect(enriched.type).toBe(movie.type);
  });

  it('deve enriquecer múltiplos canais', () => {
    const channels: Channel[] = [
      {
        id: '1',
        name: 'Filme 1',
        url: 'http://example.com/movie1.mp4',
        category: 'Filmes',
        type: 'movie',
      },
      {
        id: '2',
        name: 'Série 1',
        url: 'http://example.com/series1.mp4',
        category: 'Series',
        type: 'series',
      },
    ];

    const enriched = enrichChannelsWithMockData(channels);

    expect(enriched).toHaveLength(2);
    expect((enriched[0] as Movie).synopsis).toBeDefined();
    expect((enriched[1] as Series).creator).toBeDefined();
  });

  it('deve não afetar canais ao vivo', () => {
    const liveChannel: Channel = {
      id: '1',
      name: 'Canal ao Vivo',
      url: 'http://example.com/live.m3u8',
      category: 'Canais ao Vivo',
      type: 'live',
    };

    const enriched = enrichChannelWithMockData(liveChannel);

    expect(enriched.type).toBe('live');
    expect(enriched.name).toBe('Canal ao Vivo');
  });

  it('deve usar dados padrão quando nenhuma chave corresponder', () => {
    const movie: Channel = {
      id: '1',
      name: 'Filme Desconhecido XYZ',
      url: 'http://example.com/movie.mp4',
      category: 'Desconhecido',
      type: 'movie',
    };

    const enriched = enrichChannelWithMockData(movie) as Movie;

    expect(enriched.synopsis).toBeDefined();
    expect(enriched.cast).toBeDefined();
    expect(enriched.imdbRating).toBeDefined();
  });
});
