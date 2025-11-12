import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.label}>Gramálisis</Text>
          <Text style={styles.title}>Modo juego</Text>
          <Text style={styles.subtitle}>Repasa tus textos y genera nuevas ideas al azar.</Text>
        </View>

        <View style={styles.card}>
          {currentEntry ? (
            <>
              <Text style={styles.cardIndex}>
                Texto #{index % entries.length + 1} de {entries.length}
              </Text>
              <Text style={styles.cardSummary}>{currentEntry.summary}</Text>
              <Text style={styles.cardBody}>{currentEntry.text}</Text>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Aún no tienes análisis guardados. Regresa al inicio y crea uno para comenzar el juego.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Otro texto" onPress={handleNext} disabled={!entries.length} />
          <View style={styles.actionSpacer}>
            <PrimaryButton
              label="Volver al inicio"
              variant="secondary"
              onPress={() => router.push('/home')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f7ff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#7a96ff',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d2b74',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginTop: 4,
  },
  card: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e5edff',
    backgroundColor: '#ffffff',
    padding: 20,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginBottom: 24,
  },
  cardIndex: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7a96ff',
    marginBottom: 8,
  },
  cardSummary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d2b74',
    marginBottom: 12,
  },
  cardBody: {
    fontSize: 16,
    lineHeight: 22,
    color: '#0f172a',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#94a3b8',
  },
  actions: {
    marginTop: 8,
  },
  actionSpacer: {
    marginTop: 12,
  },
});
