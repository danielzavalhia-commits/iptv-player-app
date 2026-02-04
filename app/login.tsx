import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useIPTV } from '@/lib/iptv-context';
import { useColors } from '@/hooks/use-colors';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { loadPlaylist } = useIPTV();
  const colors = useColors();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, insira seu usuário e senha.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await loadPlaylist({
        mode: 'server',
        url: 'http://x29.acxll.shop', // Seu DNS já fixo aqui
        username: username.trim(),
        password: password.trim(),
      });

      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Falha', 'Usuário ou senha incorretos, ou servidor offline.');
      }
    } catch (e) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar conectar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.card}>
        <Text style={[styles.title, { color: colors.text }]}>IPTV Player</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Entre com sua conta do painel</Text>

        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          placeholder="Usuário"
          placeholderTextColor="#666"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          placeholder="Senha"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>ENTRAR AGORA</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { padding: 20, borderRadius: 15, elevation: 5 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  subtitle: { textAlign: 'center', marginBottom: 30 },
  input: { height: 55, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, fontSize: 16 },
  button: { height: 55, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
