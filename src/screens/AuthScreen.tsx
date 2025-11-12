import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { login, resetPassword } from "../firebase/authService";
import { URL_IMAGE_MAIN } from "../const/index";
import HeaderBar from "../components/HeaderBar";
import COLORS from "../theme/colors";
import { useToastMessage } from "../hooks/useToastMessage";

type AuthMode = "login" | "forgot";

export const AuthScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const { showError, showSuccess } = useToastMessage();

  const isForgotMode = mode === "forgot";

  const handleLoginSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      showError("Por favor completa correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const response = await login(trimmedEmail, trimmedPassword);

      if (response.requiresVerification) {
        showError(response.message);
        return;
      }

      if (!response.ok) {
        showError(response.message);
        return;
      }

      showSuccess(response.message);
      router.replace("/home");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Algo salió mal. Intenta nuevamente.";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      showError("Por favor ingresa un correo válido.");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(trimmedEmail);

      if (!response.ok) {
        showError(response.message);
        return;
      }

      showSuccess(response.message);
      router.replace("/login");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Algo salió mal. Intenta nuevamente.";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    if (mode === nextMode) return;

    setMode(nextMode);

    if (nextMode === "forgot") {
      setPassword("");
    }
  };

  const handleSubmit = async () => {
    if (isForgotMode) {
      await handleForgotSubmit();
      return;
    }

    await handleLoginSubmit();
  };

  const title = isForgotMode ? "Olvidaste tu contraseña?" : "Bienvenido!";
  const subtitle = isForgotMode
    ? "Ingresa tu correo y te enviaremos las intrucciones."
    : "Ingresa tus datos en la parte inferior!";
  const submitLabel = isForgotMode ? "Enviar" : "Iniciar Sesión";

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={24}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <HeaderBar showBack={false} />

          <View style={styles.illustrationWrapper}>
            <Image
              source={{ uri: URL_IMAGE_MAIN }}
              style={styles.illustration}
              resizeMode="cover"
            />
          </View>

          <View style={styles.content}>
            <View style={styles.heading}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="youremail@gmail.com"
                  placeholderTextColor={COLORS.GRAY_TEXT}
                />
              </View>

              {!isForgotMode && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <TextInput
                    style={styles.fieldInput}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.GRAY_TEXT}
                  />
                </View>
              )}

              <Pressable
                style={[
                  styles.submitButton,
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.WHITE} />
                ) : (
                  <Text style={styles.submitLabel}>{submitLabel}</Text>
                )}
              </Pressable>

              <View style={styles.linkGroup}>
                <Pressable
                  onPress={() => switchMode(isForgotMode ? "login" : "forgot")}
                  style={styles.linkButton}
                >
                  <Text style={styles.link}>
                    {isForgotMode
                      ? "Tienes cuenta? Inicia sesión"
                      : "¿Olvidaste tu contraseña?"}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => router.replace("/registry")}
                  style={styles.linkButton}
                >
                  <Text style={styles.link}>No tienes cuenta? Registrate</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.WHITE,
  },
  illustrationWrapper: {
    paddingHorizontal: 24,
    marginTop: 8,
    backgroundColor: COLORS.BLUE_100,
    borderRadius: 24,
    marginHorizontal: 16,
  },
  illustration: {
    width: "100%",
    height: 256,
    borderRadius: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 64,
  },
  heading: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.BLUE,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.GRAY_TEXT,
  },
  form: {
    marginTop: 8,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLORS.BLUE,
    marginBottom: 8,
  },
  fieldInput: {
    borderBottomWidth: 1,
    borderColor: COLORS.BLUE_200,
    paddingBottom: 12,
    fontSize: 18,
    color: COLORS.BLACK,
  },
  submitButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 16,
    shadowColor: COLORS.BLUE,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.WHITE,
  },
  linkGroup: {
    marginTop: 12,
  },
  linkButton: {
    marginTop: 4,
    marginBottom: 8,
  },
  link: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.BLUE,
  },
});
