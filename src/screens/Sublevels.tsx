import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppSelector } from "../store/AppStore";
import { LEARNING_STAGES } from "../const/stages";

const PATH_STAGES = [
  {
    id: "grammar",
    order: 1,
    title: "Gramática",
    subtitle: "Identifica raíces, flexiones y patrones.",
    icon: "📘",
  },
  {
    id: "exercise",
    order: 2,
    title: "Ejercicio",
    subtitle: "Aplica las reglas con ejemplos guiados.",
    icon: "📝",
  },
];

const Sublevels = () => {
  const router = useRouter();
  const entries = useAppSelector((state) => state.entries);
  const totalEntries = entries.length;
  const lives = 5;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.statusBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pathWrapper}>
          <View style={styles.pathLine} />
          {PATH_STAGES.map((stage, idx) => {
            const stageData = LEARNING_STAGES.find(
              (lvl) => lvl.order === stage.order
            );
            const unlocked =
              totalEntries >= (stageData?.unlockRequirement ?? 0);
            const alignment =
              idx === 0 ? styles.nodeRowStart : styles.nodeRowEnd;
            return (
              <Pressable
                key={stage.id}
                disabled={!unlocked}
                onPress={() =>
                  router.push({
                    pathname: "/games/Memories",
                    params: { level: `${stage.order}` },
                  })
                }
                style={[styles.nodeRow, alignment]}
              >
                <View
                  style={[
                    styles.nodeCircle,
                    unlocked
                      ? styles.nodeCircleActive
                      : styles.nodeCircleLocked,
                  ]}
                >
                  <Text style={styles.nodeIcon}>{stage.icon}</Text>
                </View>
                <View
                  style={[
                    styles.nodeCard,
                    { borderColor: stageData?.accent ?? "#cbd5f5" },
                    !unlocked && styles.nodeCardDisabled,
                  ]}
                >
                  <Text style={styles.nodeTitle}>{stage.title}</Text>
                  <Text style={styles.nodeSubtitle}>{stage.subtitle}</Text>
                  {!unlocked && (
                    <Text style={styles.lockText}>
                      Faltan{" "}
                      {Math.max(
                        0,
                        (stageData?.unlockRequirement ?? 0) - totalEntries
                      )}{" "}
                      textos
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Sublevels;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#e0f2fe",
  },
  backText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1d4ed8",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroPanel: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 24,
    marginBottom: 28,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  heroSection: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: "#dbeafe",
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 8,
    color: "#f8fafc",
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#f0f9ff",
    lineHeight: 20,
  },
  pathWrapper: {
    position: "relative",
  },
  pathLine: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#e0f2fe",
    transform: [{ translateX: -2 }],
  },
  nodeRow: {
    marginVertical: 30,
    width: "100%",
    alignItems: "center",
  },
  nodeRowStart: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  nodeRowEnd: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  nodeCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#94a3b8",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    shadowColor: "#0f172a",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  nodeCircleActive: {
    borderColor: "#0ea5e9",
    backgroundColor: "#0ea5e9",
  },
  nodeCircleLocked: {
    opacity: 0.6,
  },
  nodeIcon: {
    fontSize: 32,
  },
  nodeCard: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
    backgroundColor: "#ffffff",
    minWidth: 160,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  nodeCardDisabled: {
    backgroundColor: "#e2e8f0",
  },
  nodeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  nodeSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#475569",
  },
  lockText: {
    marginTop: 8,
    fontSize: 12,
    color: "#ef4444",
    fontWeight: "600",
  },
});
