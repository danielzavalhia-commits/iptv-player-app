import React from 'react';
import { ScrollView, Text, View, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { ContentCard } from '@/components/content-card';
import { useIPTV } from '@/lib/iptv-context';
import { useWatchHistory } from '@/lib/watch-history-context';
import { useColors } from '@/hooks/use-colors';
import { Channel } from '@/types';

export default function HomeScreen() {
  const { movies, series, liveChannels, isLoading, loadPlaylist } = useIPTV();
  const { history } = useWatchHistory();
  const router = useRouter();
  const colors = useColors();

  const handleRefresh = async () => {
    await loadPlaylist();
  };

  const handleContentPress = (item: Channel) => {
    // Ir para detalhes se for filme ou série, senão ir direto para player
    if (item.type === 'movie' || item.type === 'series') {
      router.push({
        pathname: '/details',
        params: {
          id: item.id,
          type: item.type,
        },
      } as any);
    } else {
      router.push({
        pathname: '/player',
        params: {
          url: item.url,
          title: item.name,
          id: item.id,
          type: item.type,
        },
      } as any);
    }
  };

  const continueWatching = history.slice(0, 10);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Image 
              source={require('@/assets/images/icon.png')}
              className="w-10 h-10"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-foreground">IPTV Player</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/settings' as any)}
            className="w-10 h-10 items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="text-2xl">⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Continuar Assistindo */}
        {continueWatching.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground px-6 mb-3">Continuar Assistindo</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={continueWatching}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 24 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => console.log('Continue watching:', item.title)}
                  className="mr-3 rounded-xl overflow-hidden bg-surface border border-border"
                  style={{ width: 200 }}
                  activeOpacity={0.7}
                >
                  {item.thumbnail ? (
                    <Image
                      source={{ uri: item.thumbnail }}
                      className="w-full h-28 bg-surface"
                      style={{ resizeMode: 'cover' }}
                    />
                  ) : (
                    <View className="w-full h-28 bg-surface items-center justify-center">
                      <Text className="text-4xl">📺</Text>
                    </View>
                  )}
                  <View className="p-3">
                    <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                      {item.title}
                    </Text>
                    <View className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                      <View
                        className="h-full bg-primary"
                        style={{ width: `${(item.progress / item.duration) * 100}%` }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Canais ao Vivo */}
        {liveChannels.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between px-6 mb-3">
              <Text className="text-lg font-bold text-foreground">Canais ao Vivo</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-sm text-primary font-medium">Ver todos</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={liveChannels.slice(0, 20)}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 24 }}
              renderItem={({ item }) => (
                <ContentCard item={item} onPress={() => handleContentPress(item)} width={140} />
              )}
            />
          </View>
        )}

        {/* Filmes */}
        {movies.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between px-6 mb-3">
              <Text className="text-lg font-bold text-foreground">Filmes</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-sm text-primary font-medium">Ver todos</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={movies.slice(0, 20)}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 24 }}
              renderItem={({ item }) => (
                <ContentCard item={item} onPress={() => handleContentPress(item)} width={140} />
              )}
            />
          </View>
        )}

        {/* Séries */}
        {series.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between px-6 mb-3">
              <Text className="text-lg font-bold text-foreground">Séries</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-sm text-primary font-medium">Ver todos</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={series.slice(0, 20)}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 24 }}
              renderItem={({ item }) => (
                <ContentCard item={item} onPress={() => handleContentPress(item)} width={140} />
              )}
            />
          </View>
        )}

        {/* Estado vazio */}
        {!isLoading && movies.length === 0 && series.length === 0 && liveChannels.length === 0 && (
          <View className="flex-1 items-center justify-center py-20 px-6">
            <Text className="text-6xl mb-4">📺</Text>
            <Text className="text-xl font-bold text-foreground mb-2 text-center">
              Nenhum conteúdo disponível
            </Text>
            <Text className="text-base text-muted text-center">
              Configure sua playlist IPTV nas configurações para começar
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
