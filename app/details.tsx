import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useFavorites } from '@/lib/favorites-context';
import { useIPTV } from '@/lib/iptv-context';
import { Channel, Movie, Series } from '@/types';
import * as Haptics from 'expo-haptics';

export default function DetailsScreen() {
  const params = useLocalSearchParams<{ id: string; type: string }>();
  const router = useRouter();
  const colors = useColors();
  const { channels } = useIPTV();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Encontrar o conteúdo
  const content = channels.find(ch => ch.id === params.id);

  if (!content) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <Text className="text-lg text-foreground font-semibold">Conteúdo não encontrado</Text>
      </ScreenContainer>
    );
  }

  const isMovie = content.type === 'movie';
  const isSeries = content.type === 'series';
  const favorited = isFavorite(content.id);

  const handlePlayPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({
      pathname: '/player',
      params: {
        url: content.url,
        title: content.name,
        id: content.id,
        type: content.type,
      },
    } as any);
  };

  const handleToggleFavorite = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await toggleFavorite(content.id, content.type);
  };

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const movie = content as Movie;
  const series = content as Series;

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com voltar */}
        <View className="px-6 pt-4 pb-4 flex-row items-center">
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 items-center justify-center rounded-full bg-surface border border-border active:opacity-70"
            activeOpacity={0.7}
          >
            <Text className="text-lg">←</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-lg font-bold text-foreground ml-3" numberOfLines={1}>
            Detalhes
          </Text>
        </View>

        {/* Poster/Capa */}
        <View className="px-6 mb-6">
          {content.logo ? (
            <Image
              source={{ uri: content.logo }}
              className="w-full bg-surface rounded-2xl"
              style={{ height: 300, resizeMode: 'cover' }}
            />
          ) : (
            <View
              className="w-full bg-surface rounded-2xl items-center justify-center border border-border"
              style={{ height: 300 }}
            >
              <Text className="text-6xl">📺</Text>
            </View>
          )}
        </View>

        {/* Título e Informações Básicas */}
        <View className="px-6 mb-6">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <Text className="text-2xl font-bold text-foreground mb-2">{content.name}</Text>
              <View className="flex-row items-center gap-2 flex-wrap">
                {(isMovie || isSeries) && (movie.year || series.year) && (
                  <Text className="text-sm text-muted bg-surface px-3 py-1 rounded-full">
                    {isMovie ? movie.year : series.year}
                  </Text>
                )}
                {(isMovie || isSeries) && (movie.genre || series.genre) && (
                  <Text className="text-sm text-muted bg-surface px-3 py-1 rounded-full">
                    {isMovie ? movie.genre : series.genre}
                  </Text>
                )}
                {(isMovie || isSeries) && (movie.imdbRating || series.imdbRating) && (
                  <View className="flex-row items-center gap-1 bg-surface px-3 py-1 rounded-full">
                    <Text>⭐</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {isMovie ? movie.imdbRating : series.imdbRating}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Botão Favorito */}
            <TouchableOpacity
              onPress={handleToggleFavorite}
              className="w-12 h-12 items-center justify-center rounded-full bg-surface border border-border active:opacity-70"
              activeOpacity={0.7}
            >
              <Text className="text-2xl">{favorited ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão Play Principal */}
        <View className="px-6 mb-6">
          <TouchableOpacity
            onPress={handlePlayPress}
            className="bg-primary rounded-xl py-4 items-center justify-center flex-row gap-2 active:opacity-80"
            activeOpacity={0.7}
          >
            <Text className="text-2xl">▶️</Text>
            <Text className="text-white text-lg font-bold">
              {isSeries ? 'Assistir Série' : 'Assistir Filme'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sinopse */}
        {(isMovie || isSeries) && (movie.synopsis || series.synopsis) && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Sinopse</Text>
            <Text className="text-base text-muted leading-relaxed">
              {isMovie ? movie.synopsis : series.synopsis}
            </Text>
          </View>
        )}

        {/* Informações Adicionais */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Informações</Text>
          <View className="bg-surface rounded-xl border border-border overflow-hidden">
            {/* Duração (Filme) */}
            {isMovie && movie.duration && (
              <View className="p-4 border-b border-border flex-row justify-between">
                <Text className="text-muted">Duração</Text>
                <Text className="font-semibold text-foreground">{movie.duration}</Text>
              </View>
            )}

            {/* Diretor (Filme) */}
            {isMovie && movie.director && (
              <View className="p-4 border-b border-border flex-row justify-between">
                <Text className="text-muted">Diretor</Text>
                <Text className="font-semibold text-foreground">{movie.director}</Text>
              </View>
            )}

            {/* Criador (Série) */}
            {isSeries && series.creator && (
              <View className="p-4 border-b border-border flex-row justify-between">
                <Text className="text-muted">Criador</Text>
                <Text className="font-semibold text-foreground">{series.creator}</Text>
              </View>
            )}

            {/* Total de Temporadas (Série) */}
            {isSeries && series.totalSeasons && (
              <View className="p-4 border-b border-border flex-row justify-between">
                <Text className="text-muted">Temporadas</Text>
                <Text className="font-semibold text-foreground">{series.totalSeasons}</Text>
              </View>
            )}

            {/* Status (Série) */}
            {isSeries && series.status && (
              <View className="p-4 flex-row justify-between">
                <Text className="text-muted">Status</Text>
                <Text className="font-semibold text-foreground">
                  {series.status === 'ongoing' ? 'Em Produção' : 'Finalizada'}
                </Text>
              </View>
            )}

            {/* Categoria */}
            {content.category && (
              <View className="p-4 flex-row justify-between">
                <Text className="text-muted">Categoria</Text>
                <Text className="font-semibold text-foreground">{content.category}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Elenco */}
        {(isMovie || isSeries) && (movie.cast || series.cast) && (movie.cast?.length || series.cast?.length) ? (
          <View className="px-6 mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">Elenco</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={isMovie ? movie.cast : series.cast}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <View className="mr-3 items-center">
                  <View className="w-20 h-20 bg-surface rounded-full border border-border items-center justify-center">
                    <Text className="text-3xl">👤</Text>
                  </View>
                  <Text className="text-xs text-foreground text-center mt-2 w-20" numberOfLines={2}>
                    {item}
                  </Text>
                </View>
              )}
            />
          </View>
        ) : null}

        {/* Avaliação Detalhada */}
        {(isMovie || isSeries) && (movie.imdbRating || series.imdbRating) && (
          <View className="px-6 mb-8">
            <Text className="text-lg font-bold text-foreground mb-3">Avaliação</Text>
            <View className="bg-surface rounded-xl border border-border p-4">
              <View className="flex-row items-center gap-3 mb-3">
                <Text className="text-4xl">⭐</Text>
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-foreground">
                    {isMovie ? movie.imdbRating : series.imdbRating}
                  </Text>
                  <Text className="text-sm text-muted">IMDb</Text>
                </View>
              </View>

              {/* Barra de avaliação visual */}
              <View className="mt-3">
                <View className="h-2 bg-border rounded-full overflow-hidden">
                  <View
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${((isMovie ? movie.imdbRating : series.imdbRating) || 0) * 10}%`,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
