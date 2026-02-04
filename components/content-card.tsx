import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Channel } from '@/types';
import { useColors } from '@/hooks/use-colors';

interface ContentCardProps {
  item: Channel;
  onPress: () => void;
  width?: number;
}

export function ContentCard({ item, onPress, width = 140 }: ContentCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="mr-3"
      style={{ width, opacity: 1 }}
      activeOpacity={0.7}
    >
      <View className="rounded-xl overflow-hidden bg-surface border border-border">
        {item.logo ? (
          <Image
            source={{ uri: item.logo }}
            className="w-full bg-surface"
            style={{ height: width * 1.5, resizeMode: 'cover' }}
          />
        ) : (
          <View 
            className="w-full bg-surface items-center justify-center"
            style={{ height: width * 1.5 }}
          >
            <Text className="text-4xl text-muted">📺</Text>
          </View>
        )}
      </View>
      <Text 
        className="text-sm font-medium text-foreground mt-2"
        numberOfLines={2}
        style={{ width }}
      >
        {item.name}
      </Text>
      {item.category && (
        <Text 
          className="text-xs text-muted mt-1"
          numberOfLines={1}
          style={{ width }}
        >
          {item.category}
        </Text>
      )}
    </TouchableOpacity>
  );
}
