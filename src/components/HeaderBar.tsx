import { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";

type HeaderBarProps = {
  showBack?: boolean;
  rightSlot?: ReactNode;
  onBack?: () => void;
  style?: StyleProp<ViewStyle>;
};

export const HeaderBar = ({
  showBack = true,
  rightSlot,
  onBack,
  style,
}: HeaderBarProps) => {
  const router = useRouter();
  const canGoBack = router.canGoBack();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (canGoBack) {
      router.back();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {showBack ? (
        <TouchableOpacity
          style={[
            styles.backButton,
            !canGoBack && !onBack ? styles.backButtonDisabled : null,
          ]}
          onPress={handleBack}
          disabled={!canGoBack && !onBack}
          accessibilityRole="button"
          accessibilityLabel="Regresar"
        >
          <Text style={styles.backLabel}>‹</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.backPlaceholder} />
      )}

      <View style={styles.rightContent}>{rightSlot}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 24,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  backButtonDisabled: {
    opacity: 0.5,
  },
  backPlaceholder: {
    width: 40,
    height: 40,
  },
  backLabel: {
    fontSize: 28,
    color: "#0f172a",
  },
  rightContent: {
    flex: 1,
    alignItems: "flex-end",
  },
});

export default HeaderBar;
