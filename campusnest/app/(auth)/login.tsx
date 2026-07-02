import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { useAuth, UserRole } from "@/context/AuthContext";

export default function LoginScreen() {
  const { role: roleParam } = useLocalSearchParams<{ role: UserRole }>();
  const role: UserRole = roleParam === "landlord" ? "landlord" : "student";
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [email, setEmail] = useState(role === "student" ? "jane.doe@berkeley.edu" : "landlord@gmail.com");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isStudent = role === "student";

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }
    if (isStudent && !email.toLowerCase().endsWith(".edu")) {
      Alert.alert(
        "Invalid Email",
        "Students must use a .edu email address for CalNet verification."
      );
      return;
    }
    setIsLoading(true);
    try {
      await login(email.trim(), password, role);
      if (role === "student") {
        router.replace("/(auth)/onboarding");
      } else {
        router.replace("/(landlord)");
      }
    } catch {
      Alert.alert("Login Failed", "Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 8 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>

        <Animated.View entering={FadeInDown.delay(100)} style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name={isStudent ? "school" : "key"} size={26} color={Colors.primary} />
          </View>
          <Text style={styles.headerTitle}>
            {isStudent ? "CalNet Login" : "Landlord Login"}
          </Text>
          <Text style={styles.headerSub}>
            {isStudent
              ? "Sign in with your UC Berkeley credentials"
              : "Access your property dashboard"}
          </Text>
        </Animated.View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.formScroll, { paddingBottom: Platform.OS === "web" ? 40 : insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.delay(200)} style={styles.form}>
            <Text style={styles.formTitle}>Welcome back</Text>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{isStudent ? ".edu Email Address" : "Email"}</Text>
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={18} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder={isStudent ? "you@berkeley.edu" : "you@example.com"}
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {isStudent && email.toLowerCase().endsWith(".edu") && (
                  <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                )}
              </View>
              {isStudent && (
                <Text style={styles.fieldHint}>
                  Only .edu addresses accepted for CalNet SSO
                </Text>
              )}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Your password"
                  placeholderTextColor={Colors.textTertiary}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={Colors.textSecondary}
                  />
                </Pressable>
              </View>
            </View>

            {isStudent && (
              <View style={styles.calnetBox}>
                <Ionicons name="shield-checkmark" size={18} color={Colors.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.calnetTitle}>CalNet SSO Integration</Text>
                  <Text style={styles.calnetText}>
                    Your identity is verified via UC Berkeley's CalNet system
                  </Text>
                </View>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [styles.loginBtn, pressed && styles.loginBtnPressed]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <>
                  {isStudent && <Ionicons name="shield-checkmark" size={18} color={Colors.primary} />}
                  <Text style={styles.loginBtnText}>
                    {isStudent ? "Sign in with CalNet" : "Sign In"}
                  </Text>
                </>
              )}
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={styles.registerLink}
              onPress={() => router.push(`/(auth)/register?role=${role}`)}
            >
              <Text style={styles.registerLinkText}>
                New to LeaseLink?{" "}
                <Text style={styles.registerLinkHighlight}>Create account</Text>
              </Text>
            </Pressable>

            <View style={styles.demoHint}>
              <Ionicons name="information-circle-outline" size={15} color={Colors.textTertiary} />
              <Text style={styles.demoHintText}>Demo: credentials are pre-filled</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  header: { paddingHorizontal: 20, paddingBottom: 28 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  headerContent: { gap: 8 },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  formScroll: { flexGrow: 1 },
  form: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    flex: 1,
    minHeight: 520,
    gap: 18,
  },
  formTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: Colors.text },
  fieldGroup: { gap: 6 },
  label: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", color: Colors.text },
  fieldHint: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textTertiary, marginTop: 2 },
  calnetBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: "rgba(245,166,35,0.08)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(245,166,35,0.25)",
  },
  calnetTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: Colors.text },
  calnetText: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textSecondary, marginTop: 2 },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
  },
  loginBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  loginBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: Colors.primary },
  divider: { flexDirection: "row", alignItems: "center", gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.textTertiary },
  registerLink: { alignItems: "center" },
  registerLinkText: { fontSize: 14, fontFamily: "Inter_400Regular", color: Colors.textSecondary },
  registerLinkHighlight: { fontFamily: "Inter_600SemiBold", color: Colors.primary },
  demoHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surfaceGray,
    padding: 12,
    borderRadius: 10,
  },
  demoHintText: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textTertiary },
});
