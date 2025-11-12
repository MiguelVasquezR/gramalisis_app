import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link } from "expo-router";
import { signOut as signOutFromApp } from "../lib/auth";
import { Entry, createEntry, subscribeToEntries } from "../lib/entries";
import { useAuth } from "../context/AuthContext";
import { PrimaryButton } from "../components/PrimaryButton";

const formatDate = (date?: Date) => {
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const levels = [
  {
    id: 1,
    title: "Explorador",
    description: "Registra tu primer análisis y descubre los insights básicos.",
    requirement: 1,
  },
  {
    id: 2,
    title: "Analista",
    description:
      "Mantén una racha de 5 análisis para desbloquear métricas avanzadas.",
    requirement: 5,
  },
  {
    id: 3,
    title: "Estratega",
    description: "Comparte 10 textos distintos para activar recomendaciones.",
    requirement: 10,
  },
  {
    id: 4,
    title: "Mentor",
    description: "Colabora con tu equipo compartiendo 15 análisis.",
    requirement: 15,
  },
  {
    id: 5,
    title: "Leyenda",
    description: "Completa 25 análisis para desbloquear todos los reportes.",
    requirement: 25,
  },
];

export const HomeScreen = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [text, setText] = useState("");
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
      setText("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo guardar el análisis.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOutFromApp();
  };

  const totalEntries = entries.length;
  const userLevel = Math.max(
    1,
    Math.min(
      levels[levels.length - 1].id,
      levels.reduce(
        (acc, level) => (totalEntries >= level.requirement ? level.id : acc),
        1
      )
    )
  );

  const listContentStyle = totalEntries === 0 ? styles.emptyContent : undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topMenu}>
          <View style={styles.levelContainer}>
            <Text style={styles.levelLabel}>Nivel actual</Text>
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.star,
                    idx < userLevel ? styles.starActive : styles.starInactive,
                  ]}
                >
                  ★
                </Text>
              ))}
            </View>
          </View>
          <Link href="/profile" asChild>
            <TouchableOpacity style={styles.avatarButton}>
              <Text style={styles.avatarInitial}>
                {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.levelsSection}>
          <Text style={styles.sectionTitle}>Niveles disponibles</Text>
          <Text style={styles.sectionSubtitle}>
            Completa{" "}
            {Math.max(
              0,
              (levels.find((lvl) => lvl.id === userLevel + 1)?.requirement ??
                levels[levels.length - 1].requirement) - totalEntries
            )}{" "}
            análisis más para subir al siguiente nivel.
          </Text>

          <View style={styles.levelsGrid}>
            {levels.map((level) => {
              const unlocked = totalEntries >= level.requirement;
              const isCurrent = userLevel === level.id;
              return (
                <View
                  key={level.id}
                  style={[
                    styles.levelCard,
                    unlocked && styles.levelCardUnlocked,
                    isCurrent && styles.levelCardCurrent,
                  ]}
                >
                  <View style={styles.levelHeader}>
                    <Text style={styles.levelBadge}>Nivel {level.id}</Text>
                    <Text
                      style={[
                        styles.levelStatus,
                        unlocked
                          ? styles.levelStatusUnlocked
                          : styles.levelStatusLocked,
                      ]}
                    >
                      {unlocked
                        ? isCurrent
                          ? "Actual"
                          : "Desbloqueado"
                        : "Bloqueado"}
                    </Text>
                  </View>
                  <Text style={styles.levelTitle}>{level.title}</Text>
                  <Text style={styles.levelDescription}>
                    {level.description}
                  </Text>
                  <Text style={styles.levelRequirement}>
                    {Math.min(totalEntries, level.requirement)}/
                    {level.requirement} análisis
                  </Text>
                  <PrimaryButton
                    label={unlocked ? "Explorar reto" : "Completa más"}
                    onPress={() => {}}
                    disabled={!unlocked}
                    variant={unlocked ? "primary" : "secondary"}
                  />
                </View>
              );
            })}
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
                  <Text style={styles.entryDate}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  brandLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#7a96ff",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1d2b74",
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  topMenu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  levelContainer: {
    flex: 1,
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
  },
  star: {
    fontSize: 18,
    marginRight: 4,
  },
  starActive: {
    color: "#fbbf24",
  },
  starInactive: {
    color: "#cbd5f5",
  },
  avatarButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: "#1d2b74",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
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
    borderColor: "#e5edff",
    backgroundColor: "#ffffff",
  },
  solidButton: {
    backgroundColor: "#364fe6",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  outlineText: {
    color: "#2a3dba",
  },
  solidText: {
    color: "#ffffff",
  },
  editorCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e5edff",
    backgroundColor: "#f3f7ff",
    padding: 16,
    shadowColor: "rgba(0,0,0,0.05)",
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginBottom: 24,
  },
  levelsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1d2b74",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    marginBottom: 16,
  },
  levelsGrid: {
    gap: 16,
  },
  levelCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5edff",
    backgroundColor: "#f8f9ff",
    padding: 16,
    gap: 8,
  },
  levelCardUnlocked: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5f5",
  },
  levelCardCurrent: {
    borderColor: "#364fe6",
    shadowColor: "rgba(54,79,230,0.15)",
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelBadge: {
    fontSize: 13,
    fontWeight: "700",
    color: "#364fe6",
  },
  levelStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
  levelStatusUnlocked: {
    color: "#10b981",
  },
  levelStatusLocked: {
    color: "#cbd5f5",
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1d2b74",
  },
  levelDescription: {
    fontSize: 14,
    color: "#475569",
  },
  levelRequirement: {
    fontSize: 13,
    color: "#94a3b8",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1d2b74",
    marginBottom: 12,
  },
  input: {
    minHeight: 120,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5edff",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#0f172a",
  },
  error: {
    marginTop: 8,
    fontSize: 14,
    color: "#ef4444",
  },
  buttonWrapper: {
    marginTop: 16,
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1d2b74",
  },
  listCount: {
    fontSize: 14,
    color: "#7a96ff",
  },
  separator: {
    height: 12,
  },
  entryCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e5edff",
    backgroundColor: "#ffffff",
    padding: 16,
    shadowColor: "rgba(0,0,0,0.03)",
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  entryText: {
    fontSize: 16,
    color: "#0f172a",
    marginBottom: 8,
  },
  entryMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  entrySummary: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2a3dba",
  },
  entryDate: {
    fontSize: 12,
    color: "#94a3b8",
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#94a3b8",
  },
});
