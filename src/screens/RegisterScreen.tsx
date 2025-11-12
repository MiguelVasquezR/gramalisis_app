import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
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
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

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
  dateTrigger: {
    borderRadius: 16,
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
  },
  dateValue: {
    fontSize: 16,
    color: "#0f172a",
  },
  datePlaceholder: {
    fontSize: 16,
    color: "#a1a1aa",
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
    color: "#6b7280",
  },
  dateModalActionPrimary: {
    color: "#5a46ff",
  },
  iosDatePicker: {
    backgroundColor: "#ffffff",
  },
});
