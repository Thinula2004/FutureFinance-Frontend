import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Easing } from "react-native";
import { clearAuthData, getToken } from "../services/AsyncStorageService";
import { navigateAndReset } from "../navigation/navigationService";
import { getProfile } from "../controllers/userController";
import Constants from "expo-constants";

const COLORS = {
  background: "#000000",
  foreground: "#F1B836",
  subtleText: "#8A8A8A",
};

const DOT_COUNT = 3;
const DOT_SIZE = 10;
const ANIM_DURATION = 400;
const STAGGER_DELAY = 150;

export default function SplashScreen() {
  const dotAnims = useRef(
    Array.from({ length: DOT_COUNT }, () => new Animated.Value(0)),
  ).current;

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    const loops = dotAnims.map((anim, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * STAGGER_DELAY),
          Animated.timing(anim, {
            toValue: 1,
            duration: ANIM_DURATION,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: ANIM_DURATION,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay((DOT_COUNT - 1 - index) * STAGGER_DELAY),
        ]),
      ),
    );

    Animated.stagger(0, loops).start();

    checkToken();

    return () => {
      loops.forEach((loop) => loop.stop());
    };
  }, []);

  const checkToken = async () => {
    const token = await getToken();

    if (token) {
      const isValid = await getProfile();

      if (isValid) {
        navigateAndReset("Dashboard", null, 2);
      } else {
        clearAuthData();
        navigateAndReset("Auth", null, 2);
      }
    } else {
      clearAuthData();
      navigateAndReset("Auth", null, 2);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerBlock}>
        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <Image
            source={require("../assets/logoWithoutText.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Future Finance</Text>
          <Text style={styles.tagline}>Your money, Your future</Text>
        </Animated.View>

        <View style={styles.dotsRow}>
          {dotAnims.map((anim, index) => {
            const scale = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.6, 1.15],
            });
            const opacity = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.35, 1],
            });
            return (
              <Animated.View
                key={index}
                style={[styles.dot, { opacity, transform: [{ scale }] }]}
              />
            );
          })}
        </View>
      </View>

      <Text style={styles.footerText}>V{Constants.expoConfig?.version}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
  },
  centerBlock: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    color: COLORS.foreground,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tagline: {
    color: COLORS.subtleText,
    fontSize: 13,
    letterSpacing: 0.3,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: COLORS.foreground,
  },
  footerText: {
    position: "absolute",
    bottom: 36,
    color: COLORS.subtleText,
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
