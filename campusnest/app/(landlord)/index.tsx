import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useListings } from "@/context/ListingsContext";

const KPI_DATA = [
  { label: "Vacancy Rate", value: "12%", delta: "-3%", good: true, icon: "home-outline", color: Colors.success },
  { label: "Active Listings", value: "5", delta: "+1", good: true, icon: "list-outline", color: Colors.primary },
  { label: "Pending Tours", value: "8", delta: "+4", good: true, icon: "calendar-outline", color: Colors.accent },
  { label: "Avg. Rent", value: "$2.4k", delta: "+5%", good: true, icon: "trending-up-outline", color: "#3B82F6" },
];

const HOT_APPLICANTS = [
  { name: "jsmith...@berkeley.edu", score: 750, cosigner: true, status: "Hot Lead" },
  { name: "lchen...@berkeley.edu", score: 720, cosigner: true, status: "Hot Lead" },
  { name: "mwilliams...@berkeley.edu", score: 695, cosigner: false, status: "Qualified" },
  { name: "ataylor...@berkeley.edu", score: 710, cosigner: true, status: "Hot Lead" },
];

export default function LandlordAnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { getMyListings } = useListings();

  const myListings = user ? getMyListings(user.id) : [];
  const firstName = user?.name?.split(" ")[0] || "Landlord";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <Animated.View entering={FadeInDown.delay(50)}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good morning, {firstName}</Text>
              <Text style={styles.headerSub}>Property Dashboard</Text>
            </View>
            <View style={styles.landlordBadge}>
              <Ionicons name="key" size={13} color={Colors.primary} />
              <Text style={styles.landlordBadgeText}>Verified Landlord</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Cards */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.kpiGrid}>
            {KPI_DATA.map((kpi) => (
              <View key={kpi.label} style={styles.kpiCard}>
                <View style={[styles.kpiIcon, { backgroundColor: `${kpi.color}15` }]}>
                  <Ionicons name={kpi.icon as any} size={20} color={kpi.color} />
                </View>
                <Text style={styles.kpiValue}>{kpi.value}</Text>
                <Text style={styles.kpiLabel}>{kpi.label}</Text>
                <View style={styles.kpiDelta}>
                  <Ionicons
                    name={kpi.good ? "trending-up" : "trending-down"}
                    size={11}
                    color={kpi.good ? Colors.success : Colors.error}
                  />
                  <Text style={[styles.kpiDeltaText, { color: kpi.good ? Colors.success : Colors.error }]}>
                    {kpi.delta} this month
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Hot Applicants */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hot Applicants</Text>
            <Pressable onPress={() => router.push("/(landlord)/pipeline")}>
              <Text style={styles.seeAll}>See Pipeline →</Text>
            </Pressable>
          </View>

          <View style={styles.applicantsList}>
            {HOT_APPLICANTS.map((a, i) => (
              <View key={i} style={styles.applicantCard}>
                <View style={styles.applicantAvatar}>
                  <Ionicons name="school" size={16} color={Colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.applicantName}>{a.name}</Text>
                  <View style={styles.applicantMeta}>
                    <View style={styles.scoreBadge}>
                      <Ionicons name="trending-up-outline" size={11} color={Colors.primary} />
                      <Text style={styles.scoreBadgeText}>Score: {a.score}</Text>
                    </View>
                    {a.cosigner && (
                      <View style={styles.cosignerBadge}>
                        <Ionicons name="document-text" size={11} color={Colors.success} />
                        <Text style={styles.cosignerBadgeText}>Co-signer ✓</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={[styles.hotTag, { backgroundColor: a.status === "Hot Lead" ? `${Colors.accent}20` : `${Colors.primary}10` }]}>
                  <Text style={[styles.hotTagText, { color: a.status === "Hot Lead" ? Colors.accentDark : Colors.primary }]}>
                    {a.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* My Listings quick preview */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Listings</Text>
            <Pressable onPress={() => router.push("/(landlord)/add")}>
              <Text style={styles.seeAll}>+ Add New</Text>
            </Pressable>
          </View>

          {myListings.length === 0 ? (
            <View style={styles.noListings}>
              <Ionicons name="home-outline" size={36} color={Colors.border} />
              <Text style={styles.noListingsText}>No listings yet</Text>
              <Pressable style={styles.addBtn} onPress={() => router.push("/(landlord)/add")}>
                <Ionicons name="add" size={16} color={Colors.primary} />
                <Text style={styles.addBtnText}>Add Your First Listing</Text>
              </Pressable>
            </View>
          ) : (
            myListings.slice(0, 3).map((listing) => (
              <View key={listing.id} style={styles.listingRow}>
                <View style={[styles.listingRowIcon, { backgroundColor: listing.imageColor }]}>
                  <Ionicons name="home" size={16} color="rgba(245,166,35,0.8)" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listingRowTitle}>{listing.title}</Text>
                  <Text style={styles.listingRowSub}>${listing.price.toLocaleString()}/mo • {listing.leaseLength}</Text>
                </View>
                <View style={styles.listingActive}>
                  <Text style={styles.listingActiveText}>Active</Text>
                </View>
              </View>
            ))
          )}
        </Animated.View>

        {/* Quick actions */}
        <Animated.View entering={FadeInDown.delay(350)}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <Pressable style={styles.quickAction} onPress={() => router.push("/(landlord)/add")}>
              <Ionicons name="add-circle-outline" size={26} color={Colors.primary} />
              <Text style={styles.quickActionText}>New Listing</Text>
            </Pressable>
            <Pressable style={styles.quickAction} onPress={() => router.push("/(landlord)/pipeline")}>
              <Ionicons name="people-outline" size={26} color={Colors.primary} />
              <Text style={styles.quickActionText}>Pipeline</Text>
            </Pressable>
            <Pressable style={styles.quickAction} onPress={() => router.push("/(landlord)/inbox")}>
              <Ionicons name="chatbubbles-outline" size={26} color={Colors.primary} />
              <Text style={styles.quickActionText}>Inbox</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.55)", marginTop: 2 },
  landlordBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  landlordBadgeText: { fontSize: 11, fontFamily: "Inter_700Bold", color: Colors.primary },
  scroll: { padding: 16, gap: 20 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", color: Colors.text, marginBottom: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: Colors.primary },
  kpiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  kpiCard: {
    width: "47.5%",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  kpiIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  kpiValue: { fontSize: 26, fontFamily: "Inter_700Bold", color: Colors.text },
  kpiLabel: { fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  kpiDelta: { flexDirection: "row", alignItems: "center", gap: 3 },
  kpiDeltaText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  applicantsList: { gap: 10 },
  applicantCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  applicantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  applicantName: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: Colors.text },
  applicantMeta: { flexDirection: "row", gap: 6, marginTop: 3, flexWrap: "wrap" },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scoreBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: Colors.primary },
  cosignerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cosignerBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: Colors.success },
  hotTag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  hotTagText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  noListings: { alignItems: "center", gap: 10, paddingVertical: 30 },
  noListingsText: { fontSize: 15, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.primary },
  listingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  listingRowIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  listingRowTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: Colors.text },
  listingRowSub: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textSecondary, marginTop: 1 },
  listingActive: { backgroundColor: Colors.successLight, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  listingActiveText: { fontSize: 11, fontFamily: "Inter_700Bold", color: Colors.success },
  quickActions: { flexDirection: "row", gap: 10 },
  quickAction: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: Colors.primary },
});
