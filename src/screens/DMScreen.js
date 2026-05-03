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
        { width: size, height: size, borderRadius: size / 2, backgroundColor: user.color + '33' },
      ]}
    >
      <Text style={{ fontSize: size * 0.35, color: colors.textPrimary, fontWeight: '600' }}>
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
      <LinearGradient colors={getSeasonGradient(CURRENT_DAY, TOTAL_DAYS)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <Embers />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('DMList')} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerCenter}
          onPress={() => navigation.navigate('MemberProfile', { user: otherUser })}
          activeOpacity={0.7}
        >
          <Avatar user={otherUser} size={30} />
          <Text style={styles.headerName}>{otherUser.name}</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </TouchableOpacity>
        <View style={{ width: 30 }} />
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

        <View style={styles.inputBar}>
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
          >
            <Ionicons
              name="arrow-up"
              size={16}
              color={input.trim() ? colors.background : colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: contentPadding,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 4, width: 30 },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerName: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textPrimary,
  },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  list: { paddingVertical: 16, paddingHorizontal: contentPadding, paddingBottom: 8 },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    gap: 8,
  },
  msgRowMe: { flexDirection: 'row-reverse' },
  bubbleWrap: { maxWidth: '75%' },
  bubble: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bubbleMe: {
    backgroundColor: colors.bubbleSelf,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.bubbleOther,
    borderBottomLeftRadius: 4,
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
    color: colors.textMuted,
    marginTop: 4,
    marginLeft: 2,
  },
  timeMe: { textAlign: 'right', marginRight: 2 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: contentPadding,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: colors.backgroundCard,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sendBtnActive: { backgroundColor: colors.textPrimary },
});
