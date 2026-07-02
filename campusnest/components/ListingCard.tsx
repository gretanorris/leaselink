import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/colors";
import { Listing, useListings } from "@/context/ListingsContext";

interface ListingCardProps {
  listing: Listing;
  style?: object;
}

const TYPE_ICONS: Record<string, string> = {
  studio: "cube",
  apartment: "business",
  house: "home",
  room: "bed",
};

export function ListingCard({ listing, style }: ListingCardProps) {
  const { isSaved, toggleSave, addRecentlyViewed } = useListings();
  const saved = isSaved(listing.id);

  const handleSave = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleSave(listing.id);
  };

  const handlePress = () => {
    addRecentlyViewed(listing.id);
    router.push({ pathname: "/listing/[id]", params: { id: listing.id } });
  };

  const bedroomLabel = listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms}BR`;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, style, pressed && styles.cardPressed]}
      onPress={handlePress}
    >
      {/* Image Area */}
      <View style={[styles.imageArea, { backgroundColor: listing.imageColor }]}>
        <Ionicons
          name={(TYPE_ICONS[listing.type] || "home") as any}
          size={38}
          color="rgba(245,166,35,0.6)"
        />

        {/* Gold Verified Badge */}
        {listing.verified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={12} color={Colors.primary} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}

        <Pressable
          style={[styles.heartBtn, saved && styles.heartBtnActive]}
          onPress={handleSave}
          hitSlop={8}
        >
          <Ionicons
            name={saved ? "heart" : "heart-outline"}
            size={17}
            color={saved ? Colors.error : "#fff"}
          />
        </Pressable>

        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
          </Text>
        </View>

        {listing.furnished && (
          <View style={styles.furnishedBadge}>
            <Text style={styles.furnishedText}>Furnished</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
          <Text style={styles.price}>
            ${listing.price.toLocaleString()}
            <Text style={styles.priceSub}>/mo</Text>
          </Text>
        </View>

        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.address} numberOfLines={1}>{listing.address}</Text>
        </View>

        <View style={styles.statsRow}>
          <Chip icon="bed-outline" label={bedroomLabel} />
          <View style={styles.dot} />
          <Chip icon="navigate-outline" label={listing.distanceToUniversity} />
          <View style={styles.dot} />
          <Chip icon="time-outline" label={listing.leaseLength} />
        </View>

        {/* Landlord verified row */}
        {listing.landlordVerified && (
          <View style={styles.landlordRow}>
            <View style={styles.landlordAvatar}>
              <Ionicons name="person" size={12} color={Colors.accent} />
            </View>
            <Text style={styles.landlordName}>{listing.landlordName}</Text>
            <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
            <Text style={styles.landlordVerified}>Verified Landlord</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color={Colors.accent} />
              <Text style={styles.ratingText}>{listing.landlordRating}</Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon as any} size={12} color={Colors.textSecondary} />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardPressed: { opacity: 0.94, transform: [{ scale: 0.985 }] },
  imageArea: {
    height: 155,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.accent,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  verifiedText: { fontSize: 11, fontFamily: "Inter_700Bold", color: Colors.primary },
  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  heartBtnActive: { backgroundColor: "rgba(239,68,68,0.2)" },
  typeBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.38)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: "#fff" },
  furnishedBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  furnishedText: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: "#fff" },
  info: { padding: 14, gap: 8 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.text, marginRight: 8 },
  price: { fontSize: 16, fontFamily: "Inter_700Bold", color: Colors.primary },
  priceSub: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textSecondary },
  addressRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  address: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textSecondary },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  chip: { flexDirection: "row", alignItems: "center", gap: 3 },
  chipText: { fontSize: 11, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.border },
  landlordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  landlordAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  landlordName: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: Colors.text },
  landlordVerified: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.success, flex: 1 },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(245,166,35,0.12)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: { fontSize: 11, fontFamily: "Inter_700Bold", color: Colors.accent },
});
