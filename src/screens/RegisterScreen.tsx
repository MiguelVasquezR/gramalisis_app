import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  KeyboardTypeOptions,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { register } from "../firebase/authService";
import { writeData } from "../firebase/dbService";
import HeaderBar from "../components/HeaderBar";
import COLORS from "../theme/colors";

type InputBlockProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoComplete?: TextInputProps["autoComplete"];
  textContentType?: TextInputProps["textContentType"];
};

const InputBlock = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  style,
  keyboardType,
  autoCapitalize,
  autoComplete,
  textContentType,
}: InputBlockProps) => (
  <View style={[styles.inputBlock, style]}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={COLORS.GRAY_TEXT}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
      textContentType={textContentType}
    />
  </View>
);

type DatePickerBlockProps = {
  label: string;
  value: Date | null;
  onPress: () => void;
};

const DatePickerBlock = ({ label, value, onPress }: DatePickerBlockProps) => {
  const displayValue = value
    ? value.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "DD/MM/YYYY";

  return (
    <View style={styles.inputBlock}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Pressable style={styles.dateTrigger} onPress={onPress}>
        <Text style={value ? styles.dateValue : styles.datePlaceholder}>
          {displayValue}
        </Text>
      </Pressable>
    </View>
  );
};

export const RegisterScreen = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [occupation, setOccupation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [iosPickerDate, setIosPickerDate] = useState(new Date(2000, 0, 1));
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBirthDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (event.type === "dismissed") {
      return;
    }

    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const showBirthDatePicker = () => {
    const pickerValue = birthDate ?? new Date(2000, 0, 1);

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: pickerValue,
        mode: "date",
        maximumDate: new Date(),
        onChange: handleBirthDateChange,
      });
      return;
    }

    setIosPickerDate(pickerValue);
    setDatePickerVisible(true);
  };

  const handleIosPickerChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (selectedDate) {
      setIosPickerDate(selectedDate);
    }
  };

  const hideIosPicker = () => setDatePickerVisible(false);

  const confirmIosPicker = () => {
    setBirthDate(iosPickerDate);
    hideIosPicker();
  };

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleCreateAccount = async () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedOccupation = occupation.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !birthDate ||
      !trimmedOccupation ||
      !trimmedEmail ||
      !trimmedPassword
    ) {
      setError("Por favor completa todos los campos.");
      setStatus(null);
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Ingresa un correo electrónico válido.");
      setStatus(null);
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setStatus(null);
      return;
    }

    setError(null);
    setStatus(null);
    setLoading(true);

    try {
      const registerResponse = await register(trimmedEmail, trimmedPassword);

      if (registerResponse.status !== 200 || !registerResponse.uid) {
        setError(registerResponse.message ?? "No pudimos crear tu cuenta.");
        return;
      }

      const userProfile = {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        job: trimmedOccupation,
        username: trimmedEmail,
        password: trimmedPassword,
        uid: registerResponse.uid,
        dateBirth: birthDate.toISOString(),
        photoUrl: "",
        level: 1,
        joined: new Date().toISOString(),
      };

      const result = await writeData("USERS", userProfile);

      if (result !== 200) {
        setError("No pudimos guardar tu información. Intenta nuevamente.");
        return;
      }

      setStatus("Cuenta creada correctamente 🎉");
      router.replace("/home");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Ocurrió un error al crear tu cuenta.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
          <HeaderBar />

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

              <DatePickerBlock
                label="Fecha de nacimiento"
                value={birthDate}
                onPress={showBirthDatePicker}
              />

              <InputBlock
                label="Ocupación"
                placeholder="e.j. Estudiante"
                value={occupation}
                onChangeText={setOccupation}
              />

              <InputBlock
                label="Correo electrónico"
                placeholder="correo@ejemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />

              <InputBlock
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType="password"
              />
            </View>

            <View style={styles.actions}>
              {error && <Text style={styles.errorText}>{error}</Text>}
              {status && <Text style={styles.statusText}>{status}</Text>}

              <Pressable
                style={[
                  styles.submitButton,
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handleCreateAccount}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.submitLabel}>Crear cuenta</Text>
                )}
              </Pressable>

              <Pressable onPress={() => router.replace("/login")}>
                <Text style={styles.link}>Ya tienes cuenta? Inicia sesión</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {Platform.OS === "ios" && (
        <Modal
          visible={isDatePickerVisible}
          transparent
          animationType="slide"
          onRequestClose={hideIosPicker}
        >
          <View style={styles.dateModalOverlay}>
            <View style={styles.dateModal}>
              <View style={styles.dateModalActions}>
                <Pressable onPress={hideIosPicker}>
                  <Text style={styles.dateModalActionText}>Cancelar</Text>
                </Pressable>
                <Pressable onPress={confirmIosPicker}>
                  <Text
                    style={[
                      styles.dateModalActionText,
                      styles.dateModalActionPrimary,
                    ]}
                  >
                    Listo
                  </Text>
                </Pressable>
              </View>

              <DateTimePicker
                value={iosPickerDate}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                locale="es-MX"
                onChange={handleIosPickerChange}
                style={styles.iosDatePicker}
              />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
    color: COLORS.BLUE,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.GRAY_TEXT,
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
    color: COLORS.BLUE,
    marginBottom: 8,
  },
  input: {
    borderRadius: 16,
    backgroundColor: COLORS.BLUE_100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.BLACK,
    borderWidth: 1,
    borderColor: COLORS.BLUE_200,
  },
  dateTrigger: {
    borderRadius: 16,
    backgroundColor: COLORS.BLUE_100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.BLUE_200,
  },
  dateValue: {
    fontSize: 16,
    color: COLORS.BLACK,
  },
  datePlaceholder: {
    fontSize: 16,
    color: COLORS.GRAY_TEXT,
  },
  actions: {
    marginTop: 32,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.BLUE,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.GREEN,
    marginBottom: 8,
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
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
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
  link: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.BLUE,
  },
  dateModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  dateModal: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 24,
  },
  dateModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dateModalActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.GRAY_TEXT,
  },
  dateModalActionPrimary: {
    color: COLORS.BLUE,
  },
  iosDatePicker: {
    backgroundColor: "#ffffff",
  },
});
