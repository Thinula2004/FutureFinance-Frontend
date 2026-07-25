import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import COLORS from "./Colors";
import { getProfile, login, register } from "../controllers/userController";
import {
  navigateAndReset,
  navigateFromStack,
} from "../navigation/navigationService";
import { clearAuthData, getToken } from "../services/AsyncStorageService";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

type Gender = "male" | "female" | "other" | null;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOB_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const AuthScreen: React.FC = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const goToPage = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setPageIndex(index);
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setPageIndex(newIndex);
  };

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateLogin = () => {
    const errors: { email?: string; password?: string } = {};

    if (!loginEmail.trim()) {
      errors.email = "Email is required";
    }
    if (!loginPassword) {
      errors.password = "Password is required";
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async () => {
    if (!validateLogin()) return;
    const user = await login(loginEmail, loginPassword);

    const token = await getToken();
    console.log(`token: ${token}`);

    if (user) {
      navigateAndReset("Dashboard");
    }

    console.log("Login form valid:", {
      email: loginEmail,
      password: loginPassword,
    });
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender>(null);
  const [dob, setDob] = useState(""); // format: YYYY-MM-DD

  const [registerErrors, setRegisterErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    gender?: string;
    dob?: string;
  }>({});

  const validateRegister = () => {
    const errors: typeof registerErrors = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      errors.name = "Name is required";
    } else if (trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters long";
    } else if (trimmedName.length > 100) {
      errors.name = "Name cannot exceed 100 characters";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 5) {
      errors.password = "Password must be at least 5 characters long";
    }

    if (!gender) {
      errors.gender = "Please select a gender";
    }

    if (!dob.trim()) {
      errors.dob = "Date of birth is required";
    } else if (!DOB_REGEX.test(dob.trim())) {
      errors.dob = "Use format YYYY-MM-DD";
    } else {
      const parsed = new Date(dob.trim());
      const today = new Date();
      if (isNaN(parsed.getTime())) {
        errors.dob = "Enter a valid date";
      } else if (parsed > today) {
        errors.dob = "Date of birth cannot be in the future";
      }
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async () => {
    if (!validateRegister()) return;
    if (!gender) return;
    const success = await register(name, email, password, gender, dob);

    if (success != null) {
      goToPage(0);
    }
    console.log("Register form valid:", { name, email, password, gender, dob });
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={onMomentumScrollEnd}
      style={styles.pager}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.page, { width }]}
      >
        <ScrollView
          contentContainerStyle={[styles.pageContent, { paddingTop: 30 }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerSection}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to Future Finance</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                loginErrors.email && styles.inputErrorBorder,
              ]}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.B500}
              value={loginEmail}
              onChangeText={setLoginEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {!!loginErrors.email && (
              <Text style={styles.errorText}>{loginErrors.email}</Text>
            )}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[
                styles.input,
                loginErrors.password && styles.inputErrorBorder,
              ]}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.B500}
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
            />
            {!!loginErrors.password && (
              <Text style={styles.errorText}>{loginErrors.password}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleLoginSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Proceed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => goToPage(1)}
              style={styles.linkWrap}
            >
              <Text style={styles.linkText}>
                Doesn&apos;t have an account?{" "}
                <Text style={styles.linkTextBold}>Register</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dotsRow}>
            <View style={[styles.dot, pageIndex === 0 && styles.dotActive]} />
            <View style={[styles.dot, pageIndex === 1 && styles.dotActive]} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.page, { width }]}
      >
        <ScrollView
          contentContainerStyle={styles.pageContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Future Finance today</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                registerErrors.name && styles.inputErrorBorder,
              ]}
              placeholder="John Doe"
              placeholderTextColor={COLORS.B500}
              value={name}
              onChangeText={setName}
              maxLength={100}
            />
            {!!registerErrors.name && (
              <Text style={styles.errorText}>{registerErrors.name}</Text>
            )}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                registerErrors.email && styles.inputErrorBorder,
              ]}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.B500}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {!!registerErrors.email && (
              <Text style={styles.errorText}>{registerErrors.email}</Text>
            )}

            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              {(["male", "female", "other"] as Gender[]).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderChip,
                    gender === option && styles.genderChipActive,
                  ]}
                  onPress={() => setGender(option)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.genderChipText,
                      gender === option && styles.genderChipTextActive,
                    ]}
                  >
                    {option!.charAt(0).toUpperCase() + option!.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {!!registerErrors.gender && (
              <Text style={styles.errorText}>{registerErrors.gender}</Text>
            )}

            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={[
                styles.input,
                registerErrors.dob && styles.inputErrorBorder,
              ]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={COLORS.B500}
              value={dob}
              onChangeText={setDob}
              keyboardType={
                Platform.OS === "ios" ? "numbers-and-punctuation" : "default"
              }
              maxLength={10}
            />
            {!!registerErrors.dob && (
              <Text style={styles.errorText}>{registerErrors.dob}</Text>
            )}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[
                styles.input,
                registerErrors.password && styles.inputErrorBorder,
              ]}
              placeholder="At least 5 characters"
              placeholderTextColor={COLORS.B500}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {!!registerErrors.password && (
              <Text style={styles.errorText}>{registerErrors.password}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegisterSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Proceed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => goToPage(0)}
              style={styles.linkWrap}
            >
              <Text style={styles.linkText}>
                Already registered?{" "}
                <Text style={styles.linkTextBold}>Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dotsRow}>
            <View style={[styles.dot, pageIndex === 0 && styles.dotActive]} />
            <View style={[styles.dot, pageIndex === 1 && styles.dotActive]} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pager: {
    flex: 1,
    backgroundColor: COLORS.B0,
  },
  page: {
    flex: 1,
    backgroundColor: COLORS.B0,
  },
  pageContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: "center",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 36,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 36,
  },
  title: {
    color: COLORS.Y700,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  subtitle: {
    color: COLORS.W0,
    fontSize: 14,
    opacity: 0.7,
  },
  form: {
    width: "100%",
  },
  label: {
    color: COLORS.Y700,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: COLORS.B50,
    borderWidth: 1.5,
    borderColor: COLORS.B100,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    color: COLORS.W0,
    fontSize: 15,
  },
  inputErrorBorder: {
    borderColor: COLORS.R0,
  },
  errorText: {
    color: COLORS.R0,
    fontSize: 12,
    marginTop: 6,
  },
  genderRow: {
    flexDirection: "row",
    gap: 10,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.B100,
    backgroundColor: COLORS.B50,
    alignItems: "center",
  },
  genderChipActive: {
    backgroundColor: COLORS.Y700,
    borderColor: COLORS.Y700,
  },
  genderChipText: {
    color: COLORS.W0,
    fontSize: 13,
    fontWeight: "600",
  },
  genderChipTextActive: {
    color: COLORS.B0,
  },
  button: {
    backgroundColor: COLORS.Y700,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 28,
    shadowColor: COLORS.Y700,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: COLORS.B0,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  linkWrap: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: COLORS.W0,
    fontSize: 13,
    opacity: 0.8,
  },
  linkTextBold: {
    color: COLORS.Y700,
    fontWeight: "700",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.B100,
  },
  dotActive: {
    backgroundColor: COLORS.Y700,
    width: 20,
  },
});

export default AuthScreen;
