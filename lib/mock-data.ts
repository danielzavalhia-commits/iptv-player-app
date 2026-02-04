import { Movie, Series } from '@/types';

/**
 * Dados de exemplo para enriquecer conteúdo com sinopse, elenco e avaliações
 * Estes dados são combinados com os canais da playlist M3U
 */
export const mockMovieDetails: Record<string, Partial<Movie>> = {
  'filme': {
    synopsis: 'Uma aventura épica que segue um herói em sua jornada para salvar o mundo. Com efeitos especiais impressionantes e uma trilha sonora memorável, este filme é um espetáculo cinematográfico que não deve ser perdido.',
    cast: ['Ator Principal', 'Atriz Coadjuvante', 'Ator Vilão'],
    director: 'Diretor Renomado',
    imdbRating: 8.5,
    releaseDate: '2024-01-15',
    duration: '2h 45min',
    genre: 'Ação/Aventura',
  },
  'ação': {
    synopsis: 'Um agente secreto deve impedir um plano terrorista global. Cheio de perseguições de carros, combates intensos e reviravoltas surpreendentes.',
    cast: ['Tom Cruise', 'Charlize Theron', 'Michael B. Jordan'],
    director: 'Christopher Nolan',
    imdbRating: 8.2,
    releaseDate: '2023-06-20',
    duration: '2h 28min',
    genre: 'Ação/Thriller',
  },
  'drama': {
    synopsis: 'Uma história tocante sobre família, amor e redenção. Com performances memoráveis e um roteiro profundo, este filme explora os temas mais importantes da vida.',
    cast: ['Meryl Streep', 'Tom Hanks', 'Timothée Chalamet'],
    director: 'Steven Spielberg',
    imdbRating: 8.8,
    releaseDate: '2023-11-10',
    duration: '2h 15min',
    genre: 'Drama',
  },
  'comédia': {
    synopsis: 'Uma comédia hilariante que segue um grupo de amigos em situações absurdas e engraçadas. Prepare-se para rir muito!',
    cast: ['Will Smith', 'Kevin Hart', 'Melissa McCarthy'],
    director: 'Judd Apatow',
    imdbRating: 7.5,
    releaseDate: '2024-02-14',
    duration: '1h 52min',
    genre: 'Comédia',
  },
};

export const mockSeriesDetails: Record<string, Partial<Series>> = {
  'série': {
    synopsis: 'Uma série épica que segue múltiplas linhas narrativas em um mundo de fantasia. Com personagens complexos, reviravoltas surpreendentes e batalhas espetaculares.',
    cast: ['Ator 1', 'Atriz 2', 'Ator 3', 'Atriz 4'],
    creator: 'Criador Renomado',
    imdbRating: 9.2,
    totalSeasons: 4,
    status: 'completed',
    genre: 'Fantasia/Drama',
  },
  'drama': {
    synopsis: 'Um drama psicológico que explora os limites da moralidade. Cada episódio revela novos segredos e conspirações que mantêm o espectador à beira do assento.',
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
    creator: 'Vince Gilligan',
    imdbRating: 9.5,
    totalSeasons: 5,
    status: 'completed',
    genre: 'Drama/Crime',
  },
  'ficção científica': {
    synopsis: 'Uma série de ficção científica que explora viagens no tempo, universos paralelos e a natureza da realidade. Prepare-se para ter sua mente expandida.',
    cast: ['Tilda Swinton', 'Oscar Isaac', 'Thomasin McKenzie'],
    creator: 'Lana Wachowski',
    imdbRating: 8.7,
    totalSeasons: 3,
    status: 'ongoing',
    genre: 'Ficção Científica/Mistério',
  },
  'suspense': {
    synopsis: 'Um thriller de suspense que segue um detetive em sua busca por um serial killer. Cada pista o leva mais perto da verdade, mas também mais perto do perigo.',
    cast: ['David Fincher', 'Rosamund Pike', 'Ben Affleck'],
    creator: 'Gillian Flynn',
    imdbRating: 8.4,
    totalSeasons: 2,
    status: 'completed',
    genre: 'Suspense/Crime',
  },
};

/**
 * Enriquecer um canal com dados de exemplo baseado em seu nome e categoria
 */
export function enrichChannelWithMockData<T extends { name: string; category?: string; type: string }>(
  channel: T
): T {
  const nameLower = channel.name.toLowerCase();
  const categoryLower = (channel.category || '').toLowerCase();
  const searchKey = nameLower.includes('filme') || categoryLower.includes('filme') ? 'filme' : nameLower;

  if (channel.type === 'movie') {
    const movieData = mockMovieDetails[searchKey] || mockMovieDetails['ação'];
    return { ...channel, ...movieData } as T;
  }

  if (channel.type === 'series') {
    const seriesData = mockSeriesDetails[searchKey] || mockSeriesDetails['série'];
    return { ...channel, ...seriesData } as T;
  }

  return channel;
}

/**
 * Enriquecer múltiplos canais com dados de exemplo
 */
export function enrichChannelsWithMockData<T extends { name: string; category?: string; type: string }>(
  channels: T[]
): T[] {
  return channels.map(channel => enrichChannelWithMockData(channel));
}
