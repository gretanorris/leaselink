import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/constants/colors";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useAuth();
  const [selected, setSelected] = useState<"student" | "landlord">("student");

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "student") {
        if (!user.onboardingComplete) {
          router.replace("/(auth)/onboarding");
        } else {
          router.replace("/(student)");
        }
      } else {
        router.replace("/(landlord)");
      }
    }
  }, [user, isLoading]);

  if (isLoading) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bgAccent} />

      <View
        style={[
          styles.content,
          {
            paddingTop: Platform.OS === "web" ? 80 : insets.top + 32,
            paddingBottom: Platform.OS === "web" ? 40 : insets.bottom + 24,
          },
        ]}
      >
        {/* Logo */}
        <Animated.View entering={FadeInDown.delay(80).duration(600)} style={styles.logoArea}>
          <View style={styles.logoIconRow}>
            <View style={styles.logoIcon}>
              <Ionicons name="home" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.logoText}>LeaseLink</Text>
          </View>
          <View style={styles.berkBadge}>
            <Ionicons name="school" size={13} color={Colors.accent} />
            <Text style={styles.berkBadgeText}>UC Berkeley Verified Housing</Text>
          </View>
          <Text style={styles.tagline}>Find verified housing near campus</Text>
        </Animated.View>

        {/* Toggle */}
        <Animated.View entering={FadeIn.delay(250).duration(500)} style={styles.toggleCard}>
          <Text style={styles.toggleLabel}>I am a</Text>
          <View style={styles.toggleRow}>
            <Pressable
              style={[styles.toggleBtn, selected === "student" && styles.toggleBtnActive]}
              onPress={() => setSelected("student")}
            >
              <Ionicons
                name="school-outline"
                size={22}
                color={selected === "student" ? "#fff" : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.toggleBtnText,
                  selected === "student" && styles.toggleBtnTextActive,
                ]}
              >
                Student
              </Text>
            </Pressable>
            <Pressable
              style={[styles.toggleBtn, selected === "landlord" && styles.toggleBtnActive]}
              onPress={() => setSelected("landlord")}
            >
              <Ionicons
                name="key-outline"
                size={22}
                color={selected === "landlord" ? "#fff" : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.toggleBtnText,
                  selected === "landlord" && styles.toggleBtnTextActive,
                ]}
              >
                Landlord
              </Text>
            </Pressable>
          </View>

          {selected === "student" ? (
            <View style={styles.detailBox}>
              <Ionicons name="shield-checkmark-outline" size={16} color={Colors.accent} />
              <Text style={styles.detailText}>
                Sign in with your <Text style={styles.detailBold}>.edu email</Text> for CalNet verification
              </Text>
            </View>
          ) : (
            <View style={styles.detailBox}>
              <Ionicons name="analytics-outline" size={16} color={Colors.accent} />
              <Text style={styles.detailText}>
                Manage listings, applicants, and <Text style={styles.detailBold}>verified tenants</Text>
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Trust indicators */}
        <Animated.View entering={FadeIn.delay(400).duration(500)} style={styles.trustRow}>
          <TrustBadge icon="checkmark-circle" label="Verified Listings" />
          <TrustBadge icon="shield-checkmark" label=".edu Auth" />
          <TrustBadge icon="star" label="Reviewed" />
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.ctaArea}>
          <Pressable
            style={({ pressed }) => [styles.ctaBtn, pressed && styles.ctaBtnPressed]}
            onPress={() => router.push(`/(auth)/login?role=${selected}`)}
          >
            <Text style={styles.ctaBtnText}>
              {selected === "student" ? "Sign in with CalNet" : "Landlord Login"}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
          </Pressable>

          <Pressable
            style={styles.registerLink}
            onPress={() => router.push(`/(auth)/register?role=${selected}`)}
          >
            <Text style={styles.registerLinkText}>
              New to LeaseLink?{" "}
              <Text style={styles.registerLinkHighlight}>Create account</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.trustBadge}>
      <Ionicons name={icon as any} size={16} color={Colors.accent} />
      <Text style={styles.trustBadgeText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  bgAccent: {
    position: "absolute",
    bottom: -60,
    right: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.accent,
    opacity: 0.07,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 28,
    justifyContent: "center",
  },
  logoArea: { gap: 10, alignItems: "flex-start" },
  logoIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: -0.5,
  },
  berkBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(245,166,35,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(245,166,35,0.3)",
  },
  berkBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.accent,
  },
  tagline: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  toggleCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  toggleLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.surfaceGray,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
  },
  toggleBtnTextActive: {
    color: "#fff",
  },
  detailBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: Colors.surfaceGray,
    borderRadius: 12,
    padding: 12,
  },
  detailText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  detailBold: {
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  trustRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  trustBadge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  trustBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.75)",
  },
  ctaArea: { gap: 14 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
  },
  ctaBtnPressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  ctaBtnText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: Colors.primary,
  },
  registerLink: { alignItems: "center" },
  registerLinkText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
  },
  registerLinkHighlight: {
    fontFamily: "Inter_600SemiBold",
    color: Colors.accent,
  },
});
