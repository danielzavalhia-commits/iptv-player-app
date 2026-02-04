import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/lib/auth-context';
import { useIPTV } from '@/lib/iptv-context';
import { useColors } from '@/hooks/use-colors';

export default function Index() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isConfigured, isLoading: iptvLoading } = useIPTV();
  const router = useRouter();
  const segments = useSegments();
  const colors = useColors();

  useEffect(() => {
    if (authLoading || iptvLoading) {
      return;
    }

    // Redirecionar baseado no estado de autenticação e configuração
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (!isConfigured) {
      router.replace('/setup');
    } else {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isConfigured, authLoading, iptvLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
