import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { useListings } from "@/context/ListingsContext";

type Tab = "overview" | "amenities" | "reviews";

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { listings, isSaved, toggleSave } = useListings();
  const [tab, setTab] = useState<Tab>("overview");
  const [applied, setApplied] = useState(false);

  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Listing not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: Colors.primary }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const saved = isSaved(listing.id);

  const handleApply = () => {
    setApplied(true);
    Alert.alert(
      "Application Submitted",
      `Your application has been sent to ${listing.landlordName}. Track it in your Applications tab.`
    );
  };

  const bedroomLabel = listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} Bed`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: listing.imageColor }]}>
        <Ionicons name="home" size={64} color="rgba(245,166,35,0.4)" />

        {listing.verified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={14} color={Colors.primary} />
            <Text style={styles.verifiedText}>Verified Listing</Text>
          </View>
        )}

        <Pressable
          style={[styles.backBtn, { top: Platform.OS === "web" ? 76 : insets.top + 12 }]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>

        <Pressable
          style={[styles.heartBtn, { top: Platform.OS === "web" ? 76 : insets.top + 12 }]}
          onPress={() => toggleSave(listing.id)}
        >
          <Ionicons name={saved ? "heart" : "heart-outline"} size={22} color={saved ? Colors.error : "#fff"} />
        </Pressable>
      </View>

      {/* Sheet */}
      <View style={styles.sheet}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.listingTitle}>{listing.title}</Text>
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.address}>{listing.address}, {listing.city}</Text>
            </View>
          </View>
          <View style={styles.priceBlock}>
            <Text style={styles.price}>${listing.price.toLocaleString()}</Text>
            <Text style={styles.priceSub}>/month</Text>
          </View>
        </View>

        {/* Quick stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
          <Stat icon="bed-outline" label={bedroomLabel} />
          <Stat icon="water-outline" label={`${listing.bathrooms} Bath`} />
          <Stat icon="expand-outline" label={`${listing.sqft} sqft`} />
          <Stat icon="navigate-outline" label={listing.distanceToUniversity} />
          <Stat icon="time-outline" label={listing.leaseLength} />
        </ScrollView>

        {/* Verified Landlord Trust Row */}
        <View style={styles.landlordTrust}>
          <View style={styles.landlordAvatar}>
            <Ionicons name="person" size={18} color={Colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.landlordNameRow}>
              <Text style={styles.landlordName}>{listing.landlordName}</Text>
              {listing.landlordVerified && (
                <View style={styles.verifiedLandlord}>
                  <Ionicons name="shield-checkmark" size={11} color="#fff" />
                  <Text style={styles.verifiedLandlordText}>Verified</Text>
                </View>
              )}
            </View>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons key={s} name={s <= Math.round(listing.landlordRating) ? "star" : "star-outline"} size={12} color={Colors.accent} />
              ))}
              <Text style={styles.ratingNum}>{listing.landlordRating}</Text>
            </View>
          </View>
          <Pressable style={styles.msgBtn} onPress={() => router.push("/(student)/messages")}>
            <Ionicons name="chatbubble-ellipses-outline" size={15} color={Colors.primary} />
            <Text style={styles.msgBtnText}>Message</Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {(["overview", "amenities", "reviews"] as Tab[]).map((t) => (
            <Pressable key={t} style={[styles.tabBtn, tab === t && styles.tabBtnActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === "reviews" ? `Reviews (${listing.reviews.length})` : t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.tabContent, { paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 120 }]}
        >
          {tab === "overview" && (
            <Animated.View entering={FadeIn.duration(250)} style={styles.tabPane}>
              <Text style={styles.sectionLabel}>About this unit</Text>
              <Text style={styles.desc}>{listing.description}</Text>

              <Text style={styles.sectionLabel}>Availability</Text>
              <View style={styles.detailGrid}>
                <DetailRow icon="calendar-outline" label="Available From" value={listing.availableFrom} />
                <DetailRow icon="time-outline" label="Lease Length" value={listing.leaseLength} />
                <DetailRow icon="paw-outline" label="Pet Policy" value={listing.petFriendly ? "Pets Allowed" : "No Pets"} />
                <DetailRow icon="business-outline" label="Furnished" value={listing.furnished ? "Yes" : "No"} />
              </View>

              <Text style={styles.sectionLabel}>Tenant Requirements</Text>
              <View style={styles.reqBox}>
                <View style={styles.reqRow}>
                  <Ionicons name={listing.requiresCosigner ? "alert-circle" : "checkmark-circle"} size={16} color={listing.requiresCosigner ? Colors.accent : Colors.success} />
                  <Text style={styles.reqText}>Co-signer {listing.requiresCosigner ? "Required" : "Not Required"}</Text>
                </View>
                <View style={styles.reqRow}>
                  <Ionicons name="trending-up-outline" size={16} color={Colors.primary} />
                  <Text style={styles.reqText}>Minimum Credit Score: {listing.minCreditScore}</Text>
                </View>
              </View>

              {/* STRIPE: "Pay Security Deposit" — stripe.paymentIntents.create({ amount, currency: 'usd' }) */}
              <View style={styles.integrationPlaceholder}>
                <Ionicons name="card-outline" size={18} color={Colors.textSecondary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.integrationTitle}>Pay Security Deposit</Text>
                  <Text style={styles.integrationSub}>Stripe integration — available after approval</Text>
                </View>
                <Ionicons name="lock-closed-outline" size={14} color={Colors.textTertiary} />
              </View>

              {/* DOCUSIGN: "Sign Lease" — docusign.envelopesApi.createEnvelope(accountId, envelopeDef) */}
              <View style={styles.integrationPlaceholder}>
                <Ionicons name="document-text-outline" size={18} color={Colors.textSecondary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.integrationTitle}>Sign Lease Digitally</Text>
                  <Text style={styles.integrationSub}>DocuSign e-signature — available after approval</Text>
                </View>
                <Ionicons name="lock-closed-outline" size={14} color={Colors.textTertiary} />
              </View>

              {/* CALID: Identity verification via CalID SSO — calnet.berkeley.edu/calnet/auth */}
            </Animated.View>
          )}

          {tab === "amenities" && (
            <Animated.View entering={FadeIn.duration(250)} style={styles.tabPane}>
              <Text style={styles.sectionLabel}>What's Included</Text>
              {listing.amenities.length > 0 ? (
                <View style={styles.amenitiesGrid}>
                  {listing.amenities.map((a) => (
                    <View key={a} style={styles.amenityItem}>
                      <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                      <Text style={styles.amenityText}>{a}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>No amenities listed for this property.</Text>
              )}
            </Animated.View>
          )}

          {tab === "reviews" && (
            <Animated.View entering={FadeIn.duration(250)} style={styles.tabPane}>
              {listing.reviews.length === 0 ? (
                <View style={styles.noReviews}>
                  <Ionicons name="star-outline" size={38} color={Colors.border} />
                  <Text style={styles.noReviewsText}>No reviews yet</Text>
                  <Text style={styles.noReviewsSub}>Be the first verified Berkeley resident to leave a review</Text>
                </View>
              ) : (
                listing.reviews.map((r) => (
                  <View key={r.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewAvatar}>
                        <Ionicons name="school" size={14} color={Colors.accent} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.reviewNameRow}>
                          <Text style={styles.reviewAuthor}>{r.author}</Text>
                          <View style={styles.berkVerified}>
                            <Ionicons name="shield-checkmark" size={10} color={Colors.success} />
                            <Text style={styles.berkVerifiedText}>Berkeley Student</Text>
                          </View>
                        </View>
                        <View style={styles.starsRow}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Ionicons key={s} name={s <= r.rating ? "star" : "star-outline"} size={13} color={Colors.accent} />
                          ))}
                          <Text style={styles.reviewDate}>{r.date}</Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.reviewText}>{r.text}</Text>
                  </View>
                ))
              )}
            </Animated.View>
          )}
        </ScrollView>
      </View>

      {/* Apply Bar */}
      <View style={[styles.applyBar, { paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 12 }]}>
        <Pressable style={[styles.applyBtn, applied && styles.applyBtnApplied]} onPress={handleApply} disabled={applied}>
          <Ionicons name={applied ? "checkmark-circle" : "send-outline"} size={18} color={applied ? "#fff" : Colors.primary} />
          <Text style={[styles.applyBtnText, applied && { color: "#fff" }]}>
            {applied ? "Application Submitted" : "Apply Now"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Stat({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon as any} size={15} color={Colors.primary} />
      <Text style={styles.statText}>{label}</Text>
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon as any} size={15} color={Colors.textSecondary} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: Colors.textSecondary },
  hero: { height: 220, alignItems: "center", justifyContent: "center", position: "relative" },
  verifiedBadge: {
    position: "absolute", bottom: 14, left: 14,
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: Colors.accent, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  verifiedText: { fontSize: 12, fontFamily: "Inter_700Bold", color: Colors.primary },
  backBtn: {
    position: "absolute", left: 14, width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center",
  },
  heartBtn: {
    position: "absolute", right: 14, width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center",
  },
  sheet: { flex: 1, backgroundColor: Colors.background, borderTopLeftRadius: 22, borderTopRightRadius: 22, marginTop: -20 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: 18, paddingBottom: 12, gap: 12 },
  listingTitle: { fontSize: 20, fontFamily: "Inter_700Bold", color: Colors.text, marginBottom: 4 },
  addressRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  address: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textSecondary },
  priceBlock: { alignItems: "flex-end" },
  price: { fontSize: 22, fontFamily: "Inter_700Bold", color: Colors.primary },
  priceSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textSecondary },
  statsRow: { paddingHorizontal: 14, paddingBottom: 12, gap: 8 },
  stat: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: Colors.surfaceGray, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: Colors.border,
  },
  statText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: Colors.text },
  landlordTrust: {
    flexDirection: "row", alignItems: "center", gap: 12,
    marginHorizontal: 14, marginBottom: 12, padding: 14,
    borderRadius: 14, backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1, borderColor: Colors.border,
  },
  landlordAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center",
  },
  landlordNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  landlordName: { fontSize: 14, fontFamily: "Inter_700Bold", color: Colors.text },
  verifiedLandlord: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: Colors.success, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
  },
  verifiedLandlordText: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#fff" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 2, marginTop: 3 },
  ratingNum: { fontSize: 12, fontFamily: "Inter_700Bold", color: Colors.accent, marginLeft: 4 },
  msgBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: Colors.accent, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
  },
  msgBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: Colors.primary },
  tabsRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: Colors.border, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabBtnActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  tabTextActive: { fontFamily: "Inter_700Bold", color: Colors.primary },
  tabContent: { paddingHorizontal: 16 },
  tabPane: { gap: 16, paddingTop: 16 },
  sectionLabel: { fontSize: 12, fontFamily: "Inter_700Bold", color: Colors.text, textTransform: "uppercase", letterSpacing: 0.6 },
  desc: { fontSize: 14, fontFamily: "Inter_400Regular", color: Colors.textSecondary, lineHeight: 22 },
  detailGrid: { gap: 10 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  detailLabel: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  detailValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: Colors.text },
  reqBox: { gap: 10, backgroundColor: Colors.surfaceGray, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.border },
  reqRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  reqText: { fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.text },
  integrationPlaceholder: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderWidth: 1.5, borderColor: Colors.border, borderStyle: "dashed",
    borderRadius: 12, padding: 14, backgroundColor: Colors.surfaceGray,
  },
  integrationTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: Colors.text },
  integrationSub: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textTertiary, marginTop: 1 },
  amenitiesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  amenityItem: { flexDirection: "row", alignItems: "center", gap: 6, width: "46%" },
  amenityText: { fontSize: 14, fontFamily: "Inter_500Medium", color: Colors.text },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", color: Colors.textSecondary },
  noReviews: { alignItems: "center", gap: 8, paddingTop: 40 },
  noReviewsText: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: Colors.textSecondary },
  noReviewsSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.textTertiary, textAlign: "center" },
  reviewCard: { backgroundColor: Colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.borderLight, gap: 10 },
  reviewHeader: { flexDirection: "row", gap: 10 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  reviewNameRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  reviewAuthor: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: Colors.text },
  berkVerified: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: Colors.successLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },
  berkVerifiedText: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: Colors.success },
  starsRow: { flexDirection: "row", alignItems: "center", gap: 2, marginTop: 3 },
  reviewDate: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textTertiary, marginLeft: 6 },
  reviewText: { fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.textSecondary, lineHeight: 20 },
  applyBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.background, paddingHorizontal: 16, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  applyBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: Colors.accent, borderRadius: 14, paddingVertical: 15,
  },
  applyBtnApplied: { backgroundColor: Colors.success },
  applyBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: Colors.primary },
});
