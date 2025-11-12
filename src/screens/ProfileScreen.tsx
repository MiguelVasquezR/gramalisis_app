import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../lib/auth";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAppSelector } from "../store/AppStore";
import { buildFullName } from "../utils/utils";

const CardRow = ({ icon, label }: { icon: string; label: string }) => (
  <View style={styles.cardRow}>
    <Text style={styles.cardRowIcon}>{icon}</Text>
    <Text style={styles.cardRowText}>{label}</Text>
  </View>
);

export const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const currentUser = useAppSelector((selector) => selector.currentUser);
  const [menuVisible, setMenuVisible] = useState(false);

  const name = buildFullName(
    currentUser?.firstName || "",
    currentUser?.lastName || ""
  );
  const email = currentUser?.username ?? user?.email ?? "example@gmail.com";
  const joined = "Joined August 17, 2023";
  const photo = currentUser?.photoUrl ?? user?.photoURL ?? null;
  const job = currentUser?.job ?? "Ocupación";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () =>
    Alert.alert("Cerrar sesión", "¿Seguro que deseas salir de tu cuenta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/login");
        },
      },
    ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backLabel}>‹</Text>
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setMenuVisible((prev) => !prev)}
            >
              <Text style={styles.menuButtonLabel}>⋮</Text>
            </TouchableOpacity>
            {menuVisible ? (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setMenuVisible(false);
                    router.push("/profile/edit");
                  }}
                >
                  <Text style={styles.dropdownText}>Editar usuario</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.avatarWrapper}>
            {photo ? (
              <Image
                source={{ uri: photo }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {name
                    .split(" ")
                    .map((part) => part.charAt(0))
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.joined}>{joined}</Text>
        </View>

        <View style={styles.cards}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Información</Text>
            <CardRow icon="👤" label={name} />
            <View style={styles.divider} />
            <CardRow icon="✉️" label={email} />
            <View style={styles.divider} />
            <CardRow icon="🧑‍💻" label={job} />
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="Cerrar sesión" onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backLabel: {
    fontSize: 28,
    color: "#0f172a",
  },
  menuButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#f4f4f5",
    alignItems: "center",
    justifyContent: "center",
  },
  menuButtonLabel: {
    fontSize: 24,
    color: "#0f172a",
  },
  dropdown: {
    position: "absolute",
    top: 48,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: "rgba(0,0,0,0.15)",
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dropdownItem: {
    paddingVertical: 8,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1d2b74",
  },
  hero: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  avatarWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#f4f0ff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 48,
    fontWeight: "700",
    color: "#7a5af8",
  },
  name: {
    marginTop: 24,
    fontSize: 30,
    fontWeight: "700",
    color: "#0f172a",
  },
  joined: {
    marginTop: 4,
    fontSize: 16,
    color: "#6b7280",
  },
  cards: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 20,
    shadowColor: "rgba(0,0,0,0.03)",
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#e4e4e7",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  cardRowIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  cardRowText: {
    fontSize: 16,
    color: "#0f172a",
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
});
