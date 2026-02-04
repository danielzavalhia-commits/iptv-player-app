import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Platform } from 'react-native';
import { useQuality, type VideoQuality } from '@/lib/quality-context';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';

interface QualityMenuProps {
  visible: boolean;
  onClose: () => void;
}

const QUALITY_OPTIONS: Array<{ value: VideoQuality; label: string; emoji: string }> = [
  { value: 'auto', label: 'Automático', emoji: '🔄' },
  { value: '1080p', label: '1080p (Full HD)', emoji: '🎬' },
  { value: '720p', label: '720p (HD)', emoji: '📺' },
  { value: '480p', label: '480p (SD)', emoji: '📱' },
];

export function QualityMenu({ visible, onClose }: QualityMenuProps) {
  const { quality, setQuality } = useQuality();
  const colors = useColors();

  const handleSelectQuality = async (selectedQuality: VideoQuality) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    await setQuality(selectedQuality);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Menu */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingTop: 16,
            paddingBottom: 32,
            maxHeight: '60%',
          }}
        >
          {/* Header */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground }}>
              Qualidade de Vídeo
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
              Selecione a qualidade desejada
            </Text>
          </View>

          {/* Lista de opções */}
          <FlatList
            data={QUALITY_OPTIONS}
            keyExtractor={(item) => item.value}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const isSelected = quality === item.value;

              return (
                <TouchableOpacity
                  onPress={() => handleSelectQuality(item.value)}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    marginHorizontal: 8,
                    marginBottom: 8,
                    borderRadius: 12,
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.primary : colors.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: isSelected ? '#FFFFFF' : colors.foreground,
                        }}
                      >
                        {item.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: isSelected ? 'rgba(255, 255, 255, 0.7)' : colors.muted,
                          marginTop: 2,
                        }}
                      >
                        {item.value === 'auto'
                          ? 'Melhor qualidade disponível'
                          : `Resolução ${item.value}`}
                      </Text>
                    </View>
                  </View>

                  {isSelected && (
                    <Text style={{ fontSize: 18, color: '#FFFFFF' }}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            }}
          />

          {/* Informação */}
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 16,
              padding: 12,
              backgroundColor: colors.surface,
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
            }}
          >
            <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 18 }}>
              💡 Qualidades mais altas consomem mais dados. Use "Automático" para melhor
              experiência.
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
