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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const CURRENT_DAY = 10;
const TOTAL_DAYS = 30;

const MEMBERS = [
  { id: '1', name: 'Sarah Liao', initials: 'SL', color: '#8B7FF5' },
  { id: '2', name: 'Mark Smith', initials: 'MS', color: '#5ECA8A' },
  { id: '3', name: 'You', initials: 'YO', color: '#C4A97D', isMe: true },
];

const INITIAL_MESSAGES = [
  {
    id: '1',
    sender: MEMBERS[0],
    type: 'made',
    text: 'a short video about why I almost quit last year. wasn\'t planning to post it but it felt right.',
    timestamp: '9:41 AM',
  },
  {
    id: '2',
    sender: MEMBERS[1],
    type: 'made',
    text: 'a rough cut of my next podcast episode. still needs work but the bones are there.',
    timestamp: '10:02 AM',
  },
  {
    id: '3',
    sender: null,
    type: 'system',
    text: 'Day 10 of 30 — keep showing up.',
    timestamp: '',
  },
  {
    id: '4',
    sender: MEMBERS[0],
    type: 'text',
    text: 'That podcast topic sounds so good Mark. What\'s it about?',
    timestamp: '10:15 AM',
  },
  {
    id: '5',
    sender: MEMBERS[1],
    type: 'text',
    text: 'Finding your voice when the algorithm keeps changing. Basically what we\'re all going through.',
    timestamp: '10:17 AM',
  },
];

function Avatar({ member, size = 32 }) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: member.color + '33' },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.35 }]}>{member.initials}</Text>
    </View>
  );
}

function Message({ message }) {
  const isMe = message.sender?.isMe;
  const isSystem = message.type === 'system';
  const isMade = message.type === 'made';

  if (isSystem) {
    return (
      <View style={styles.systemMsg}>
        <Text style={styles.systemText}>{message.text}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
      {!isMe && <Avatar member={message.sender} size={28} />}
      <View style={styles.messageBubbleWrap}>
        {!isMe && (
          <Text style={styles.senderName}>{message.sender.name}</Text>
        )}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          {isMade && (
            <Text style={styles.madeLabel}>Made: </Text>
          )}
          <Text style={[styles.bubbleText, isMade && styles.bubbleTextMade]}>
            {message.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>{message.timestamp}</Text>
      </View>
    </View>
  );
}

export function HomeScreen({ navigation }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: MEMBERS[2],
        type: 'text',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.groupName}>the hideout</Text>
          <Text style={styles.dayLabel}>Day {CURRENT_DAY}/{TOTAL_DAYS}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.memberStack}>
            {MEMBERS.slice(0, 3).map((m, i) => (
              <View key={m.id} style={[styles.stackAvatar, { marginLeft: i === 0 ? 0 : -8 }]}>
                <Avatar member={m} size={28} />
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.profileBtn}
          >
            <Ionicons name="person-circle-outline" size={26} color={colors.textSecondary} />
          </TouchableOpacity>
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
          renderItem={({ item }) => <Message message={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.plusBtn}>
            <Ionicons name="add" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Share what you made..."
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={sendMessage}
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
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  dayLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackAvatar: {},
  profileBtn: {
    padding: 2,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  messageList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
    gap: 8,
  },
  messageRowMe: {
    flexDirection: 'row-reverse',
  },
  messageBubbleWrap: {
    maxWidth: '75%',
  },
  senderName: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
    marginLeft: 2,
  },
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
  madeLabel: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  bubbleText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  bubbleTextMade: {
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
    marginLeft: 2,
  },
  systemMsg: {
    alignItems: 'center',
    marginVertical: 12,
  },
  systemText: {
    fontSize: 12,
    color: colors.textMuted,
    backgroundColor: colors.bubbleSystem,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  plusBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
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
  sendBtnActive: {
    backgroundColor: colors.textPrimary,
  },
});
