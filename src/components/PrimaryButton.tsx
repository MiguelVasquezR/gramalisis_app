import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import COLORS from "../theme/colors";

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

export const PrimaryButton = ({
  label,
  onPress,
  loading,
  variant = "primary",
  disabled,
}: Props) => {
  const buttonStyles = [
    styles.button,
    variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary,
    (disabled || loading) && styles.buttonDisabled,
  ];

  const textStyles = [
    styles.label,
    variant === "primary" ? styles.labelPrimary : styles.labelSecondary,
  ];

  return (
    <Pressable
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? COLORS.WHITE : COLORS.BLUE}
        />
      ) : (
        <Text style={textStyles}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  buttonPrimary: {
    backgroundColor: COLORS.BLUE,
    shadowColor: COLORS.BLUE,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BLUE,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  labelPrimary: {
    color: COLORS.WHITE,
  },
  labelSecondary: {
    color: COLORS.BLUE,
  },
});
