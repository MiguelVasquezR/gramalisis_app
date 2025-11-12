import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import HeaderBar from "../components/HeaderBar";
import COLORS from "../theme/colors";
import { PrimaryButton } from "../components/PrimaryButton";
import {
  reloadCurrentUser,
  sendVerificationEmail,
  logout,
} from "../firebase/authService";
import { auth } from "../firebase/firebase";
import { useToastMessage } from "../hooks/useToastMessage";
import { sendEmailVerification } from "firebase/auth";

export const VerifyEmailScreen = () => {
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const { showError, showSuccess } = useToastMessage();
  const email = auth.currentUser?.email ?? "tu correo";

  const handleResend = async () => {
    if (resending) return;
    setResending(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        showError("No hay usuario autenticado.");
        return;
      }

      const actionCodeSettings = {
        handleCodeInApp: true,
        url: "http://localhost.com",
      };

      await sendEmailVerification(user);

      showSuccess("Correo de verificación reenviado correctamente.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No pudimos reenviar el correo. Intenta nuevamente.";
      showError(message);
    } finally {
      setResending(false);
    }
  };

  const handleAlreadyVerified = async () => {
    setChecking(true);
    try {
      const user = await reloadCurrentUser();
      if (user?.emailVerified) {
        showSuccess("¡Gracias! Tu correo fue verificado.");
        router.replace("/home");
        return;
      }
      showError("Aún no detectamos la verificación. Intenta de nuevo.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No pudimos comprobar tu cuenta. Intenta nuevamente.";
      showError(message);
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <HeaderBar showBack={false} />

        <View style={styles.card}>
          <Text style={styles.title}>Confirma tu correo</Text>
          <Text style={styles.body}>
            Enviamos un enlace de verificación a{" "}
            <Text style={styles.email}>{email}</Text>. Abre tu bandeja de
            entrada y confirma tu cuenta para continuar.
          </Text>

          <PrimaryButton
            label="Ya verifiqué mi cuenta"
            onPress={handleAlreadyVerified}
            loading={checking}
          />

          <PrimaryButton
            label="Reenviar correo"
            variant="secondary"
            onPress={handleResend}
            loading={resending}
            disabled={checking}
          />

          <Pressable style={styles.altAction} onPress={handleLogout}>
            <Text style={styles.altActionLabel}>
              Usar otra cuenta / cerrar sesión
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyEmailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: COLORS.WHITE,
  },
  card: {
    marginTop: 32,
    borderRadius: 32,
    backgroundColor: COLORS.WHITE,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.BLUE_100,
    shadowColor: COLORS.BLUE,
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.BLUE,
  },
  body: {
    fontSize: 16,
    color: COLORS.GRAY_TEXT,
    lineHeight: 22,
  },
  email: {
    color: COLORS.BLUE,
    fontWeight: "700",
  },
  altAction: {
    marginTop: 12,
    alignItems: "center",
  },
  altActionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.BLUE,
  },
});
