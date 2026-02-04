import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { ContentCard } from '@/components/content-card';
import { useFavorites } from '@/lib/favorites-context';
import { useIPTV } from '@/lib/iptv-context';
import { Channel } from '@/types';

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const { channels } = useIPTV();
  const router = useRouter();

  // Mapear favoritos para os canais correspondentes
  const favoriteChannels = favorites
    .map(fav => channels.find(ch => ch.id === fav.contentId))
    .filter(Boolean) as Channel[];

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

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-4">
          <Text className="text-2xl font-bold text-foreground">Meus Favoritos</Text>
          {favoriteChannels.length > 0 && (
            <Text className="text-sm text-muted mt-1">
              {favoriteChannels.length} {favoriteChannels.length === 1 ? 'item' : 'itens'}
            </Text>
          )}
        </View>

        {/* Lista de favoritos */}
        <FlatList
          data={favoriteChannels}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          renderItem={({ item }) => (
            <ContentCard item={item} onPress={() => handleContentPress(item)} width={160} />
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-20 px-6">
              <Text className="text-6xl mb-4">❤️</Text>
              <Text className="text-xl font-bold text-foreground mb-2 text-center">
                Nenhum favorito ainda
              </Text>
              <Text className="text-base text-muted text-center">
                Adicione seus conteúdos favoritos para acessá-los rapidamente aqui
              </Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}
