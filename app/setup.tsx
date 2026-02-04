import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useIPTV } from '@/lib/iptv-context';
import { useColors } from '@/hooks/use-colors';
import { IPTVConfig } from '@/types';
import * as Haptics from 'expo-haptics';

type ConfigMode = 'server' | 'm3u';

export default function SetupScreen() {
  const [mode, setMode] = useState<ConfigMode>('m3u');
  const [serverUrl, setServerUrl] = useState('');
  const [serverUsername, setServerUsername] = useState('');
  const [serverPassword, setServerPassword] = useState('');
  const [m3uUrl, setM3uUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { saveConfig, loadPlaylist } = useIPTV();
  const router = useRouter();
  const colors = useColors();

  const handleSave = async () => {
    let config: IPTVConfig;

    if (mode === 'server') {
      if (!serverUrl.trim() || !serverUsername.trim() || !serverPassword.trim()) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
        return;
      }
      config = {
        mode: 'server',
        url: serverUrl.trim(),
        username: serverUsername.trim(),
        password: serverPassword.trim(),
      };
    } else {
      if (!m3uUrl.trim()) {
        Alert.alert('Erro', 'Por favor, insira a URL da playlist M3U');
        return;
      }
      config = {
        mode: 'm3u',
        url: m3uUrl.trim(),
      };
    }

    setIsLoading(true);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      await saveConfig(config);
      const success = await loadPlaylist();
      
      setIsLoading(false);

      if (success) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        router.replace('/(tabs)');
      } else {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        Alert.alert('Erro', 'Não foi possível carregar a playlist. Verifique as configurações e tente novamente.');
      }
    } catch (error) {
      setIsLoading(false);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert('Erro', 'Ocorreu um erro ao salvar as configurações');
    }
  };

  return (
    <ScreenContainer edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 py-8">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-foreground mb-2">Configurar IPTV</Text>
              <Text className="text-base text-muted">
                Configure sua fonte de conteúdo para começar
              </Text>
            </View>

            {/* Mode Selector */}
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity
                onPress={() => setMode('m3u')}
                disabled={isLoading}
                className={`flex-1 py-3 rounded-xl border-2 items-center ${
                  mode === 'm3u' ? 'border-primary bg-primary/10' : 'border-border bg-surface'
                }`}
              >
                <Text className={`font-semibold ${mode === 'm3u' ? 'text-primary' : 'text-muted'}`}>
                  Playlist M3U
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMode('server')}
                disabled={isLoading}
                className={`flex-1 py-3 rounded-xl border-2 items-center ${
                  mode === 'server' ? 'border-primary bg-primary/10' : 'border-border bg-surface'
                }`}
              >
                <Text className={`font-semibold ${mode === 'server' ? 'text-primary' : 'text-muted'}`}>
                  Servidor
                </Text>
              </TouchableOpacity>
            </View>

            {/* Formulário - Modo Servidor */}
            {mode === 'server' && (
              <View className="gap-4 mb-6">
                <View>
                  <Text className="text-sm font-medium text-foreground mb-2">URL do Servidor</Text>
                  <TextInput
                    value={serverUrl}
                    onChangeText={setServerUrl}
                    placeholder="http://exemplo.com:8080"
                    placeholderTextColor={colors.muted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    returnKeyType="next"
                    editable={!isLoading}
                    className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-base"
                    style={{ color: colors.foreground }}
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-foreground mb-2">Usuário</Text>
                  <TextInput
                    value={serverUsername}
                    onChangeText={setServerUsername}
                    placeholder="Digite o usuário"
                    placeholderTextColor={colors.muted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    editable={!isLoading}
                    className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-base"
                    style={{ color: colors.foreground }}
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-foreground mb-2">Senha</Text>
                  <TextInput
                    value={serverPassword}
                    onChangeText={setServerPassword}
                    placeholder="Digite a senha"
                    placeholderTextColor={colors.muted}
                    secureTextEntry
                    returnKeyType="done"
                    onSubmitEditing={handleSave}
                    editable={!isLoading}
                    className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-base"
                    style={{ color: colors.foreground }}
                  />
                </View>
              </View>
            )}

            {/* Formulário - Modo M3U */}
            {mode === 'm3u' && (
              <View className="gap-4 mb-6">
                <View>
                  <Text className="text-sm font-medium text-foreground mb-2">URL da Playlist M3U</Text>
                  <TextInput
                    value={m3uUrl}
                    onChangeText={setM3uUrl}
                    placeholder="http://exemplo.com/playlist.m3u"
                    placeholderTextColor={colors.muted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    returnKeyType="done"
                    onSubmitEditing={handleSave}
                    editable={!isLoading}
                    multiline
                    numberOfLines={3}
                    className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-base"
                    style={{ color: colors.foreground, minHeight: 80 }}
                  />
                </View>
              </View>
            )}

            {/* Botão Salvar */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading}
              className="bg-primary rounded-xl py-4 items-center shadow-md active:opacity-80"
              style={{ opacity: isLoading ? 0.6 : 1 }}
            >
              {isLoading ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator color="#FFFFFF" />
                  <Text className="text-white text-base font-semibold">Carregando playlist...</Text>
                </View>
              ) : (
                <Text className="text-white text-base font-semibold">Salvar e Continuar</Text>
              )}
            </TouchableOpacity>

            {/* Informações */}
            <View className="mt-8 p-4 bg-surface rounded-xl border border-border">
              <Text className="text-xs font-semibold text-foreground mb-2">💡 Dica:</Text>
              <Text className="text-xs text-muted leading-relaxed">
                {mode === 'server' 
                  ? 'Insira as credenciais fornecidas pelo seu provedor IPTV. O aplicativo irá gerar automaticamente a URL da playlist.'
                  : 'Cole a URL completa da playlist M3U fornecida pelo seu provedor IPTV. O formato deve ser .m3u ou .m3u8.'
                }
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
