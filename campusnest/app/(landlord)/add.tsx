import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useListings } from "@/context/ListingsContext";

type Step = 1 | 2 | 3;

const AMENITY_OPTIONS = ["WiFi", "Laundry", "Gym", "Parking", "AC", "Dishwasher", "Yard", "Fireplace", "Storage", "Bike Parking", "Washer/Dryer", "Kitchen"];

const STEP_LABELS: Record<Step, string> = {
  1: "Basic Info",
  2: "Details & Amenities",
  3: "Requirements",
};

export default function AddListingScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addListing } = useListings();

  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Basic Info
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"apartment" | "studio" | "house" | "room">("apartment");
  const [leaseLength, setLeaseLength] = useState<"6-month" | "12-month" | "flexible">("12-month");

  // Step 2: Details & Amenities
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [sqft, setSqft] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [furnished, setFurnished] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);

  // Step 3: Requirements
  const [requiresCosigner, setRequiresCosigner] = useState(false);
  const [minCreditScore, setMinCreditScore] = useState("650");
  const [availableFrom, setAvailableFrom] = useState("2024-08-01");

  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim() || !address.trim() || !price.trim()) {
        Alert.alert("Missing Info", "Please fill in title, address, and price.");
        return;
      }
    }
    if (step < 3) setStep((s) => (s + 1) as Step);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addListing({
        landlordId: user.id,
        landlordName: user.name,
        landlordVerified: true,
        landlordRating: 4.9,
        title: title.trim(),
        address: address.trim(),
        city: "Berkeley, CA",
        price: parseInt(price) || 0,
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseFloat(bathrooms) || 1,
        sqft: parseInt(sqft) || 0,
        type,
        amenities: selectedAmenities,
        description: description.trim() || "No description provided.",
        imageColor: Colors.primary,
        availableFrom,
        petFriendly,
        furnished,
        distanceToUniversity: "0.5 mi",
        leaseLength,
        requiresCosigner,
        minCreditScore: parseInt(minCreditScore) || 650,
        verified: true,
      });
      Alert.alert("Listing Published!", "Your listing is now live on the marketplace.", [
        { text: "Done", onPress: () => router.push("/(landlord)") },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => (step === 1 ? router.back() : setStep((s) => (s - 1) as Step))}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>New Listing</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Step progress */}
        <View style={styles.stepRow}>
          {([1, 2, 3] as Step[]).map((s) => (
            <React.Fragment key={s}>
              <View style={[styles.stepDot, step >= s && styles.stepDotActive]}>
                {step > s ? (
                  <Ionicons name="checkmark" size={10} color="#fff" />
                ) : (
                  <Text style={[styles.stepNum, step === s && { color: Colors.primary }]}>{s}</Text>
                )}
              </View>
              {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
            </React.Fragment>
          ))}
        </View>
        <Text style={styles.stepLabel}>Step {step} of 3 — {STEP_LABELS[step]}</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 120 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 && (
            <View style={styles.formSection}>
              <Field label="Listing Title" placeholder="e.g. Cozy Studio near Sather Gate" value={title} onChangeText={setTitle} />
              <Field label="Street Address" placeholder="e.g. 2345 Telegraph Ave" value={address} onChangeText={setAddress} />
              <Field label="Monthly Rent ($)" placeholder="e.g. 1850" value={price} onChangeText={setPrice} keyboardType="numeric" />

              <Text style={styles.fieldLabel}>Property Type</Text>
              <View style={styles.optionRow}>
                {(["studio", "apartment", "house", "room"] as const).map((t) => (
                  <Pressable
                    key={t}
                    style={[styles.optionBtn, type === t && styles.optionBtnActive]}
                    onPress={() => setType(t)}
                  >
                    <Text style={[styles.optionBtnText, type === t && styles.optionBtnTextActive]}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Lease Length</Text>
              <View style={styles.optionRow}>
                {(["6-month", "12-month", "flexible"] as const).map((l) => (
                  <Pressable
                    key={l}
                    style={[styles.optionBtn, leaseLength === l && styles.optionBtnActive]}
                    onPress={() => setLeaseLength(l)}
                  >
                    <Text style={[styles.optionBtnText, leaseLength === l && styles.optionBtnTextActive]}>
                      {l}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.formSection}>
              <View style={styles.rowFields}>
                <Field label="Bedrooms (0=Studio)" placeholder="0" value={bedrooms} onChangeText={setBedrooms} keyboardType="numeric" style={{ flex: 1 }} />
                <Field label="Bathrooms" placeholder="1" value={bathrooms} onChangeText={setBathrooms} keyboardType="numeric" style={{ flex: 1 }} />
              </View>

              <Field label="Square Footage" placeholder="e.g. 450" value={sqft} onChangeText={setSqft} keyboardType="numeric" />
              <Field label="Description" placeholder="Describe the unit, neighborhood, and highlights..." value={description} onChangeText={setDescription} multiline />

              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchLabel}>Furnished</Text>
                  <Text style={styles.switchSub}>Unit includes basic furniture</Text>
                </View>
                <Switch value={furnished} onValueChange={setFurnished} trackColor={{ false: Colors.border, true: Colors.accent }} thumbColor="#fff" />
              </View>

              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchLabel}>Pet Friendly</Text>
                  <Text style={styles.switchSub}>Cats and/or dogs allowed</Text>
                </View>
                <Switch value={petFriendly} onValueChange={setPetFriendly} trackColor={{ false: Colors.border, true: Colors.accent }} thumbColor="#fff" />
              </View>

              <Text style={styles.fieldLabel}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {AMENITY_OPTIONS.map((a) => (
                  <Pressable
                    key={a}
                    style={[styles.amenityChip, selectedAmenities.includes(a) && styles.amenityChipActive]}
                    onPress={() => toggleAmenity(a)}
                  >
                    {selectedAmenities.includes(a) && (
                      <Ionicons name="checkmark" size={12} color={Colors.primary} />
                    )}
                    <Text style={[styles.amenityChipText, selectedAmenities.includes(a) && styles.amenityChipTextActive]}>
                      {a}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.formSection}>
              <View style={styles.requirementsHeader}>
                <Ionicons name="shield-checkmark-outline" size={22} color={Colors.primary} />
                <Text style={styles.requirementsTitle}>Tenant Requirements</Text>
              </View>
              <Text style={styles.requirementsDesc}>
                Set minimum standards for student applicants. Only verified .edu students can apply.
              </Text>

              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchLabel}>Require Co-signer</Text>
                  <Text style={styles.switchSub}>Applicants must have a co-signer on file</Text>
                </View>
                <Switch value={requiresCosigner} onValueChange={setRequiresCosigner} trackColor={{ false: Colors.border, true: Colors.accent }} thumbColor="#fff" />
              </View>

              <Field
                label="Minimum Credit Score"
                placeholder="e.g. 650"
                value={minCreditScore}
                onChangeText={setMinCreditScore}
                keyboardType="numeric"
              />

              <Field
                label="Available From (YYYY-MM-DD)"
                placeholder="e.g. 2024-08-01"
                value={availableFrom}
                onChangeText={setAvailableFrom}
              />

              {/* CalID verification note */}
              <View style={styles.calidNote}>
                <Ionicons name="finger-print-outline" size={16} color={Colors.primary} />
                <Text style={styles.calidNoteText}>
                  All applicants are pre-verified via CalNet SSO before they can apply to your listing.
                </Text>
              </View>

              {/* STRIPE placeholder for security deposit */}
              <View style={styles.integrationNote}>
                <Ionicons name="card-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.integrationNoteText}>
                  Stripe security deposit collection will be enabled after listing approval.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: Platform.OS === "web" ? 24 : insets.bottom + 12 }]}>
        {step < 3 ? (
          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>Continue to {STEP_LABELS[(step + 1) as Step]}</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
          </Pressable>
        ) : (
          <Pressable style={styles.nextBtn} onPress={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={18} color={Colors.primary} />
                <Text style={styles.nextBtnText}>Publish Listing</Text>
              </>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

function Field({
  label, placeholder, value, onChangeText, keyboardType, multiline, style,
}: {
  label: string; placeholder: string; value: string; onChangeText: (t: string) => void;
  keyboardType?: any; multiline?: boolean; style?: object;
}) {
  return (
    <View style={[{ gap: 6 }, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        returnKeyType={multiline ? "default" : "next"}
      />
    </View>
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
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 0 },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: { backgroundColor: Colors.accent },
  stepNum: { fontSize: 12, fontFamily: "Inter_700Bold", color: "rgba(255,255,255,0.7)" },
  stepLine: { flex: 1, height: 2, backgroundColor: "rgba(255,255,255,0.2)", maxWidth: 60 },
  stepLineActive: { backgroundColor: Colors.accent },
  stepLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.7)" },
  scroll: { paddingHorizontal: 16, paddingTop: 20, gap: 16 },
  formSection: { gap: 16 },
  rowFields: { flexDirection: "row", gap: 12 },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
  },
  inputMultiline: { minHeight: 100, textAlignVertical: "top", paddingTop: 13 },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  optionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceGray,
  },
  optionBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionBtnText: { fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  optionBtnTextActive: { color: "#fff", fontFamily: "Inter_700Bold" },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  switchLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.text },
  switchSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textSecondary, marginTop: 2 },
  amenitiesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceGray,
  },
  amenityChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accentDark },
  amenityChipText: { fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  amenityChipTextActive: { color: Colors.primary, fontFamily: "Inter_700Bold" },
  requirementsHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  requirementsTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: Colors.text },
  requirementsDesc: { fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.textSecondary, lineHeight: 19 },
  calidNote: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  calidNoteText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textSecondary, lineHeight: 18 },
  integrationNote: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: Colors.surfaceGray,
  },
  integrationNoteText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textSecondary, lineHeight: 18 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 15,
  },
  nextBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: Colors.primary },
});
