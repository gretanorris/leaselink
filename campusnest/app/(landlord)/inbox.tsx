import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";

interface InboxThread {
  id: string;
  studentName: string;
  email: string;
  property: string;
  verified: boolean;
  creditScore: number;
  cosigner: boolean;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: { id: string; sender: "landlord" | "student"; text: string; time: string }[];
}

const THREADS: InboxThread[] = [
  {
    id: "t1",
    studentName: "Jordan Smith",
    email: "jsmith...@berkeley.edu",
    property: "Modern Studio – Telegraph",
    verified: true,
    creditScore: 750,
    cosigner: true,
    lastMessage: "Thank you! I'm available Thursday at 3pm.",
    lastTime: "10:42 AM",
    unread: 1,
    messages: [
      { id: "m1", sender: "student", text: "Hi! I'm very interested in the studio. Is Thursday available for a tour?", time: "Yesterday 3:15 PM" },
      { id: "m2", sender: "landlord", text: "Hi Jordan! Thanks for applying. Thursday at 3pm works great.", time: "Yesterday 4:00 PM" },
      { id: "m3", sender: "student", text: "Thank you! I'm available Thursday at 3pm.", time: "10:42 AM" },
    ],
  },
  {
    id: "t2",
    studentName: "Li Chen",
    email: "lchen...@berkeley.edu",
    property: "2BR – Durant Ave",
    verified: true,
    creditScore: 720,
    cosigner: true,
    lastMessage: "We'd love to schedule an interview next week.",
    lastTime: "Yesterday",
    unread: 0,
    messages: [
      { id: "m4", sender: "student", text: "Hello, I submitted my application for the Durant Ave apartment.", time: "2 days ago" },
      { id: "m5", sender: "landlord", text: "We'd love to schedule an interview next week.", time: "Yesterday" },
    ],
  },
  {
    id: "t3",
    studentName: "Taylor Brown",
    email: "tbrown...@berkeley.edu",
    property: "2BR – Durant Ave",
    verified: true,
    creditScore: 660,
    cosigner: false,
    lastMessage: "Could you tell me more about the co-signer requirement?",
    lastTime: "Mon",
    unread: 0,
    messages: [
      { id: "m6", sender: "student", text: "Could you tell me more about the co-signer requirement?", time: "Mon" },
    ],
  },
];

export default function InboxScreen() {
  const insets = useSafeAreaInsets();
  const [threads, setThreads] = useState<InboxThread[]>(THREADS);
  const [activeThread, setActiveThread] = useState<InboxThread | null>(null);
  const [input, setInput] = useState("");

  if (activeThread) {
    const thread = threads.find((t) => t.id === activeThread.id) || activeThread;

    const handleSend = () => {
      if (!input.trim()) return;
      setThreads((prev) =>
        prev.map((t) =>
          t.id === thread.id
            ? {
                ...t,
                messages: [...t.messages, { id: Date.now().toString(), sender: "landlord", text: input.trim(), time: "Just now" }],
                lastMessage: input.trim(),
                lastTime: "Just now",
              }
            : t
        )
      );
      setInput("");
    };

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <StatusBar barStyle="light-content" />

        {/* Chat header with student info */}
        <View style={[styles.chatHeader, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 8 }]}>
          <Pressable style={styles.backBtn} onPress={() => setActiveThread(null)}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
          <View style={styles.chatAvatar}>
            <Ionicons name="school" size={18} color={Colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.chatNameRow}>
              <Text style={styles.chatName}>{thread.studentName}</Text>
              {thread.verified && (
                <View style={styles.verifiedChip}>
                  <Ionicons name="shield-checkmark" size={10} color="#fff" />
                  <Text style={styles.verifiedChipText}>Verified</Text>
                </View>
              )}
            </View>
            <Text style={styles.chatSub}>{thread.property}</Text>
          </View>
        </View>

        {/* Student trust summary */}
        <View style={styles.trustBar}>
          <View style={styles.trustItem}>
            <Ionicons name="trending-up-outline" size={13} color={Colors.primary} />
            <Text style={styles.trustItemText}>Score: {thread.creditScore}</Text>
          </View>
          {thread.cosigner && (
            <View style={styles.trustItem}>
              <Ionicons name="document-text" size={13} color={Colors.success} />
              <Text style={[styles.trustItemText, { color: Colors.success }]}>Co-signer ✓</Text>
            </View>
          )}
          <View style={styles.trustItem}>
            <Ionicons name="mail-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.trustItemText}>{thread.email}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.chatMessages} showsVerticalScrollIndicator={false}>
          {thread.messages.map((msg) => {
            const isMe = msg.sender === "landlord";
            return (
              <View key={msg.id} style={[styles.msgRow, isMe && styles.msgRowMe]}>
                {!isMe && (
                  <View style={styles.msgAvatar}>
                    <Ionicons name="school" size={12} color={Colors.accent} />
                  </View>
                )}
                <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{msg.text}</Text>
                  <Text style={[styles.bubbleTime, isMe && styles.bubbleTimeMe]}>{msg.time}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={[styles.inputBar, { paddingBottom: Platform.OS === "web" ? 16 : insets.bottom + 10 }]}>
          <TextInput
            style={styles.chatInput}
            value={input}
            onChangeText={setInput}
            placeholder="Reply to student..."
            placeholderTextColor={Colors.textTertiary}
            multiline
          />
          <Pressable style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} onPress={handleSend} disabled={!input.trim()}>
            <Ionicons name="send" size={18} color={input.trim() ? Colors.primary : Colors.textTertiary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Inbox</Text>
        <Text style={styles.headerSub}>Messages from applicants, sorted by property</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {threads.map((thread) => (
          <Pressable
            key={thread.id}
            style={({ pressed }) => [styles.threadCard, pressed && { opacity: 0.85 }]}
            onPress={() => setActiveThread(thread)}
          >
            <View style={styles.avatarWrap}>
              <View style={styles.listAvatar}>
                <Ionicons name="school" size={20} color={Colors.accent} />
              </View>
              {thread.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{thread.unread}</Text>
                </View>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.threadTopRow}>
                <View style={styles.nameRow}>
                  <Text style={styles.threadName}>{thread.studentName}</Text>
                  {thread.verified && (
                    <Ionicons name="shield-checkmark" size={13} color={Colors.success} />
                  )}
                </View>
                <Text style={styles.threadTime}>{thread.lastTime}</Text>
              </View>
              <Text style={styles.threadProperty}>{thread.property}</Text>
              <View style={styles.threadMetaRow}>
                <Text style={[styles.threadLast, thread.unread > 0 && styles.threadLastUnread]} numberOfLines={1}>
                  {thread.lastMessage}
                </Text>
              </View>
              <View style={styles.badgeRow}>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreBadgeText}>{thread.creditScore}</Text>
                </View>
                {thread.cosigner && (
                  <View style={styles.cosignerBadge}>
                    <Text style={styles.cosignerBadgeText}>Co-signer</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        ))}
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
  scroll: { padding: 14, gap: 10 },
  threadCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  avatarWrap: { position: "relative" },
  listAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#fff" },
  threadTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  threadName: { fontSize: 15, fontFamily: "Inter_700Bold", color: Colors.text },
  threadTime: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textTertiary },
  threadProperty: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textSecondary, marginTop: 1 },
  threadMetaRow: { marginTop: 3 },
  threadLast: { fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.textSecondary },
  threadLastUnread: { fontFamily: "Inter_600SemiBold", color: Colors.text },
  badgeRow: { flexDirection: "row", gap: 6, marginTop: 6 },
  scoreBadge: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold", color: Colors.primary },
  cosignerBadge: {
    backgroundColor: Colors.successLight,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cosignerBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: Colors.success },
  chatHeader: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 14,
    gap: 10,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  chatAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  chatNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  chatName: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  verifiedChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: Colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedChipText: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#fff" },
  chatSub: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.55)" },
  trustBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexWrap: "wrap",
  },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  trustItemText: { fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.textSecondary },
  chatMessages: { padding: 14, gap: 10 },
  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  msgRowMe: { flexDirection: "row-reverse" },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: { maxWidth: "78%", borderRadius: 14, padding: 12, gap: 4 },
  bubbleMe: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: Colors.surfaceGray, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.border },
  bubbleText: { fontSize: 14, fontFamily: "Inter_400Regular", color: Colors.text, lineHeight: 20 },
  bubbleTextMe: { color: "#fff" },
  bubbleTime: { fontSize: 10, fontFamily: "Inter_400Regular", color: Colors.textTertiary, alignSelf: "flex-end" },
  bubbleTimeMe: { color: "rgba(255,255,255,0.55)" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  chatInput: {
    flex: 1,
    maxHeight: 100,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
    backgroundColor: Colors.surfaceGray,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: Colors.surfaceGray },
});
