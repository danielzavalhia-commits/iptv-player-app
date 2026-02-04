import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const colors = useColors();

  const handleLogin = async () => {
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
            <View className="items-center mb-12">
              <View className="w-32 h-32 bg-primary rounded-3xl items-center justify-center mb-6 shadow-lg">
                <Image 
                  source={require('@/assets/images/icon.png')}
                  className="w-28 h-28"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-3xl font-bold text-foreground mb-2">IPTV Player</Text>
              <Text className="text-base text-muted text-center">
                Acesse sua conta para continuar
              </Text>
            </View>

            {/* Formulário */}
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
                  onSubmitEditing={handleLogin}
                  editable={!isLoading}
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-base"
                  style={{ color: colors.foreground }}
                />
              </View>
            </View>

            {/* Botão de Login */}
            <TouchableOpacity
              onPress={handleLogin}
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

            {/* Informações de teste */}
            <View className="mt-8 p-4 bg-surface rounded-xl border border-border">
              <Text className="text-xs font-semibold text-foreground mb-2">Credenciais de teste:</Text>
              <Text className="text-xs text-muted">Usuário: admin | Senha: admin123</Text>
              <Text className="text-xs text-muted">Usuário: demo | Senha: demo123</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
