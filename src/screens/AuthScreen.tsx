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

type AuthMode = "login" | "forgot";

export const AuthScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const isForgotMode = mode === "forgot";

  const handleLoginSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Por favor completa correo y contraseña.");
      return;
    }

    setError(null);
    setStatus(null);
    setLoading(true);
    try {
      const response = await login(trimmedEmail, trimmedPassword);

      if (!response.ok) {
        setError(response.message);
        return;
      }

      setStatus(response.message);
      router.replace("/home");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Algo salió mal. Intenta nuevamente.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Por favor ingresa un correo válido.");
      return;
    }

    setError(null);
    setStatus(null);
    setLoading(true);

    try {
      const response = await resetPassword(trimmedEmail);

      if (!response.ok) {
        setError(response.message);
        return;
      }

      setStatus(response.message);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Algo salió mal. Intenta nuevamente.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    if (mode === nextMode) return;

    setMode(nextMode);
    setError(null);
    setStatus(null);

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

  const showBack = router.canGoBack();
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
          <View style={styles.topBar}>
            <Pressable
              style={[
                styles.backButton,
                !showBack && styles.backButtonDisabled,
              ]}
              disabled={!showBack}
              onPress={() => {
                if (showBack) {
                  router.back();
                }
              }}
            >
              <Text
                style={showBack ? styles.backLabel : styles.backLabelDisabled}
              >
                {"‹"}
              </Text>
            </Pressable>
          </View>

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
                  placeholderTextColor="#94a3b8"
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
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              )}

              {error ? <Text style={styles.error}>{error}</Text> : null}
              {status ? <Text style={styles.status}>{status}</Text> : null}

              <Pressable
                style={[
                  styles.submitButton,
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
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
                  onPress={() => router.push("/registry")}
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
    backgroundColor: "#ffffff",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonDisabled: {
    backgroundColor: "transparent",
  },
  backLabel: {
    fontSize: 30,
    color: "#5d3fd3",
    fontWeight: "500",
  },
  backLabelDisabled: {
    fontSize: 30,
    color: "#d1d5db",
    fontWeight: "500",
  },
  illustrationWrapper: {
    paddingHorizontal: 24,
    marginTop: 8,
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
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
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
    color: "#9ca3af",
    marginBottom: 8,
  },
  fieldInput: {
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
    paddingBottom: 12,
    fontSize: 18,
    color: "#0f172a",
  },
  error: {
    fontSize: 14,
    color: "#ef4444",
  },
  status: {
    fontSize: 14,
    color: "#16a34a",
    marginTop: 8,
  },
  submitButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#5a46ff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
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
    color: "#5a46ff",
  },
});
