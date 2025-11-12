import { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
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

  const listContentStyle = entries.length === 0 ? styles.emptyContent : undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brandLabel}>Gramálisis</Text>
            <Text style={styles.welcomeText}>
              Hola, {user?.email?.split('@')[0] ?? 'lingüista'}
            </Text>
          </View>
          <View style={styles.actionsRow}>
            <Link href="/profile" asChild>
              <TouchableOpacity style={[styles.actionButton, styles.actionButtonFirst, styles.outlineButton]}>
                <Text style={[styles.actionText, styles.outlineText]}>Perfil</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/game" asChild>
              <TouchableOpacity style={[styles.actionButton, styles.solidButton]}>
                <Text style={[styles.actionText, styles.solidText]}>Modo juego</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity
              onPress={handleLogout}
              style={[styles.actionButton, styles.outlineButton]}
            >
              <Text style={[styles.actionText, styles.outlineText]}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.editorCard}>
          <Text style={styles.cardTitle}>Nuevo análisis</Text>
          <TextInput
            style={styles.input}
            multiline
            value={text}
            onChangeText={setText}
            placeholder="Escribe o pega un texto para analizar..."
            placeholderTextColor="#94a3b8"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.buttonWrapper}>
            <PrimaryButton
              label="Guardar análisis"
              onPress={handleSave}
              loading={saving}
              disabled={!text.trim()}
            />
          </View>
        </View>

        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Historial</Text>
            <Text style={styles.listCount}>{entries.length} guardados</Text>
          </View>
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            contentContainerStyle={listContentStyle}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <View style={styles.entryCard}>
                <Text style={styles.entryText}>{item.text}</Text>
                <View style={styles.entryMetaRow}>
                  <Text style={styles.entrySummary}>{item.summary}</Text>
                  <Text style={styles.entryDate}>{formatDate(item.createdAt)}</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Aún no tienes análisis guardados.</Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brandLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#7a96ff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1d2b74',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 10,
  },
  actionButtonFirst: {
    marginLeft: 0,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#e5edff',
    backgroundColor: '#ffffff',
  },
  solidButton: {
    backgroundColor: '#364fe6',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  outlineText: {
    color: '#2a3dba',
  },
  solidText: {
    color: '#ffffff',
  },
  editorCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5edff',
    backgroundColor: '#f3f7ff',
    padding: 16,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d2b74',
    marginBottom: 12,
  },
  input: {
    minHeight: 120,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5edff',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  error: {
    marginTop: 8,
    fontSize: 14,
    color: '#ef4444',
  },
  buttonWrapper: {
    marginTop: 16,
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d2b74',
  },
  listCount: {
    fontSize: 14,
    color: '#7a96ff',
  },
  separator: {
    height: 12,
  },
  entryCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5edff',
    backgroundColor: '#ffffff',
    padding: 16,
    shadowColor: 'rgba(0,0,0,0.03)',
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  entryText: {
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 8,
  },
  entryMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entrySummary: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2a3dba',
  },
  entryDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#94a3b8',
  },
});
