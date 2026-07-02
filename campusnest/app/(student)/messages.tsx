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
import { useAuth } from "@/context/AuthContext";
import { Message, useListings } from "@/context/ListingsContext";

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { messages } = useListings();
  const [activeThread, setActiveThread] = useState<Message | null>(null);

  if (activeThread) {
    const updated = messages.find((m) => m.id === activeThread.id) || activeThread;
    return (
      <ChatView
        thread={updated}
        onBack={() => setActiveThread(null)}
        insets={insets}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSub}>Conversations organized by property</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySub}>Message a landlord from any listing page</Text>
          </View>
        ) : (
          messages.map((thread) => (
            <Pressable
              key={thread.id}
              style={({ pressed }) => [styles.threadCard, pressed && { opacity: 0.85 }]}
              onPress={() => setActiveThread(thread)}
            >
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={20} color={Colors.accent} />
                </View>
                {thread.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{thread.unread}</Text>
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.threadTopRow}>
                  <Text style={styles.threadName}>{thread.landlordName}</Text>
                  <Text style={styles.threadTime}>{thread.lastTime}</Text>
                </View>
                <Text style={styles.threadProperty} numberOfLines={1}>
                  <Ionicons name="home-outline" size={11} color={Colors.textTertiary} /> {thread.listingTitle}
                </Text>
                <Text
                  style={[styles.threadLast, thread.unread > 0 && styles.threadLastUnread]}
                  numberOfLines={1}
                >
                  {thread.lastMessage}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.border} />
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function ChatView({ thread, onBack, insets }: { thread: Message; onBack: () => void; insets: any }) {
  const { user } = useAuth();
  const { sendMessage } = useListings();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(thread.id, input.trim());
    setInput("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" />

      {/* Chat Header */}
      <View style={[styles.chatHeader, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 8 }]}>
        <Pressable style={styles.chatBackBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <View style={styles.chatAvatar}>
          <Ionicons name="person" size={18} color={Colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.chatName}>{thread.landlordName}</Text>
          <Text style={styles.chatProperty} numberOfLines={1}>{thread.listingTitle}</Text>
        </View>
        {/* Placeholder: Start Video Call */}
        <Pressable style={styles.videoCallBtn}>
          <Ionicons name="videocam-outline" size={20} color={Colors.accent} />
        </Pressable>
      </View>

      {/* Video call placeholder banner */}
      <View style={styles.videoCallBanner}>
        <Ionicons name="videocam-outline" size={14} color={Colors.textSecondary} />
        <Text style={styles.videoCallBannerText}>Video call feature coming soon</Text>
      </View>

      {/* Messages */}
      <ScrollView
        contentContainerStyle={styles.chatMessages}
        showsVerticalScrollIndicator={false}
      >
        {thread.messages.map((msg) => {
          const isMe = msg.senderId === "student";
          return (
            <View key={msg.id} style={[styles.msgRow, isMe && styles.msgRowMe]}>
              {!isMe && (
                <View style={styles.msgAvatar}>
                  <Ionicons name="person" size={12} color={Colors.accent} />
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

      {/* Input */}
      <View style={[styles.inputBar, { paddingBottom: Platform.OS === "web" ? 16 : insets.bottom + 10 }]}>
        <TextInput
          style={styles.chatInput}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <Pressable
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim()}
        >
          <Ionicons name="send" size={18} color={input.trim() ? Colors.primary : Colors.textTertiary} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  empty: { paddingTop: 80, alignItems: "center", gap: 10 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold", color: Colors.textSecondary },
  emptySub: { fontSize: 14, fontFamily: "Inter_400Regular", color: Colors.textTertiary, textAlign: "center" },
  threadCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  avatarWrap: { position: "relative" },
  avatar: {
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
  threadName: { fontSize: 15, fontFamily: "Inter_700Bold", color: Colors.text },
  threadTime: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textTertiary },
  threadProperty: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textTertiary, marginTop: 1 },
  threadLast: { fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.textSecondary, marginTop: 2 },
  threadLastUnread: { fontFamily: "Inter_600SemiBold", color: Colors.text },
  chatHeader: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 14,
    gap: 10,
  },
  chatBackBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  chatAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  chatName: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  chatProperty: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.55)" },
  videoCallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  videoCallBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.surfaceGray,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  videoCallBannerText: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.textSecondary },
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
