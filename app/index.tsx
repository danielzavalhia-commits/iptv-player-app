import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useIPTV } from '@/lib/iptv-context';

export default function Index() {
  const { isConfigured, isLoading } = useIPTV();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isConfigured) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [isConfigured, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
