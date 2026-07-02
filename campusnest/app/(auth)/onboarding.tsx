import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated as RNAnimated,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const [cosignerUploaded, setCosignerUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const creditScore = user?.creditScore ?? 680;
  const creditPct = Math.min(Math.max((creditScore - 300) / 550, 0), 1);
  const creditLabel =
    creditScore >= 750 ? "Excellent" :
    creditScore >= 700 ? "Good" :
    creditScore >= 650 ? "Fair" :
    "Building";
  const creditColor =
    creditScore >= 750 ? Colors.success :
    creditScore >= 700 ? "#3B82F6" :
    creditScore >= 650 ? Colors.accent :
    Colors.error;

  const handleComplete = async (skip = false) => {
    setIsLoading(true);
    await updateUser({
      cosignerUploaded: skip ? false : cosignerUploaded,
      onboardingComplete: true,
    });
    router.replace("/(student)");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === "web" ? 67 : insets.top + 16 },
        ]}
      >
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="home" size={18} color={Colors.primary} />
          </View>
          <Text style={styles.logoText}>LeaseLink</Text>
        </View>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, styles.stepDotDone]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepLine} />
          <View style={styles.stepDot} />
        </View>
        <Text style={styles.stepLabel}>Step 2 of 3 — Verification</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Platform.OS === "web" ? 40 : insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Complete your profile</Text>
        <Text style={styles.subtitle}>
          Landlords trust verified students. Add your co-signer docs to unlock more listings.
        </Text>

        {/* Verified badge */}
        <View style={styles.verifiedBanner}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
          <View style={{ flex: 1 }}>
            <Text style={styles.verifiedTitle}>CalNet Verified Student</Text>
            <Text style={styles.verifiedSub}>{user?.email}</Text>
          </View>
          <View style={styles.verifiedTag}>
            <Text style={styles.verifiedTagText}>Verified</Text>
          </View>
        </View>

        {/* Credit Worthiness Meter */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="trending-up-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Credit-Worthiness Score</Text>
          </View>

          <View style={styles.scoreRow}>
            <Text style={[styles.scoreNum, { color: creditColor }]}>{creditScore}</Text>
            <View style={[styles.scoreTag, { backgroundColor: `${creditColor}18` }]}>
              <Text style={[styles.scoreTagText, { color: creditColor }]}>{creditLabel}</Text>
            </View>
          </View>

          <View style={styles.meterBar}>
            <View style={[styles.meterFill, { width: `${creditPct * 100}%`, backgroundColor: creditColor }]} />
          </View>

          <View style={styles.meterLabels}>
            <Text style={styles.meterMin}>300</Text>
            <Text style={styles.meterMid}>Fair (650)</Text>
            <Text style={styles.meterMax}>850</Text>
          </View>

          <Text style={styles.meterHint}>
            {creditScore >= 700
              ? "Your score qualifies you for most listings without a co-signer."
              : "A co-signer can help you qualify for more premium listings."}
          </Text>
        </View>

        {/* Co-signer Upload */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Co-signer Documentation</Text>
          </View>
          <Text style={styles.cardDesc}>
            Upload proof of co-signer income or assets to unlock listings that require one.
          </Text>

          {cosignerUploaded ? (
            <View style={styles.uploadedBox}>
              <Ionicons name="checkmark-circle" size={22} color={Colors.success} />
              <View style={{ flex: 1 }}>
                <Text style={styles.uploadedTitle}>cosigner_docs.pdf</Text>
                <Text style={styles.uploadedSub}>Uploaded successfully</Text>
              </View>
              <Pressable onPress={() => setCosignerUploaded(false)}>
                <Ionicons name="close-circle-outline" size={20} color={Colors.textTertiary} />
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [styles.uploadBtn, pressed && { opacity: 0.8 }]}
              onPress={() => setCosignerUploaded(true)}
            >
              <Ionicons name="cloud-upload-outline" size={26} color={Colors.primary} />
              <Text style={styles.uploadBtnTitle}>Upload Documents</Text>
              <Text style={styles.uploadBtnSub}>PDF, JPG, PNG — max 10MB</Text>
            </Pressable>
          )}

          <View style={styles.docTypeRow}>
            {["Bank Statement", "Tax Return", "Pay Stub"].map((d) => (
              <View key={d} style={styles.docTag}>
                <Ionicons name="document-outline" size={12} color={Colors.textSecondary} />
                <Text style={styles.docTagText}>{d}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Privacy note */}
        <View style={styles.privacyNote}>
          <Ionicons name="lock-closed-outline" size={14} color={Colors.textTertiary} />
          <Text style={styles.privacyText}>
            Documents are encrypted and only shared with landlords you apply to.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
            onPress={() => handleComplete(false)}
            disabled={isLoading}
          >
            <Text style={styles.primaryBtnText}>Complete Profile</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
          </Pressable>

          <Pressable style={styles.skipBtn} onPress={() => handleComplete(true)}>
            <Text style={styles.skipBtnText}>Skip for Now — Go to Marketplace</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { fontSize: 20, fontFamily: "Inter_700Bold", color: Colors.primary },
  stepIndicator: { flexDirection: "row", alignItems: "center", gap: 0 },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
  },
  stepDotDone: { backgroundColor: Colors.success },
  stepDotActive: { backgroundColor: Colors.accent, width: 14, height: 14, borderRadius: 7 },
  stepLine: { flex: 1, height: 2, backgroundColor: Colors.border, maxWidth: 60 },
  stepLabel: { fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  scroll: { paddingHorizontal: 20, paddingTop: 24, gap: 16 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", color: Colors.text },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", color: Colors.textSecondary, lineHeight: 21 },
  verifiedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.successLight,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.25)",
  },
  verifiedTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.text },
  verifiedSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textSecondary },
  verifiedTag: {
    backgroundColor: Colors.success,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedTagText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#fff" },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: Colors.text },
  cardDesc: { fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.textSecondary, lineHeight: 19 },
  scoreRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  scoreNum: { fontSize: 42, fontFamily: "Inter_700Bold" },
  scoreTag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  scoreTagText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  meterBar: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    overflow: "hidden",
  },
  meterFill: { height: "100%", borderRadius: 5 },
  meterLabels: { flexDirection: "row", justifyContent: "space-between" },
  meterMin: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textTertiary },
  meterMid: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textTertiary },
  meterMax: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textTertiary },
  meterHint: { fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.textSecondary, lineHeight: 19 },
  uploadBtn: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surfaceGray,
  },
  uploadBtnTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: Colors.text },
  uploadBtnSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textTertiary },
  uploadedBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.successLight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.2)",
  },
  uploadedTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.text },
  uploadedSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textSecondary },
  docTypeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  docTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.surfaceGray,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  docTagText: { fontSize: 11, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  privacyNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    paddingHorizontal: 4,
  },
  privacyText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textTertiary, lineHeight: 17 },
  actions: { gap: 12, marginTop: 4 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
  },
  primaryBtnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  primaryBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: Colors.primary },
  skipBtn: { alignItems: "center", paddingVertical: 12 },
  skipBtnText: { fontSize: 14, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
});
