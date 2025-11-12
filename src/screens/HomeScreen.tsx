import { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { signOut as signOutFromApp } from '../lib/auth';
import { Entry, createEntry, subscribeToEntries } from '../lib/entries';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton } from '../components/PrimaryButton';

const formatDate = (date?: Date) => {
  if (!date) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export const HomeScreen = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }

    const unsubscribe = subscribeToEntries(user.uid, setEntries);
    return unsubscribe;
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await createEntry(user.uid, text);
      setText('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo guardar el análisis.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOutFromApp();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-5 py-6 gap-6">
        <View className="flex-row items-center justify-between gap-4">
          <View>
            <Text className="text-xs font-semibold uppercase tracking-widest text-brand-500">
              Gramálisis
            </Text>
            <Text className="text-2xl font-bold text-brand-900">
              Hola, {user?.email?.split('@')[0] ?? 'lingüista'}
            </Text>
          </View>
          <View className="flex-row gap-2">
            <Link href="/game" asChild>
              <TouchableOpacity className="rounded-full bg-brand-600 px-4 py-2">
                <Text className="text-sm font-semibold text-white">Modo juego</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity
              onPress={handleLogout}
              className="rounded-full border border-brand-100 px-4 py-2"
            >
              <Text className="text-sm font-semibold text-brand-700">Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="rounded-3xl border border-brand-100 bg-brand-50 p-4 shadow-sm">
          <Text className="text-lg font-semibold text-brand-900 mb-3">Nuevo análisis</Text>
          <TextInput
            className="min-h-[120px] rounded-2xl border border-brand-100 bg-white px-4 py-3 text-base text-brand-900"
            multiline
            value={text}
            onChangeText={setText}
            placeholder="Escribe o pega un texto para analizar..."
            placeholderTextColor="#94a3b8"
          />
          {error ? <Text className="text-sm text-red-500 mt-2">{error}</Text> : null}
          <View className="mt-4">
            <PrimaryButton
              label="Guardar análisis"
              onPress={handleSave}
              loading={saving}
              disabled={!text.trim()}
            />
          </View>
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-brand-900">Historial</Text>
            <Text className="text-sm text-brand-500">{entries.length} guardados</Text>
          </View>
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            contentContainerStyle={
              entries.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : undefined
            }
            ItemSeparatorComponent={() => <View className="h-3" />}
            renderItem={({ item }) => (
              <View className="rounded-3xl border border-brand-100 bg-white p-4 shadow-sm">
                <Text className="text-base text-brand-900 mb-2">{item.text}</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-semibold text-brand-700">{item.summary}</Text>
                  <Text className="text-xs text-brand-500">{formatDate(item.createdAt)}</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View className="items-center">
                <Text className="text-center text-base text-brand-500">
                  Aún no tienes análisis guardados.
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
