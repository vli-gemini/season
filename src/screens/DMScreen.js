import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { LinearGradient } from '../components/Gradient';
import { getSeasonGradient } from '../theme/seasonGradient';
import { CURRENT_DAY, TOTAL_DAYS } from '../config/season';
import { ME, DM_SEEDS } from '../config/members';
import { Embers } from '../components/Embers';

function Avatar({ user, size = 30 }) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: user.color + '33',
          borderWidth: 1.5,
          borderColor: user.color + '55',
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.35, color: colors.textPrimary, fontFamily: 'PlusJakartaSans_600SemiBold' }}>
        {user.initials}
      </Text>
    </View>
  );
}

export function DMScreen({ navigation, route }) {
  const otherUser = route?.params?.user ?? { id: '1', name: 'Sarah Liao', initials: 'SL', color: '#8B7FF5' };
  const seed = DM_SEEDS[otherUser.id] ?? [];
  const hydratedSeed = seed.map((m) => ({
    ...m,
    sender: m.senderId === 'me' ? ME : otherUser,
  }));

  const [messages, setMessages] = useState(hydratedSeed);
  const [input, setInput] = useState('');

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: ME,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender.isMe;
    return (
      <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
        <View style={styles.bubbleWrap}>
          <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
            <Text style={styles.bubbleText}>{item.text}</Text>
          </View>
          <Text style={[styles.time, isMe && styles.timeMe]}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient
        colors={getSeasonGradient(CURRENT_DAY, TOTAL_DAYS)}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Embers />

      {/* Header — glass bar */}
      <View style={styles.headerWrap}>
        <BlurView intensity={70} tint="systemMaterial" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.headerOverlay]} />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('DMList')}
            style={styles.backBtn}
            accessibilityLabel="Back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerCenter}
            onPress={() => navigation.navigate('MemberProfile', { user: otherUser })}
            activeOpacity={0.7}
            accessibilityLabel={`${otherUser.name}, active now. View profile`}
            accessibilityRole="button"
          >
            <View style={styles.avatarWithDot}>
              <Avatar user={otherUser} size={30} />
              <View
                style={styles.onlineDot}
                accessibilityElementsHidden
                importantForAccessibility="no"
              />
            </View>
            <View>
              <Text style={styles.headerName}>{otherUser.name}</Text>
              <Text style={styles.headerOnlineLabel}>active now</Text>
            </View>
          </TouchableOpacity>
          <View style={{ width: 30 }} />
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />

        {/* Input bar — glass */}
        <View style={styles.inputWrap}>
          <View style={styles.inputGlass}>
            <BlurView intensity={70} tint="systemMaterial" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, styles.inputOverlay]} />
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Message..."
                placeholderTextColor={colors.textMuted}
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={send}
                style={[styles.sendBtn, input.trim() && styles.sendBtnActive]}
                disabled={!input.trim()}
                accessibilityLabel="Send message"
                accessibilityRole="button"
                accessibilityState={{ disabled: !input.trim() }}
              >
                <Ionicons
                  name="arrow-up"
                  size={16}
                  color={input.trim() ? '#fff' : colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },

  // Header
  headerWrap: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerOverlay: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: contentPadding,
    paddingVertical: 12,
  },
  backBtn: { padding: 4, width: 30 },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWithDot: {
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#30D158',
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  headerName: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
    lineHeight: 19,
  },
  headerOnlineLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#30D158',
    lineHeight: 14,
  },
  avatar: { alignItems: 'center', justifyContent: 'center' },

  // Messages
  list: { paddingVertical: 20, paddingHorizontal: contentPadding, paddingBottom: 8 },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  msgRowMe: { flexDirection: 'row-reverse' },
  bubbleWrap: { maxWidth: '75%' },
  bubble: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  bubbleMe: {
    backgroundColor: colors.bubbleSelf,
    borderBottomRightRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(123, 111, 255, 0.30)',
  },
  bubbleOther: {
    backgroundColor: colors.bubbleOther,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  time: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    marginTop: 5,
    marginLeft: 2,
  },
  timeMe: { textAlign: 'right', marginRight: 2 },

  // Input
  inputWrap: {
    paddingHorizontal: contentPadding,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  inputGlass: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputOverlay: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
  },
  textInput: {
    flex: 1,
    minHeight: 34,
    maxHeight: 100,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
    paddingVertical: 4,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  sendBtnActive: {
    backgroundColor: colors.accentVibrant,
    borderColor: colors.accent,
  },
});
