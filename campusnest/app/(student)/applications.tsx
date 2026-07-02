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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { Application, useListings } from "@/context/ListingsContext";

const STAGES: { key: Application["status"]; label: string; icon: string }[] = [
  { key: "submitted", label: "Submitted", icon: "send" },
  { key: "viewed", label: "Viewed", icon: "eye" },
  { key: "interview", label: "Interview", icon: "calendar" },
  { key: "decision", label: "Decision", icon: "checkmark-circle" },
];

const STATUS_COLORS: Record<Application["status"], string> = {
  submitted: Colors.textSecondary,
  viewed: "#3B82F6",
  interview: Colors.accent,
  decision: Colors.success,
};

export default function ApplicationsScreen() {
  const insets = useSafeAreaInsets();
  const { applications } = useListings();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <Text style={styles.headerTitle}>My Applications</Text>
        <Text style={styles.headerSub}>{applications.length} active applications</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {applications.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyTitle}>No applications yet</Text>
            <Text style={styles.emptySub}>Browse listings and apply to properties you love</Text>
            <Pressable style={styles.browseBtn} onPress={() => router.push("/(student)")}>
              <Text style={styles.browseBtnText}>Browse Listings</Text>
            </Pressable>
          </View>
        ) : (
          applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function ApplicationCard({ application }: { application: Application }) {
  const currentStageIdx = STAGES.findIndex((s) => s.key === application.status);
  const statusColor = STATUS_COLORS[application.status];

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <View style={styles.card}>
      {/* Card header */}
      <View style={styles.cardTop}>
        <View style={styles.cardIcon}>
          <Ionicons name="home" size={20} color={Colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{application.listingTitle}</Text>
          <Text style={styles.cardLandlord}>{application.landlordName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Timeline */}
      <View style={styles.timeline}>
        {STAGES.map((stage, idx) => {
          const isCompleted = idx <= currentStageIdx;
          const isActive = idx === currentStageIdx;
          const isLast = idx === STAGES.length - 1;
          const stageColor = isActive
            ? statusColor
            : isCompleted
            ? Colors.success
            : Colors.border;

          return (
            <View key={stage.key} style={styles.timelineStep}>
              <View style={styles.timelineLeft}>
                <View style={[styles.dot, { backgroundColor: stageColor, borderColor: stageColor }]}>
                  {isCompleted && !isActive && (
                    <Ionicons name="checkmark" size={8} color="#fff" />
                  )}
                  {isActive && (
                    <Ionicons name={stage.icon as any} size={8} color="#fff" />
                  )}
                </View>
                {!isLast && (
                  <View style={[styles.connector, { backgroundColor: idx < currentStageIdx ? Colors.success : Colors.border }]} />
                )}
              </View>
              <View style={[styles.timelineContent, isActive && styles.timelineContentActive]}>
                <Text style={[styles.stageName, isActive && { color: statusColor, fontFamily: "Inter_700Bold" }]}>
                  {stage.label}
                </Text>
                {isActive && (
                  <Text style={styles.stageDesc}>
                    {application.status === "submitted" && "Application sent to landlord"}
                    {application.status === "viewed" && "Landlord has reviewed your application"}
                    {application.status === "interview" && "Interview scheduled — check your messages"}
                    {application.status === "decision" && "Final decision pending"}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.footerDate}>
          <Ionicons name="time-outline" size={13} color={Colors.textTertiary} />
          <Text style={styles.footerDateText}>Applied {formatDate(application.submittedAt)}</Text>
        </View>
        <Pressable
          style={styles.msgBtn}
          onPress={() => router.push("/(student)/messages")}
        >
          <Ionicons name="chatbubble-outline" size={14} color={Colors.primary} />
          <Text style={styles.msgBtnText}>Message Landlord</Text>
        </Pressable>
      </View>
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
  scroll: { padding: 16, gap: 16 },
  empty: { paddingTop: 80, alignItems: "center", gap: 10 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold", color: Colors.textSecondary },
  emptySub: { fontSize: 14, fontFamily: "Inter_400Regular", color: Colors.textTertiary, textAlign: "center" },
  browseBtn: {
    marginTop: 8,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  browseBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.primary },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 15, fontFamily: "Inter_700Bold", color: Colors.text },
  cardLandlord: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textSecondary, marginTop: 2 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  timeline: { gap: 0 },
  timelineStep: { flexDirection: "row", gap: 14 },
  timelineLeft: { alignItems: "center", width: 22 },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.border,
  },
  connector: { width: 2, flex: 1, minHeight: 14, marginTop: 2, marginBottom: 2 },
  timelineContent: { flex: 1, paddingBottom: 14, paddingTop: 2, gap: 3 },
  timelineContentActive: {
    backgroundColor: Colors.surfaceGray,
    borderRadius: 10,
    padding: 10,
    marginBottom: 2,
  },
  stageName: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: Colors.textSecondary },
  stageDesc: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textSecondary, lineHeight: 17 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  footerDate: { flexDirection: "row", alignItems: "center", gap: 4 },
  footerDateText: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textTertiary },
  msgBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  msgBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: Colors.primary },
});
