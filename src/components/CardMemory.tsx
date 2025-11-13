import { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";
import { URL_IMAGE_MAIN } from "../const/index";

interface CMProps {
  isActive: boolean;
  value: string;
  response: string;
}

const CardMemory = ({ isActive, value, response }: CMProps) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const isDiscovered = response === value && response.length > 0;
  const shouldFlip = isActive || isDiscovered;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: shouldFlip ? 180 : 0,
      duration: 450,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [rotation, shouldFlip]);

  const frontRotation = rotation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });
  const backRotation = rotation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const frontContent = isDiscovered ? (
    <Image
      source={{ uri: URL_IMAGE_MAIN }}
      style={styles.matchImage}
      resizeMode="cover"
    />
  ) : (
    <Text style={styles.valueText}>{value}</Text>
  );

  return (
    <View style={styles.flipContainer}>
      <Animated.View
        style={[
          styles.cardFace,
          styles.cardBack,
          { transform: [{ rotateY: backRotation }] },
        ]}
      >
        <Text style={styles.cardBackLabel}>Gram</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.cardFace,
          styles.cardFront,
          { transform: [{ rotateY: frontRotation }] },
        ]}
      >
        {frontContent}
      </Animated.View>
    </View>
  );
};

export default CardMemory;

const styles = StyleSheet.create({
  flipContainer: {
    width: 140,
    height: 180,
    margin: 8,
    perspective: 1400,
  },
  cardFace: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0f172a",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    backfaceVisibility: "hidden",
  },
  cardBack: {
    backgroundColor: "#1f2933",
  },
  cardFront: {
    backgroundColor: "#f8fafc",
  },
  valueText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  matchImage: {
    width: 110,
    height: 110,
    borderRadius: 14,
  },
  cardBackLabel: {
    color: "#cbd5f5",
    fontSize: 16,
    letterSpacing: 1.1,
  },
});
