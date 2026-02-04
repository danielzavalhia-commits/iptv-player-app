import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { useIPTV } from '@/lib/iptv-context';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';

type LoginMode = 'app' | 'server' | 'm3u' | 'hls';

export default function LoginScreen() {
  const [loginMode, setLoginMode] = useState<LoginMode>('app');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dns, setDns] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { loadPlaylist } = useIPTV();
  const router = useRouter();
  const colors = useColors();

  const handleAppLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const success = await login({ username: username.trim(), password });
    
    setIsLoading(false);

    if (success) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.replace('/setup');
    } else {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert('Erro', 'Usuário ou senha incorretos');
    }
  };

  const handleServerLogin = async () => {
    if (!username.trim() || !password.trim() || !dns.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      // Criar config do servidor
      const serverConfig = {
        mode: 'server' as const,
        url: dns.trim().replace(/\/$/, ''),
        username: username.trim(),
        password,
      };
      
      // Tentar carregar a playlist
      const success = await loadPlaylist(serverConfig);

      if (success) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        router.replace('/(tabs)');
      } else {
        throw new Error('Falha ao carregar playlist');
      }
    } catch (error) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert('Erro', 'Falha ao conectar ao servidor. Verifique os dados e tente novamente.');
      console.error('Erro ao conectar ao servidor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectLogin = async (type: 'url') => {
    if (!playlistUrl.trim()) {
      Alert.alert('Erro', 'Por favor, cole o link da playlist');
      return;
    }

    setIsLoading(true);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      // Criar config M3U
      const m3uConfig = {
        mode: 'm3u' as const,
        url: playlistUrl.trim(),
      };
      
      const success = await loadPlaylist(m3uConfig);

      if (success) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        router.replace('/(tabs)');
      } else {
        throw new Error('Falha ao carregar playlist');
      }
    } catch (error) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert('Erro', 'Falha ao carregar a playlist. Verifique o link e tente novamente.');
      console.error('Erro ao carregar playlist:', error);
    } finally {
      setIsLoading(false);
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
          <View className="flex-1 justify-center px-6 py-8">
            {/* Logo */}
            <View className="items-center mb-8">
              <View className="w-24 h-24 bg-primary rounded-2xl items-center justify-center mb-4 shadow-lg">
                <Image 
                  source={require('@/assets/images/icon.png')}
                  className="w-20 h-20"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-2xl font-bold text-foreground">IPTV Player</Text>
            </View>

            {/* Abas de Modo */}
            <View className="flex-row gap-2 mb-6 bg-surface p-1 rounded-lg border border-border">
              {[
                { mode: 'app' as LoginMode, label: 'App' },
                { mode: 'server' as LoginMode, label: 'Servidor' },
                { mode: 'm3u' as LoginMode, label: 'M3U' },
                { mode: 'hls' as LoginMode, label: 'HLS' },
              ].map(({ mode, label }) => (
                <TouchableOpacity
                  key={mode}
                  onPress={() => setLoginMode(mode)}
                  className={`flex-1 py-2 rounded-md items-center ${
                    loginMode === mode ? 'bg-primary' : 'bg-transparent'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      loginMode === mode ? 'text-white' : 'text-muted'
                    }`}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Conteúdo por Modo */}
            {loginMode === 'app' && (
              <>
                <View className="gap-4 mb-6">
                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">Usuário</Text>
                    <TextInput
                      value={username}
                      onChangeText={setUsername}
                      placeholder="Digite seu usuário"
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
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Digite sua senha"
                      placeholderTextColor={colors.muted}
                      secureTextEntry
                      returnKeyType="done"
                      onSubmitEditing={handleAppLogin}
                      editable={!isLoading}
                      className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-base"
                      style={{ color: colors.foreground }}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleAppLogin}
                  disabled={isLoading}
                  className="bg-primary rounded-xl py-4 items-center shadow-md active:opacity-80"
                  style={{ opacity: isLoading ? 0.6 : 1 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white text-base font-semibold">Entrar</Text>
                  )}
                </TouchableOpacity>

                <View className="mt-8 p-4 bg-surface rounded-xl border border-border">
                  <Text className="text-xs font-semibold text-foreground mb-2">Credenciais de teste:</Text>
                  <Text className="text-xs text-muted">Usuário: admin | Senha: admin123</Text>
                  <Text className="text-xs text-muted">Usuário: demo | Senha: demo123</Text>
                </View>
              </>
            )}

            {loginMode === 'server' && (
              <>
                <View className="gap-4 mb-6">
                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">Usuário</Text>
                    <TextInput
                      value={username}
                      onChangeText={setUsername}
                      placeholder="Ex: 49954959"
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
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Ex: 75570759"
                      placeholderTextColor={colors.muted}
                      secureTextEntry
                      returnKeyType="next"
                      editable={!isLoading}
                      className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-base"
                      style={{ color: colors.foreground }}
                    />
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">DNS/URL do Servidor</Text>
                    <TextInput
                      value={dns}
                      onChangeText={setDns}
                      placeholder="Ex: http://x29.acxll.shop"
                      placeholderTextColor={colors.muted}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={handleServerLogin}
                      editable={!isLoading}
                      className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-base"
                      style={{ color: colors.foreground }}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleServerLogin}
                  disabled={isLoading}
                  className="bg-primary rounded-xl py-4 items-center shadow-md active:opacity-80"
                  style={{ opacity: isLoading ? 0.6 : 1 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white text-base font-semibold">Conectar</Text>
                  )}
                </TouchableOpacity>

                <View className="mt-6 p-3 bg-warning/10 rounded-lg border border-warning">
                  <Text className="text-xs text-warning font-medium">
                    💡 Dica: Use o DNS do seu painel IPTV com suas credenciais
                  </Text>
                </View>
              </>
            )}

            {(loginMode === 'm3u' || loginMode === 'hls') && (
              <>
                <View className="gap-4 mb-6">
                  <View>
                    <Text className="text-sm font-medium text-foreground mb-2">
                      Link da Playlist ({loginMode.toUpperCase()})
                    </Text>
                    <TextInput
                      value={playlistUrl}
                      onChangeText={setPlaylistUrl}
                      placeholder={
                        loginMode === 'm3u'
                          ? 'Ex: http://x29.acxll.shop/get.php?...'
                          : 'Ex: http://x29.acxll.shop/get.php?...'
                      }
                      placeholderTextColor={colors.muted}
                      autoCapitalize="none"
                      autoCorrect={false}
                      multiline
                      numberOfLines={4}
                      returnKeyType="done"
                      editable={!isLoading}
                      className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-xs"
                      style={{ color: colors.foreground, textAlignVertical: 'top' }}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleDirectLogin('url')}
                  disabled={isLoading}
                  className="bg-primary rounded-xl py-4 items-center shadow-md active:opacity-80"
                  style={{ opacity: isLoading ? 0.6 : 1 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white text-base font-semibold">Carregar Playlist</Text>
                  )}
                </TouchableOpacity>

                <View className="mt-6 p-3 bg-success/10 rounded-lg border border-success">
                  <Text className="text-xs text-success font-medium">
                    ✓ Cole o link completo da sua playlist {loginMode.toUpperCase()}
                  </Text>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
