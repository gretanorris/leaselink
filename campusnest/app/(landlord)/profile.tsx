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

export default function LandlordProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { getMyListings } = useListings();
  const myListings = getMyListings(user?.id || "");
  const totalRevenue = myListings.reduce((sum, l) => sum + l.price, 0);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Sign out of LeaseLink?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: async () => { await logout(); router.replace("/"); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <View style={styles.avatar}>
          <Ionicons name="key" size={28} color={Colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user?.name ?? "Landlord"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={12} color={Colors.primary} />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBox icon="home-outline" label="Listings" value={myListings.length.toString()} />
          <StatBox icon="trending-up-outline" label="Monthly Rev" value={`$${(totalRevenue / 1000).toFixed(1)}k`} />
          <StatBox icon="star-outline" label="Rating" value="4.9" />
        </View>

        {/* Business info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Profile</Text>
          <InfoRow icon="business-outline" label="Role" value="Property Landlord" />
          <InfoRow icon="mail-outline" label="Email" value={user?.email ?? "—"} />
          <InfoRow icon="shield-checkmark-outline" label="Status" value="Verified Landlord" valueColor={Colors.success} />
          <InfoRow icon="location-outline" label="Market" value="Berkeley, CA" />
        </View>

        {/* Integration placeholders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Integrations</Text>

          {/* STRIPE: Connected stripe account for security deposit collection */}
          <View style={styles.integrationRow}>
            <View style={[styles.integrationIcon, { backgroundColor: "#6772E515" }]}>
              <Ionicons name="card-outline" size={18} color="#6772E5" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.integrationName}>Stripe Payments</Text>
              <Text style={styles.integrationSub}>Security deposits & rent collection</Text>
            </View>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>Setup</Text>
            </View>
          </View>

          {/* DOCUSIGN: E-signature for lease agreements */}
          <View style={styles.integrationRow}>
            <View style={[styles.integrationIcon, { backgroundColor: "#E5A60015" }]}>
              <Ionicons name="document-text-outline" size={18} color="#B8840A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.integrationName}>DocuSign</Text>
              <Text style={styles.integrationSub}>E-signature for lease agreements</Text>
            </View>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>Setup</Text>
            </View>
          </View>
        </View>

        {/* Account actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Pressable style={styles.actionRow} onPress={() => router.push("/(landlord)/add")}>
            <Ionicons name="add-circle-outline" size={18} color={Colors.primary} />
            <Text style={styles.actionText}>Add New Listing</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
          </Pressable>
          <Pressable style={styles.actionRow} onPress={() => router.push("/(landlord)/pipeline")}>
            <Ionicons name="people-outline" size={18} color={Colors.primary} />
            <Text style={styles.actionText}>View Applicant Pipeline</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
          </Pressable>
        </View>

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

function InfoRow({ icon, label, value, valueColor }: { icon: string; label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon as any} size={18} color={Colors.primary} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueColor ? { color: valueColor } : {}]}>{value}</Text>
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
  section: { gap: 6 },
  sectionTitle: { fontSize: 13, fontFamily: "Inter_700Bold", color: Colors.text, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  infoLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  infoValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: Colors.text },
  integrationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  integrationIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  integrationName: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.text },
  integrationSub: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textSecondary, marginTop: 1 },
  pendingBadge: {
    backgroundColor: Colors.surfaceGray,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pendingText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: Colors.textSecondary },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  actionText: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium", color: Colors.text },
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
