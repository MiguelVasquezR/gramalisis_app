import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Entry, subscribeToEntries } from '../lib/entries';
import { PrimaryButton } from '../components/PrimaryButton';

export const GameScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToEntries(user.uid, setEntries);
    return unsubscribe;
  }, [user]);

  const currentEntry = useMemo(() => {
    if (!entries.length) return null;
    return entries[index % entries.length];
  }, [entries, index]);

  const handleNext = () => {
    if (!entries.length) return;
    setIndex((prev) => (prev + 1) % entries.length);
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-50">
      <View className="flex-1 px-5 py-6 gap-6">
        <View className="gap-1">
          <Text className="text-xs font-semibold uppercase tracking-widest text-brand-500">
            Gramálisis
          </Text>
          <Text className="text-3xl font-bold text-brand-900">Modo juego</Text>
          <Text className="text-base text-brand-700">
            Repasa tus textos y genera nuevas ideas al azar.
          </Text>
        </View>

        <View className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm flex-1">
          {currentEntry ? (
            <>
              <Text className="text-sm font-semibold text-brand-500 mb-2">
                Texto #{index % entries.length + 1} de {entries.length}
              </Text>
              <Text className="text-lg font-semibold text-brand-900 mb-3">
                {currentEntry.summary}
              </Text>
              <Text className="text-base leading-6 text-brand-800 flex-1">
                {currentEntry.text}
              </Text>
            </>
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-center text-base text-brand-500">
                Aún no tienes análisis guardados. Regresa al inicio y crea uno para comenzar el juego.
              </Text>
            </View>
          )}
        </View>

        <View className="gap-3">
          <PrimaryButton
            label="Otro texto"
            onPress={handleNext}
            disabled={!entries.length}
          />
          <PrimaryButton
            label="Volver al inicio"
            variant="secondary"
            onPress={() => router.push('/home')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;

