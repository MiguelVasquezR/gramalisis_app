import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { AppStoreProvider } from '../src/store/AppStore';

const AUTH_SEGMENTS = new Set(['login', 'registry']);

const LoadingScreen = () => (
  <View style={styles.loader}>
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
    const isAuthRoute = typeof currentSegment === 'string' && AUTH_SEGMENTS.has(currentSegment);

    if (!user && !isAuthRoute) {
      router.replace('/login');
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
    <AppStoreProvider>
      <AuthProvider>
        <RouterGate />
        <Toast position="top" topOffset={48} />
      </AuthProvider>
    </AppStoreProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f7ff',
  },
});
