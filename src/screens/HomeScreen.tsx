import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Entry, createEntry, subscribeToEntries } from "../lib/entries";
import { useAuth } from "../context/AuthContext";
import { PrimaryButton } from "../components/PrimaryButton";
import { LEVELS } from "../const/levels";
import { LEARNING_STAGES } from "../const/stages";
import { useAppDispatch, useAppSelector } from "../store/AppStore";

const formatDate = (date?: Date) => {
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const HomeScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.entries);
  const currentUser = useAppSelector((state) => state.currentUser);

  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      dispatch({ type: "SET_ENTRIES", payload: [] });
      return;
    }

    const unsubscribe = subscribeToEntries(user.uid, (nextEntries) => {
      dispatch({ type: "SET_ENTRIES", payload: nextEntries });
    });

    return unsubscribe;
  }, [user, dispatch]);

  const handleSave = async () => {
    if (!user) return;
    if (!text.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createEntry(user.uid, text);
      dispatch({
        type: "ADD_ENTRY",
        payload: {
          id: `temp-${Date.now()}`,
          text,
          summary: `${text.split(/\s+/).filter(Boolean).length} palabras`,
          createdAt: new Date(),
        } as Entry,
      });
      setText("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo guardar el análisis.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const totalEntries = entries.length;
  const userLevel = Math.max(
    currentUser?.level || 1,
    Math.min(
      LEVELS[LEVELS.length - 1].order,
      LEVELS.reduce(
        (acc, level) => (totalEntries >= level.requirement ? level.order : acc),
        1
      )
    )
  );

  const nextLevel =
    LEVELS.find((lvl) => lvl.order === userLevel + 1) ??
    LEVELS[LEVELS.length - 1];
  const remainingForNext = Math.max(0, nextLevel.requirement - totalEntries);

  const activeStage =
    LEARNING_STAGES[
      Math.max(Math.min(userLevel, LEARNING_STAGES.length), 1) - 1
    ] ?? LEARNING_STAGES[0];

  const hasEntries = entries.length > 0;

  const recentEntries = entries.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.topMenu}>
            <View style={styles.levelContainer}>
              <Text style={styles.levelLabel}>
                {currentUser
                  ? `${currentUser.firstName} ${currentUser.lastName}`
                  : "Gramálisis"}
              </Text>
              <Text style={styles.levelHelper}>
                Juega a descubrir patrones morfológicos en cada texto que
                escribas.
              </Text>
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
                {currentUser?.photoUrl ? (
                  <Image
                    source={{ uri: currentUser.photoUrl }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarInitial}>
                    {currentUser?.firstName?.charAt(0).toUpperCase() ??
                      currentUser?.username?.charAt(0).toUpperCase() ??
                      "G"}
                  </Text>
                )}
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.levelSection}>
            {LEARNING_STAGES.map((stage) => {
              const unlocked = totalEntries >= stage.unlockRequirement;
              const progressPercent =
                stage.unlockRequirement > 0
                  ? Math.min(
                      (totalEntries / stage.unlockRequirement) * 100,
                      100
                    )
                  : 100;
              return (
                <Pressable
                  key={stage.id}
                  disabled={!unlocked}
                  onPress={() => router.push("/sublevels")}
                  style={({ pressed }) => [
                    styles.stageCard,
                    !unlocked && styles.stageCardLocked,
                    pressed && unlocked && styles.stageCardPressed,
                    {
                      borderColor: unlocked ? stage.accent : "#e5e7eb",
                    },
                  ]}
                >
                  <View style={styles.stageHeader}>
                    <Text
                      style={[
                        styles.stageIcon,
                        { color: unlocked ? stage.accent : "#6b7280" },
                      ]}
                    >
                      {stage.icon}
                    </Text>
                    <Text
                      style={[styles.stageBadge, { borderColor: stage.accent }]}
                    >
                      {stage.levelTag}
                    </Text>
                  </View>
                  <Text style={styles.stageTitle}>{stage.title}</Text>
                  <Text style={styles.stageFocus}>{stage.focus}</Text>
                  <Text style={styles.stageDescription}>
                    {stage.description}
                  </Text>
                  <View style={styles.stageProgress}>
                    <View
                      style={[
                        styles.stageProgressFill,
                        {
                          width: `${progressPercent}%`,
                          backgroundColor: stage.accent,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.stageFooter}>
                    <Text style={styles.stageFooterText}>
                      {unlocked
                        ? "Listo para jugar"
                        : `Faltan ${Math.max(
                            0,
                            stage.unlockRequirement - totalEntries
                          )} textos`}
                    </Text>
                    <Text style={styles.stageChevron}>
                      {unlocked ? "▶" : "🔒"}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f9ff",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  topMenu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  levelContainer: {
    flex: 1,
    marginRight: 12,
  },
  levelLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1d2b74",
    marginBottom: 4,
  },
  levelHelper: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: "row",
  },
  star: {
    fontSize: 18,
    marginRight: 4,
  },
  starActive: {
    color: "#fbbf24",
  },
  starInactive: {
    color: "#dbe4ff",
  },
  avatarButton: {
    height: 52,
    width: 52,
    borderRadius: 26,
    backgroundColor: "#1d2b74",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  avatarImage: {
    height: "100%",
    width: "100%",
  },
  heroCard: {
    backgroundColor: "#0f172a",
    borderRadius: 24,
    padding: 18,
    marginBottom: 8,
    shadowColor: "#0f172a",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(59,130,246,0.2)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: "#c7d2fe",
    fontSize: 12,
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
  },
  heroDescription: {
    marginTop: 8,
    fontSize: 15,
    color: "#e0e7ff",
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  statCard: {
    flexBasis: "32%",
    minWidth: 140,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    padding: 14,
    marginBottom: 12,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginVertical: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
  },
  levelSection: {
    marginTop: 4,
    marginBottom: 4,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1d2b74",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#475569",
  },
  stageCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  stageCardLocked: {
    backgroundColor: "#f1f5f9",
  },
  stageCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  stageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stageIcon: {
    fontSize: 26,
  },
  stageBadge: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "#e0f2fe",
    fontSize: 12,
    fontWeight: "700",
    color: "#1d2b74",
  },
  stageTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#1d2b74",
  },
  stageFocus: {
    marginTop: 4,
    fontSize: 13,
    color: "#475569",
  },
  stageDescription: {
    marginTop: 6,
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  stageProgress: {
    height: 6,
    borderRadius: 4,
    backgroundColor: "#e2e8f0",
    marginTop: 10,
    overflow: "hidden",
  },
  stageProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  stageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  stageFooterText: {
    fontSize: 12,
    color: "#475569",
  },
  stageChevron: {
    fontSize: 14,
    color: "#475569",
  },
  editorCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e5edff",
    backgroundColor: "#f3f7ff",
    padding: 18,
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1d2b74",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#475569",
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
    marginTop: 12,
  },
  historySection: {
    marginTop: 20,
    marginBottom: 40,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  entryCard: {
    marginTop: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5edff",
    backgroundColor: "#ffffff",
    padding: 16,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  entryText: {
    fontSize: 16,
    color: "#0f172a",
    marginBottom: 8,
  },
  entryMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entrySummary: {
    fontSize: 12,
    color: "#2a3dba",
  },
  entryDate: {
    fontSize: 12,
    color: "#94a3b8",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
});
