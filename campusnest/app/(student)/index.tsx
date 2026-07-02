import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
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
import { useAuth } from "@/context/AuthContext";
import { useListings, Listing } from "@/context/ListingsContext";
import { ListingCard } from "@/components/ListingCard";

const FILTERS = ["All", "Studio", "Apartment", "House", "Room"] as const;
type Filter = (typeof FILTERS)[number];

const LEASE_FILTERS = ["Any", "6-month", "12-month"] as const;
type LeaseFilter = (typeof LEASE_FILTERS)[number];

const PRICE_RANGES = ["Any", "Under $1.5k", "$1.5k–$3k", "$3k+"] as const;
type PriceRange = (typeof PRICE_RANGES)[number];

export default function MarketplaceScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { listings, recentlyViewedIds } = useListings();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [leaseFilter, setLeaseFilter] = useState<LeaseFilter>("Any");
  const [priceRange, setPriceRange] = useState<PriceRange>("Any");
  const [showFilters, setShowFilters] = useState(false);

  const recentlyViewed = recentlyViewedIds
    .map((id) => listings.find((l) => l.id === id))
    .filter(Boolean) as Listing[];

  const filtered = listings.filter((l) => {
    const matchesSearch =
      !search ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.address.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      activeFilter === "All" || l.type === activeFilter.toLowerCase();
    const matchesLease =
      leaseFilter === "Any" || l.leaseLength === leaseFilter;
    const matchesPrice =
      priceRange === "Any" ||
      (priceRange === "Under $1.5k" && l.price < 1500) ||
      (priceRange === "$1.5k–$3k" && l.price >= 1500 && l.price < 3000) ||
      (priceRange === "$3k+" && l.price >= 3000);
    return matchesSearch && matchesType && matchesLease && matchesPrice;
  });

  const firstName = user?.name?.split(" ")[0] || "Student";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 },
        ]}
      >
        <Animated.View entering={FadeInDown.delay(50)} style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hi, {firstName}</Text>
            <Text style={styles.subtitle}>Berkeley Student Housing</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={13} color={Colors.primary} />
              <Text style={styles.verifiedText}>Verified Student</Text>
            </View>
          </View>
        </Animated.View>

        {/* Search bar */}
        <Animated.View entering={FadeInDown.delay(120)} style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={17} color="rgba(255,255,255,0.5)" />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search by address, name..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              returnKeyType="search"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={17} color="rgba(255,255,255,0.5)" />
              </Pressable>
            )}
          </View>
          <Pressable
            style={[styles.filterIconBtn, showFilters && styles.filterIconBtnActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="options-outline" size={20} color={showFilters ? Colors.primary : "#fff"} />
          </Pressable>
        </Animated.View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            {/* Filter chips */}
            <View style={styles.filtersArea}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {FILTERS.map((f) => (
                  <Pressable
                    key={f}
                    style={[styles.chip, activeFilter === f && styles.chipActive]}
                    onPress={() => setActiveFilter(f)}
                  >
                    <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Extended filters panel */}
              {showFilters && (
                <View style={styles.filterPanel}>
                  <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>Lease Length</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                      {LEASE_FILTERS.map((f) => (
                        <Pressable
                          key={f}
                          style={[styles.subChip, leaseFilter === f && styles.subChipActive]}
                          onPress={() => setLeaseFilter(f)}
                        >
                          <Text style={[styles.subChipText, leaseFilter === f && styles.subChipTextActive]}>{f}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>Price Range</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                      {PRICE_RANGES.map((p) => (
                        <Pressable
                          key={p}
                          style={[styles.subChip, priceRange === p && styles.subChipActive]}
                          onPress={() => setPriceRange(p)}
                        >
                          <Text style={[styles.subChipText, priceRange === p && styles.subChipTextActive]}>{p}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              )}
            </View>

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <View style={styles.recentSection}>
                <Text style={styles.sectionTitle}>Recently Viewed</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.recentScroll}
                >
                  {recentlyViewed.slice(0, 6).map((item) => (
                    <RecentCard key={item.id} listing={item} />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* All Listings header */}
            <View style={styles.allHeader}>
              <Text style={styles.sectionTitle}>
                {activeFilter === "All" ? "All Listings" : activeFilter + "s"}
              </Text>
              <Text style={styles.countText}>{filtered.length} found</Text>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 50).duration(350)}>
            <ListingCard listing={item} style={styles.cardSpacing} />
          </Animated.View>
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search" size={44} color={Colors.border} />
            <Text style={styles.emptyTitle}>No listings found</Text>
            <Text style={styles.emptySub}>Try adjusting your filters</Text>
          </View>
        }
      />
    </View>
  );
}

function RecentCard({ listing }: { listing: Listing }) {
  const { addRecentlyViewed } = useListings();
  const router_push = require("expo-router").router;
  return (
    <Pressable
      style={styles.recentCard}
      onPress={() => {
        addRecentlyViewed(listing.id);
        router_push.push({ pathname: "/listing/[id]", params: { id: listing.id } });
      }}
    >
      <View style={[styles.recentImg, { backgroundColor: listing.imageColor }]}>
        <Ionicons name="home" size={20} color="rgba(245,166,35,0.7)" />
        {listing.verified && (
          <View style={styles.recentVerified}>
            <Ionicons name="shield-checkmark" size={9} color={Colors.primary} />
          </View>
        )}
      </View>
      <Text style={styles.recentTitle} numberOfLines={1}>{listing.title}</Text>
      <Text style={styles.recentPrice}>${listing.price.toLocaleString()}/mo</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#fff" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.55)", marginTop: 2 },
  headerRight: { alignItems: "flex-end", gap: 6 },
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
  searchRow: { flexDirection: "row", gap: 8 },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", color: "#fff" },
  filterIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  filterIconBtnActive: { backgroundColor: Colors.accent, borderColor: Colors.accentDark },
  filtersArea: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  filterScroll: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surfaceGray,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  chipTextActive: { color: "#fff", fontFamily: "Inter_600SemiBold" },
  filterPanel: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  filterRow: { gap: 6 },
  filterLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: Colors.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 },
  subChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: Colors.surfaceGray,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accentDark },
  subChipText: { fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  subChipTextActive: { color: Colors.primary, fontFamily: "Inter_600SemiBold" },
  recentSection: { paddingTop: 16, paddingBottom: 4 },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  recentScroll: { paddingHorizontal: 14, gap: 10, paddingBottom: 4 },
  recentCard: { width: 120, gap: 6 },
  recentImg: {
    width: 120,
    height: 80,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  recentVerified: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  recentTitle: { fontSize: 11, fontFamily: "Inter_500Medium", color: Colors.text },
  recentPrice: { fontSize: 11, fontFamily: "Inter_700Bold", color: Colors.primary },
  allHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 16,
    paddingBottom: 4,
  },
  countText: { fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  list: { paddingHorizontal: 14, paddingTop: 8, gap: 12 },
  cardSpacing: {},
  empty: { paddingTop: 60, alignItems: "center", gap: 8 },
  emptyTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: Colors.textSecondary },
  emptySub: { fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.textTertiary },
});
