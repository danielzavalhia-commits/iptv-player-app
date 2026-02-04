import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { useIPTV } from '@/lib/iptv-context';
import { useWatchHistory } from '@/lib/watch-history-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { config, clearConfig } = useIPTV();
  const { clearHistory } = useWatchHistory();
  const colorScheme = useColorScheme();
  const colors = useColors();
  const router = useRouter();

  const isDarkMode = colorScheme === 'dark';

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleReconfigureIPTV = () => {
    Alert.alert(
      'Reconfigurar IPTV',
      'Isso irá remover sua configuração atual. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: async () => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            await clearConfig();
            router.replace('/setup');
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Limpar Histórico',
      'Isso irá remover todo o histórico de visualização. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            await clearHistory();
            Alert.alert('Sucesso', 'Histórico limpo com sucesso');
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-2xl font-bold text-foreground">Configurações</Text>
        </View>

        {/* Seção Conta */}
        <View className="px-6 mb-6">
          <Text className="text-sm font-semibold text-muted mb-3">CONTA</Text>
          
          <View className="bg-surface rounded-xl border border-border overflow-hidden">
            <View className="p-4 border-b border-border">
              <Text className="text-xs text-muted mb-1">Usuário</Text>
              <Text className="text-base font-medium text-foreground">{user?.username}</Text>
            </View>
            <View className="p-4">
              <Text className="text-xs text-muted mb-1">Email</Text>
              <Text className="text-base font-medium text-foreground">{user?.email}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="mt-3 bg-error/10 border border-error rounded-xl p-4 active:opacity-70"
          >
            <Text className="text-error font-semibold text-center">Sair da Conta</Text>
          </TouchableOpacity>
        </View>

        {/* Seção IPTV */}
        <View className="px-6 mb-6">
          <Text className="text-sm font-semibold text-muted mb-3">IPTV</Text>
          
          <View className="bg-surface rounded-xl border border-border p-4 mb-3">
            <Text className="text-xs text-muted mb-1">Modo de Configuração</Text>
            <Text className="text-base font-medium text-foreground mb-3">
              {config?.mode === 'server' ? 'Servidor' : 'Playlist M3U'}
            </Text>
            
            {config?.mode === 'server' && (
              <>
                <Text className="text-xs text-muted mb-1">URL do Servidor</Text>
                <Text className="text-sm text-foreground" numberOfLines={1}>
                  {config.url}
                </Text>
              </>
            )}
            
            {config?.mode === 'm3u' && (
              <>
                <Text className="text-xs text-muted mb-1">URL da Playlist</Text>
                <Text className="text-sm text-foreground" numberOfLines={1}>
                  {config.url}
                </Text>
              </>
            )}
          </View>

          <TouchableOpacity
            onPress={handleReconfigureIPTV}
            className="bg-surface border border-border rounded-xl p-4 active:opacity-70"
          >
            <Text className="text-primary font-semibold text-center">Reconfigurar IPTV</Text>
          </TouchableOpacity>
        </View>

        {/* Seção Aparência */}
        <View className="px-6 mb-6">
          <Text className="text-sm font-semibold text-muted mb-3">APARÊNCIA</Text>
          
          <View className="bg-surface rounded-xl border border-border p-4 flex-row items-center justify-between">
            <View>
              <Text className="text-base font-medium text-foreground">Modo Escuro</Text>
              <Text className="text-xs text-muted mt-1">
                {isDarkMode ? 'Ativado' : 'Desativado'}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={() => {
                // TODO: Implementar toggle de tema
                Alert.alert('Em breve', 'Função de alternar tema será implementada em breve');
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Seção Dados */}
        <View className="px-6 mb-6">
          <Text className="text-sm font-semibold text-muted mb-3">DADOS</Text>
          
          <TouchableOpacity
            onPress={handleClearHistory}
            className="bg-surface border border-border rounded-xl p-4 active:opacity-70"
          >
            <Text className="text-foreground font-semibold text-center">Limpar Histórico</Text>
          </TouchableOpacity>
        </View>

        {/* Seção Sobre */}
        <View className="px-6 mb-8">
          <Text className="text-sm font-semibold text-muted mb-3">SOBRE</Text>
          
          <View className="bg-surface rounded-xl border border-border p-4">
            <Text className="text-xs text-muted mb-1">Versão do App</Text>
            <Text className="text-base font-medium text-foreground mb-3">1.0.0</Text>
            
            <Text className="text-xs text-muted mb-1">Desenvolvido por</Text>
            <Text className="text-base font-medium text-foreground">Manus AI</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
