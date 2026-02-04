import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useIPTV } from '@/lib/iptv-context';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { loadPlaylist } = useIPTV();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await loadPlaylist({
        mode: 'server',
        url: 'http://x29.acxll.shop', // Seu servidor fixo
        username: username.trim(),
        password: password.trim(),
      });

      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Erro', 'Usuário ou senha incorretos ou servidor fora do ar.');
      }
    } catch (e) {
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>IPTV Player</Text>
        <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="Seu Usuário"
          placeholderTextColor="#6C757D"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Sua Senha"
          placeholderTextColor="#6C757D"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>ENTRAR</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#0A0E14' },
  card: { padding: 10 },
  title: { fontSize: 34, fontWeight: 'bold', color: '#E63946', textAlign: 'center', marginBottom: 5 },
  subtitle: { textAlign: 'center', marginBottom: 40, color: '#8B92A8', fontSize: 16 },
  input: { height: 60, borderRadius: 12, paddingHorizontal: 20, marginBottom: 15, backgroundColor: '#1A1F2E', color: '#FFFFFF', fontSize: 16 },
  button: { height: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: '#E63946' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
