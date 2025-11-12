import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
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
import { LEVELS, LEVEL_GROUPS } from "../const/levels";
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

  const handleLogout = async () => {
    await signOutFromApp();
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
  const avatarLetter =
    currentUser?.firstName?.charAt(0).toUpperCase() ??
    currentUser?.username?.charAt(0).toUpperCase() ??
    user?.email?.charAt(0).toUpperCase() ??
    "U";

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
                  <Text style={styles.avatarInitial}>{avatarLetter}</Text>
                )}
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.levelsSection}>
            {LEVEL_GROUPS.map((group) => (
              <View key={group.id} style={styles.levelGroup}>
                <Text style={styles.sectionTitle}>{group.title}</Text>
                <Text style={styles.sectionSubtitle}>{group.description}</Text>

                <View style={styles.levelsGrid}>
                  {group.sublevels.map((level) => {
                    const unlocked = totalEntries >= level.requirement;
                    const isCurrent = userLevel === level.order;
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
                          <Text style={styles.levelIcon}>{level.icon}</Text>
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
                                ? "Nivel en curso"
                                : "Desbloqueado"
                              : "Bloqueado"}
                          </Text>
                        </View>
                        <Text style={styles.levelTitle}>
                          {level.order}. {level.title}
                        </Text>
                        <Text style={styles.levelDescription}>
                          {level.description}
                        </Text>
                        <Text style={styles.levelRequirement}>
                          {Math.min(totalEntries, level.requirement)}/
                          {level.requirement} lecciones
                        </Text>
                        <PrimaryButton
                          label={unlocked ? "Revisar" : "Completa más"}
                          onPress={() => {}}
                          disabled={!unlocked}
                          variant={unlocked ? "primary" : "secondary"}
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
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
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 48,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  topMenu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  levelContainer: {
    flex: 1,
    marginRight: 16,
  },
  levelLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1d2b74",
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
  },
  star: {
    fontSize: 18,
  },
  starActive: {
    color: "#fbbf24",
  },
  starInactive: {
    color: "#dbe4ff",
  },
  levelHelper: {
    marginTop: 8,
    fontSize: 13,
    color: "#64748b",
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
  levelsSection: {
    gap: 24,
  },
  levelGroup: {
    gap: 16,
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
  levelsGrid: {
    gap: 16,
  },
  levelCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e5edff",
    backgroundColor: "#f8faff",
    padding: 16,
    gap: 8,
  },
  levelCardUnlocked: {
    backgroundColor: "#ffffff",
    borderColor: "#c3d3ff",
  },
  levelCardCurrent: {
    borderColor: "#364fe6",
    shadowColor: "rgba(54,79,230,0.15)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelIcon: {
    fontSize: 24,
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
  editorCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e5edff",
    backgroundColor: "#f3f7ff",
    padding: 16,
    marginTop: 32,
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
  historySection: {
    marginTop: 32,
    gap: 12,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e5edff",
    backgroundColor: "#ffffff",
    padding: 16,
    gap: 8,
  },
  entryText: {
    fontSize: 16,
    color: "#0f172a",
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
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 15,
    color: "#94a3b8",
    textAlign: "center",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  solidButton: {
    backgroundColor: "#364fe6",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#e5edff",
    backgroundColor: "#ffffff",
  },
  actionText: {
    fontSize: 15,
    fontWeight: "600",
  },
  solidText: {
    color: "#ffffff",
  },
  outlineText: {
    color: "#1d2b74",
  },
});
