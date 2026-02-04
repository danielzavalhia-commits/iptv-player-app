import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { ContentCard } from '@/components/content-card';
import { useIPTV } from '@/lib/iptv-context';
import { useColors } from '@/hooks/use-colors';
import { Channel, ContentType } from '@/types';
import { searchChannels } from '@/lib/m3u-parser';

type CategoryFilter = 'all' | ContentType;

export default function CategoriesScreen() {
  const { channels } = useIPTV();
  const colors = useColors();
  const router = useRouter();
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar por tipo
  let filteredChannels = channels;
  if (filter !== 'all') {
    filteredChannels = channels.filter(ch => ch.type === filter);
  }

  // Buscar
  if (searchQuery.trim()) {
    filteredChannels = searchChannels(filteredChannels, searchQuery);
  }

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

  const filterButtons: { key: CategoryFilter; label: string; emoji: string }[] = [
    { key: 'all', label: 'Todos', emoji: '📺' },
    { key: 'live', label: 'Ao Vivo', emoji: '📡' },
    { key: 'movie', label: 'Filmes', emoji: '🎬' },
    { key: 'series', label: 'Séries', emoji: '📺' },
  ];

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-4">
          <Text className="text-2xl font-bold text-foreground mb-4">Categorias</Text>

          {/* Barra de busca */}
          <View className="bg-surface border border-border rounded-xl px-4 py-3 flex-row items-center mb-4">
            <Text className="text-lg mr-2">🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar conteúdo..."
              placeholderTextColor={colors.muted}
              className="flex-1 text-foreground text-base"
              style={{ color: colors.foreground }}
            />
          </View>

          {/* Filtros */}
          <View className="flex-row gap-2">
            {filterButtons.map((btn) => (
              <TouchableOpacity
                key={btn.key}
                onPress={() => setFilter(btn.key)}
                className={`px-4 py-2 rounded-full border ${
                  filter === btn.key
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm font-medium ${
                    filter === btn.key ? 'text-white' : 'text-muted'
                  }`}
                >
                  {btn.emoji} {btn.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Lista de conteúdo */}
        <FlatList
          data={filteredChannels}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          renderItem={({ item }) => (
            <ContentCard item={item} onPress={() => handleContentPress(item)} width={160} />
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-6xl mb-4">🔍</Text>
              <Text className="text-lg font-semibold text-foreground mb-2">
                Nenhum resultado
              </Text>
              <Text className="text-sm text-muted text-center">
                Tente ajustar os filtros ou buscar por outro termo
              </Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}
