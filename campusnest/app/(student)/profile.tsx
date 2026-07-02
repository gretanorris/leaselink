import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
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
import { useListings } from "@/context/ListingsContext";

export default function StudentProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { savedIds, applications } = useListings();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out of LeaseLink?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: async () => { await logout(); router.replace("/"); } },
    ]);
  };

  const creditScore = user?.creditScore ?? 680;
  const creditPct = Math.min(Math.max((creditScore - 300) / 550, 0), 1);
  const creditLabel = creditScore >= 750 ? "Excellent" : creditScore >= 700 ? "Good" : creditScore >= 650 ? "Fair" : "Building";
  const creditColor = creditScore >= 750 ? Colors.success : creditScore >= 700 ? "#3B82F6" : creditScore >= 650 ? Colors.accent : Colors.error;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <View style={styles.avatar}>
          <Ionicons name="school" size={32} color={Colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user?.name ?? "Student"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={13} color={Colors.primary} />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Credit score card */}
        <View style={styles.creditCard}>
          <View style={styles.creditHeader}>
            <Ionicons name="trending-up-outline" size={18} color={Colors.primary} />
            <Text style={styles.creditTitle}>Credit-Worthiness Score</Text>
            <View style={[styles.creditTag, { backgroundColor: `${creditColor}15` }]}>
              <Text style={[styles.creditTagText, { color: creditColor }]}>{creditLabel}</Text>
            </View>
          </View>
          <Text style={[styles.creditNum, { color: creditColor }]}>{creditScore}</Text>
          <View style={styles.meterBar}>
            <View style={[styles.meterFill, { width: `${creditPct * 100}%`, backgroundColor: creditColor }]} />
          </View>
          <View style={styles.meterLabels}>
            <Text style={styles.meterMin}>300 — Poor</Text>
            <Text style={styles.meterMax}>850 — Excellent</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatBox icon="heart" label="Saved" value={savedIds.length.toString()} />
          <StatBox icon="document-text" label="Applied" value={applications.length.toString()} />
          <StatBox icon="checkmark-circle" label="Co-signer" value={user?.cosignerUploaded ? "✓" : "—"} />
        </View>

        {/* CalNet verification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identity & Verification</Text>

          <SettingsRow
            icon="school-outline"
            label="CalNet Status"
            value="Verified"
            valueColor={Colors.success}
          />
          <SettingsRow
            icon="mail-outline"
            label="Email"
            value={user?.email ?? "—"}
          />
          <SettingsRow
            icon="document-text-outline"
            label="Co-signer Docs"
            value={user?.cosignerUploaded ? "Uploaded" : "Not Uploaded"}
            valueColor={user?.cosignerUploaded ? Colors.success : Colors.accent}
          />

          {/* CALID placeholder: SSO identity verification via CalID — calnet.berkeley.edu */}
          <View style={styles.calidPlaceholder}>
            <Ionicons name="finger-print-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.calidText}>CalID identity verification — pending integration</Text>
          </View>
        </View>

        {/* Account settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Pressable style={styles.settingsRow} onPress={() => router.push("/(auth)/onboarding")}>
            <Ionicons name="cloud-upload-outline" size={18} color={Colors.primary} />
            <Text style={styles.settingsRowText}>Update Co-signer Documents</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
          </Pressable>
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out of LeaseLink</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function StatBox({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Ionicons name={icon as any} size={20} color={Colors.accent} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingsRow({ icon, label, value, valueColor }: { icon: string; label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.settingsRow}>
      <Ionicons name={icon as any} size={18} color={Colors.primary} />
      <Text style={styles.settingsRowText}>{label}</Text>
      <Text style={[styles.settingsRowValue, valueColor ? { color: valueColor } : {}]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingBottom: 18,
    backgroundColor: Colors.primary,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  name: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  email: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)", marginTop: 2 },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  verifiedText: { fontSize: 11, fontFamily: "Inter_700Bold", color: Colors.primary },
  scroll: { padding: 16, gap: 16 },
  creditCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  creditHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  creditTitle: { flex: 1, fontSize: 15, fontFamily: "Inter_700Bold", color: Colors.text },
  creditTag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  creditTagText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  creditNum: { fontSize: 42, fontFamily: "Inter_700Bold" },
  meterBar: { height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: "hidden" },
  meterFill: { height: "100%", borderRadius: 4 },
  meterLabels: { flexDirection: "row", justifyContent: "space-between" },
  meterMin: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textTertiary },
  meterMax: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textTertiary },
  statsRow: { flexDirection: "row", gap: 10 },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: { fontSize: 22, fontFamily: "Inter_700Bold", color: Colors.text },
  statLabel: { fontSize: 11, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  section: { gap: 2 },
  sectionTitle: { fontSize: 13, fontFamily: "Inter_700Bold", color: Colors.text, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  settingsRowText: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium", color: Colors.text },
  settingsRowValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: Colors.textSecondary },
  calidPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 12,
    backgroundColor: Colors.surfaceGray,
    marginTop: 4,
  },
  calidText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textSecondary },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(239,68,68,0.08)",
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
  },
  logoutText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: Colors.error },
});
