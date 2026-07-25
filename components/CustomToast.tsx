import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../screens/Colors";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  text1?: string;
}

export const SuccessToast = ({ text1 }: Props) => (
  <View style={[styles.container, styles.success]}>
    <View style={[styles.iconWrap, styles.successIconWrap]}>
      <Ionicons name="checkmark-done-outline" size={20} color={COLORS.B0} />
    </View>
    <Text style={styles.text} numberOfLines={2}>
      {text1}
    </Text>
  </View>
);

export const InfoToast = ({ text1 }: Props) => (
  <View style={[styles.container, styles.info]}>
    <View style={[styles.iconWrap, styles.infoIconWrap]}>
      <Ionicons name="alert-outline" size={20} color={COLORS.B0} />
    </View>
    <Text style={styles.text} numberOfLines={2}>
      {text1}
    </Text>
  </View>
);

export const ErrorToast = ({ text1 }: Props) => (
  <View style={[styles.container, styles.error]}>
    <View style={[styles.iconWrap, styles.errorIconWrap]}>
      <Ionicons name="close-outline" size={20} color={COLORS.W0} />
    </View>
    <Text style={styles.text} numberOfLines={2}>
      {text1}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "90%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    // subtle glow to match the Proceed button
    shadowColor: COLORS.Y700,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8, // Android
  },

  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.Y700,
  },

  successIconWrap: {
    backgroundColor: COLORS.G300,
  },
  infoIconWrap: {
    backgroundColor: COLORS.Y700,
  },
  errorIconWrap: {
    backgroundColor: COLORS.R0,
  },

  success: {
    backgroundColor: COLORS.B50,
    borderColor: COLORS.G300,
  },
  info: {
    backgroundColor: COLORS.B50,
    borderColor: COLORS.Y700,
  },

  error: {
    backgroundColor: COLORS.B50,
    borderColor: COLORS.R0,
  },

  text: {
    flex: 1,
    color: COLORS.W0,
    fontSize: 14,
    fontWeight: "600",
  },
});
