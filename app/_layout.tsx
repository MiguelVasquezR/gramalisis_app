import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

const LoadingScreen = () => (
  <View className="flex-1 items-center justify-center bg-brand-50">
    <ActivityIndicator color="#4f6dff" />
  </View>
);

const RouterGate = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const currentSegment = segments[0];
    const isAuthRoute = currentSegment === 'registry';

    if (!user && !isAuthRoute) {
      router.replace('/registry');
    } else if (user && isAuthRoute) {
      router.replace('/home');
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouterGate />
    </AuthProvider>
  );
}

