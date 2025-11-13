import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import CardMemory from "../../components/CardMemory";
import { PrimaryButton } from "../../components/PrimaryButton";
import COLORS from "../../theme/colors";

const placeholderDeck = [
  { id: "card-1", value: "Texto", isActive: false, response: "" },
  { id: "card-2", value: "Texto", isActive: false, response: "" },
  { id: "card-3", value: "Sintaxis", isActive: true, response: "" },
  { id: "card-4", value: "Sintaxis", isActive: false, response: "" },
  { id: "card-5", value: "Vocabulario", isActive: false, response: "Vocabulario" },
  { id: "card-6", value: "Vocabulario", isActive: false, response: "Vocabulario" },
  { id: "card-7", value: "Ritmo", isActive: false, response: "" },
  { id: "card-8", value: "Ritmo", isActive: false, response: "" },
];

const Memories = () => {
  const matchedCards = placeholderDeck.filter(
    (card) => card.response === card.value && card.response.length > 0
  ).length;
  const totalPairs = placeholderDeck.length / 2;
  const pairsFound = Math.floor(matchedCards / 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.label}>Gramálisis</Text>
          <Text style={styles.title}>Memorama</Text>
          <Text style={styles.subtitle}>
            Encuentra los pares correctos y haz que el logo aparezca cuando ganes.
          </Text>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Pares descubiertos</Text>
          <Text style={styles.statusValue}>
            {pairsFound}/{totalPairs}
          </Text>
          <Text style={styles.statusHint}>
            Cada pareja correcta se queda descubierta para ayudarte a memorizar.
          </Text>
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Cómo jugar</Text>
          <Text style={styles.instructionsText}>
            Toca dos cartas para voltearlas. Si coinciden se mantendrán arriba y
            mostrarán el logo, si no, volverán a tapar y podrás intentarlo otra vez.
          </Text>
        </View>

        <View style={styles.grid}>
          {placeholderDeck.map((card) => (
            <CardMemory
              key={card.id}
              isActive={card.isActive}
              value={card.value}
              response={card.response}
            />
          ))}
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Reiniciar vista" onPress={() => {}} />
          <View style={styles.secondaryButton}>
            <PrimaryButton
              label="Ver reglas rápidas"
              variant="secondary"
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Memories;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f8ff",
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  headerSection: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: "600",
    color: COLORS.BLUE,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: COLORS.BLUE_800,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.GRAY_TEXT,
    marginTop: 6,
    lineHeight: 22,
  },
  statusCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.GRAY_BORDER,
    padding: 18,
    shadowColor: "rgba(15, 23, 42, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.GRAY_TEXT,
  },
  statusValue: {
    marginTop: 8,
    fontSize: 36,
    fontWeight: "700",
    color: COLORS.BLUE_800,
  },
  statusHint: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
    lineHeight: 20,
  },
  instructionsCard: {
    backgroundColor: "#dee5ff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.BLUE_800,
  },
  instructionsText: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.GRAY_TEXT,
    lineHeight: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 12,
  },
  actions: {
    marginTop: 8,
  },
  secondaryButton: {
    marginTop: 12,
  },
});
