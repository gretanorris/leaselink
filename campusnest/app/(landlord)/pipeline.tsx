import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
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

type Stage = "new" | "reviewed" | "tour" | "offer" | "signed";

interface Applicant {
  id: string;
  name: string;
  email: string;
  property: string;
  creditScore: number;
  cosigner: boolean;
  stage: Stage;
  appliedDate: string;
  trustSummary: string;
}

const INITIAL_APPLICANTS: Applicant[] = [
  { id: "1", name: "Jordan Smith", email: "jsmith...@berkeley.edu", property: "Modern Studio – Telegraph", creditScore: 750, cosigner: true, stage: "new", appliedDate: "Apr 18", trustSummary: "Excellent credit, verified co-signer, 3.8 GPA" },
  { id: "2", name: "Li Chen", email: "lchen...@berkeley.edu", property: "2BR – Durant Ave", creditScore: 720, cosigner: true, stage: "reviewed", appliedDate: "Apr 16", trustSummary: "Good credit, co-signer income $120k/yr" },
  { id: "3", name: "Marcus Williams", email: "mwilliams...@berkeley.edu", property: "Modern Studio – Telegraph", creditScore: 695, cosigner: false, stage: "tour", appliedDate: "Apr 14", trustSummary: "Fair credit, no co-signer. Consider request." },
  { id: "4", name: "Priya Patel", email: "ppatel...@berkeley.edu", property: "Student House – Benvenue", creditScore: 740, cosigner: true, stage: "offer", appliedDate: "Apr 12", trustSummary: "Strong profile. Verified student 4th year." },
  { id: "5", name: "Alex Nguyen", email: "anguyen...@berkeley.edu", property: "3BR House – Euclid", creditScore: 780, cosigner: true, stage: "signed", appliedDate: "Apr 8", trustSummary: "Excellent profile. Lease signed via DocuSign." },
  { id: "6", name: "Taylor Brown", email: "tbrown...@berkeley.edu", property: "2BR – Durant Ave", creditScore: 660, cosigner: false, stage: "new", appliedDate: "Apr 19", trustSummary: "Building credit. No co-signer on file." },
];

const STAGES: { key: Stage; label: string; color: string; icon: string }[] = [
  { key: "new", label: "New", color: Colors.textSecondary, icon: "mail-open-outline" },
  { key: "reviewed", label: "Reviewed", color: "#3B82F6", icon: "eye-outline" },
  { key: "tour", label: "Tour", color: Colors.accent, icon: "calendar-outline" },
  { key: "offer", label: "Offer", color: "#8B5CF6", icon: "document-text-outline" },
  { key: "signed", label: "Signed", color: Colors.success, icon: "checkmark-circle-outline" },
];

export default function PipelineScreen() {
  const insets = useSafeAreaInsets();
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [activeStage, setActiveStage] = useState<Stage>("new");

  const moveApplicant = (id: string, newStage: Stage) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, stage: newStage } : a))
    );
    if (selected?.id === id) {
      setSelected((prev) => prev ? { ...prev, stage: newStage } : null);
    }
  };

  const stageApplicants = applicants.filter((a) => a.stage === activeStage);
  const stageInfo = STAGES.find((s) => s.key === activeStage)!;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Applicant Pipeline</Text>
        <Text style={styles.headerSub}>Move applicants through your hiring funnel</Text>
      </View>

      {/* Stage tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stageTabs}
      >
        {STAGES.map((s) => {
          const count = applicants.filter((a) => a.stage === s.key).length;
          const isActive = activeStage === s.key;
          return (
            <Pressable
              key={s.key}
              style={[styles.stageTab, isActive && { borderBottomColor: s.color, borderBottomWidth: 3 }]}
              onPress={() => setActiveStage(s.key)}
            >
              <View style={[styles.stageCount, { backgroundColor: `${s.color}20` }]}>
                <Text style={[styles.stageCountText, { color: s.color }]}>{count}</Text>
              </View>
              <Text style={[styles.stageTabText, isActive && { color: s.color, fontFamily: "Inter_700Bold" }]}>
                {s.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {stageApplicants.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name={stageInfo.icon as any} size={44} color={Colors.border} />
            <Text style={styles.emptyTitle}>No applicants in {stageInfo.label}</Text>
            <Text style={styles.emptySub}>Move applicants here from other stages</Text>
          </View>
        ) : (
          stageApplicants.map((applicant) => (
            <Pressable
              key={applicant.id}
              style={[styles.card, selected?.id === applicant.id && styles.cardSelected]}
              onPress={() => setSelected(selected?.id === applicant.id ? null : applicant)}
            >
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <Ionicons name="school" size={18} color={Colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName}>{applicant.name}</Text>
                  <Text style={styles.cardEmail}>{applicant.email}</Text>
                </View>
                <View style={[styles.stagePill, { backgroundColor: `${stageInfo.color}18` }]}>
                  <Text style={[styles.stagePillText, { color: stageInfo.color }]}>{stageInfo.label}</Text>
                </View>
              </View>

              <View style={styles.cardMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="home-outline" size={12} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>{applicant.property}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="trending-up-outline" size={12} color={Colors.primary} />
                  <Text style={styles.metaText}>Score: {applicant.creditScore}</Text>
                </View>
                {applicant.cosigner && (
                  <View style={styles.metaItem}>
                    <Ionicons name="document-text" size={12} color={Colors.success} />
                    <Text style={[styles.metaText, { color: Colors.success }]}>Co-signer ✓</Text>
                  </View>
                )}
              </View>

              {/* Expanded: Trust Summary + Move buttons */}
              {selected?.id === applicant.id && (
                <View style={styles.expanded}>
                  <View style={styles.trustBox}>
                    <View style={styles.trustHeader}>
                      <Ionicons name="shield-checkmark-outline" size={16} color={Colors.primary} />
                      <Text style={styles.trustTitle}>AI Trust Summary</Text>
                    </View>
                    <Text style={styles.trustText}>{applicant.trustSummary}</Text>
                  </View>

                  <Text style={styles.moveLabel}>Move to stage:</Text>
                  <View style={styles.moveRow}>
                    {STAGES.filter((s) => s.key !== applicant.stage).map((s) => (
                      <Pressable
                        key={s.key}
                        style={[styles.moveBtn, { borderColor: s.color }]}
                        onPress={() => moveApplicant(applicant.id, s.key)}
                      >
                        <Ionicons name={s.icon as any} size={13} color={s.color} />
                        <Text style={[styles.moveBtnText, { color: s.color }]}>{s.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.cardFooter}>
                <Ionicons name="time-outline" size={12} color={Colors.textTertiary} />
                <Text style={styles.cardDate}>Applied {applicant.appliedDate}</Text>
                <View style={{ flex: 1 }} />
                <Ionicons name={selected?.id === applicant.id ? "chevron-up" : "chevron-down"} size={16} color={Colors.textTertiary} />
              </View>
            </Pressable>
          ))
        )}
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
    gap: 4,
  },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#fff" },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  stageTabs: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  stageTab: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 72,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  stageCount: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  stageCountText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  stageTabText: { fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  scroll: { padding: 14, gap: 12 },
  empty: { paddingTop: 80, alignItems: "center", gap: 10 },
  emptyTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: Colors.textSecondary },
  emptySub: { fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.textTertiary, textAlign: "center" },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSelected: { borderColor: Colors.primary, borderWidth: 2 },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cardName: { fontSize: 15, fontFamily: "Inter_700Bold", color: Colors.text },
  cardEmail: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textSecondary, marginTop: 1 },
  stagePill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  stagePillText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  cardMeta: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  expanded: { gap: 12 },
  trustBox: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trustHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  trustTitle: { fontSize: 13, fontFamily: "Inter_700Bold", color: Colors.text },
  trustText: { fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.textSecondary, lineHeight: 19 },
  moveLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: Colors.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 },
  moveRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  moveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  moveBtnText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  cardFooter: { flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 4, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  cardDate: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textTertiary },
});
