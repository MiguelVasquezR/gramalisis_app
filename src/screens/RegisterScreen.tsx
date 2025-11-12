import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";

type InputBlockProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
};

const InputBlock = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  style,
}: InputBlockProps) => (
  <View style={[styles.inputBlock, style]}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#a1a1aa"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

export const RegisterScreen = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [occupation, setOccupation] = useState("");
  const [password, setPassword] = useState("");

  const showBack = router.canGoBack();

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
              onPress={() => showBack && router.back()}
            >
              <Text
                style={showBack ? styles.backLabel : styles.backLabelDisabled}
              >
                {"‹"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Crea una cuenta!</Text>
              <Text style={styles.subtitle}>
                Ingresa los siguientes datos, por favor.
              </Text>
            </View>

            <View>
              <View style={styles.row}>
                <InputBlock
                  label="Nombre"
                  placeholder="John"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={[styles.inputHalf, styles.inputHalfSpacing]}
                />
                <InputBlock
                  label="Apellido(s)"
                  placeholder="Doe"
                  value={lastName}
                  onChangeText={setLastName}
                  style={styles.inputHalf}
                />
              </View>

              <InputBlock
                label="Fecha de nacimiento"
                placeholder="DD/MM/YYYY"
                value={birthDate}
                onChangeText={setBirthDate}
              />

              <InputBlock
                label="Ocupación"
                placeholder="e.j. Estudiante"
                value={occupation}
                onChangeText={setOccupation}
              />

              <InputBlock
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.actions}>
              <Pressable style={styles.submitButton}>
                <Text style={styles.submitLabel}>Crear cuenta</Text>
              </Pressable>

              <Pressable onPress={() => router.replace("/login")}>
                <Text style={styles.link}>Ya tienes cuenta? Inicia sesión</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputBlock: {
    marginBottom: 16,
    flex: 1,
  },
  inputHalf: {
    flex: 1,
  },
  inputHalfSpacing: {
    marginRight: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
  },
  input: {
    borderRadius: 16,
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#0f172a",
  },
  actions: {
    marginTop: 32,
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
  submitLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  link: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#5a46ff",
  },
});
