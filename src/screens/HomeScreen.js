import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { LinearGradient } from '../components/Gradient';
import { contentPadding } from '../theme/layout';
import { getSeasonGradient } from '../theme/seasonGradient';
import { CURRENT_DAY, TOTAL_DAYS } from '../config/season';
import { ALL_MEMBERS, ME } from '../config/members';
import { Embers } from '../components/Embers';

const MEMBERS = ALL_MEMBERS;

const INITIAL_MESSAGES = [
  {
    id: '1',
    sender: MEMBERS[0],
    type: 'text',
    text: "Okay can I just say something honest… this week I haven't wanted to film anything in 3 weeks like genuinely nothing just staring at my setup and closing the door…",
    timestamp: '9:41 AM',
  },
  {
    id: '2',
    sender: MEMBERS[1],
    type: 'text',
    text: "Thank you for saying this! I thought it was just me I've been editing the same video for 11 days because I keep convincing myself it's not good enough.",
    timestamp: '10:02 AM',
  },
  {
    id: '3',
    sender: ME,
    type: 'text',
    text: "What does your content schedule look like right now? Are you posting through it or have you stopped?",
    timestamp: '10:14 AM',
  },
  {
    id: '4',
    sender: MEMBERS[0],
    type: 'text',
    text: 'I have 4 videos sitting in drafts all half edited. I keep opening them and closing them.',
    timestamp: '10:15 AM',
  },
  {
    id: '5',
    sender: MEMBERS[0],
    type: 'text',
    text: "I think I'm scared of finishing them because then I have to post them and I don't know if I care anymore :(",
    timestamp: '10:16 AM',
  },
  {
    id: '6',
    sender: ME,
    type: 'text',
    text: "What if you picked the least precious draft the one you care about least and just shipped it? Not everything has to matter. Sometimes done is enough…",
    timestamp: '10:20 AM',
  },
];

function Avatar({ member, size = 34 }) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: member.color + '40',
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.33 }]}>
        {member.initials}
      </Text>
    </View>
  );
}

function GroupAvatar({ size = 52 }) {
  return (
    <View
      style={[
        styles.groupAvatarWrap,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <LinearGradient
        colors={['#6B5FD4', '#3D2E8C']}
        style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
      />
      <Ionicons name="people" size={size * 0.46} color="rgba(255,255,255,0.85)" />
    </View>
  );
}

function Message({ message, prevSender }) {
  const isMe = message.sender?.isMe;
  const isSystem = message.type === 'system';
  const isSameSenderAsPrev = prevSender && prevSender === message.sender?.id;

  if (isSystem) {
    return (
      <View style={styles.systemMsg}>
        <Text style={styles.systemText}>{message.text}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.messageRow, isMe && styles.messageRowMe, isSameSenderAsPrev && styles.messageRowCompact]}>
      {/* Avatar placeholder to maintain alignment */}
      {!isMe && (
        <View style={styles.avatarSlot}>
          {!isSameSenderAsPrev && <Avatar member={message.sender} size={34} />}
        </View>
      )}
      <View style={[styles.messageBubbleWrap, isMe && styles.messageBubbleWrapMe]}>
        {!isMe && !isSameSenderAsPrev && (
          <Text style={styles.senderName}>{message.sender.name}</Text>
        )}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={styles.bubbleText}>{message.text}</Text>
        </View>
      </View>
    </View>
  );
}

export function HomeScreen({ navigation }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [day, setDay] = useState(CURRENT_DAY);
  const flatListRef = useRef(null);

  const prevDay = () => setDay(d => Math.max(1, d - 1));
  const nextDay = () => setDay(d => Math.min(TOTAL_DAYS, d + 1));

  const handleAttach = () => {
    const options = ['Share a link', 'Share a photo', 'Record a video', 'Cancel'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 3 },
        (index) => {
          if (index < 3) {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                sender: ME,
                type: 'system',
                text: `📎 ${options[index]} — coming soon`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
          }
        }
      );
    } else {
      Alert.alert('Share your work', 'What would you like to share?', [
        { text: 'Share a link', onPress: () => {} },
        { text: 'Share a photo', onPress: () => {} },
        { text: 'Record a video', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: ME,
        type: 'text',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient colors={getSeasonGradient(day, TOTAL_DAYS)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <Embers currentDay={day} />

      {/* Header */}
      <View style={styles.header}>
        {/* Left: day counter */}
        <View style={styles.dayControl}>
          <TouchableOpacity onPress={prevDay} style={styles.dayArrow}>
            <Ionicons name="chevron-back" size={14} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.dayLabel}>
            Day <Text style={styles.dayLabelBold}>{day}</Text>
            <Text style={styles.dayLabelTotal}>/{TOTAL_DAYS}</Text>
          </Text>
          <TouchableOpacity onPress={nextDay} style={styles.dayArrow}>
            <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Center: group avatar + name */}
        <TouchableOpacity
          style={styles.headerCenter}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('GroupSettings')}
        >
          <GroupAvatar size={50} />
          <Text style={styles.groupName}>the hideout</Text>
        </TouchableOpacity>

        {/* Right: action buttons */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => navigation.navigate('DMList')}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerAvatarBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Avatar member={ME} size={34} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Season countdown banner — visible in the last 7 days */}
      {(TOTAL_DAYS - day) <= 7 && (
        <TouchableOpacity
          style={[
            styles.countdownBanner,
            (TOTAL_DAYS - day) <= 0 && styles.countdownBannerEnded,
          ]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('SeasonEnding', { day })}
        >
          <Ionicons
            name={(TOTAL_DAYS - day) <= 0 ? 'ribbon-outline' : 'time-outline'}
            size={14}
            color={colors.accentWarm}
          />
          <Text style={styles.countdownText}>
            {(TOTAL_DAYS - day) <= 0
              ? 'Your season has ended — see what\'s next'
              : (TOTAL_DAYS - day) === 1
              ? 'Last day of the season — choose who you continue with'
              : `Season ends in ${TOTAL_DAYS - day} days — choose who you continue with`}
          </Text>
          <Ionicons name="chevron-forward" size={13} color={colors.textMuted} />
        </TouchableOpacity>
      )}

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Message
              message={item}
              prevSender={index > 0 ? messages[index - 1].sender?.id : null}
            />
          )}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        {/* Input bar */}
        <View style={styles.inputBarWrap}>
          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.plusBtn} onPress={handleAttach}>
              <Ionicons name="add" size={22} color={colors.textSecondary} />
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
                size={17}
                color={input.trim() ? '#fff' : colors.textMuted}
              />
            </TouchableOpacity>
          </View>
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

  // Countdown banner
  countdownBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: contentPadding,
    marginBottom: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(196,169,125,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(196,169,125,0.2)',
  },
  countdownBannerEnded: {
    backgroundColor: 'rgba(155,143,255,0.1)',
    borderColor: 'rgba(155,143,255,0.2)',
  },
  countdownText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 17,
  },
  flex: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: contentPadding,
    paddingTop: 10,
    paddingBottom: 8,
  },
  dayControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dayArrow: {
    padding: 4,
  },
  dayLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.accentWarm,
  },
  dayLabelBold: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.accentWarm,
  },
  dayLabelTotal: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.accentWarm,
  },
  headerCenter: {
    alignItems: 'center',
    gap: 4,
  },
  groupAvatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  groupName: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
    letterSpacing: 0.1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 80,
    justifyContent: 'flex-end',
  },
  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarBtn: {
    borderRadius: 17,
    overflow: 'hidden',
  },

  // Messages
  messageList: {
    paddingHorizontal: contentPadding,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
    gap: 8,
  },
  messageRowMe: {
    flexDirection: 'row-reverse',
  },
  messageRowCompact: {
    marginBottom: 2,
  },
  avatarSlot: {
    width: 34,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
  },
  messageBubbleWrap: {
    maxWidth: '78%',
  },
  messageBubbleWrapMe: {
    alignItems: 'flex-end',
  },
  senderName: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textSecondary,
    marginBottom: 4,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 20,
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  bubbleMe: {
    backgroundColor: 'rgba(168,155,255,0.25)',
    borderBottomRightRadius: 6,
  },
  bubbleOther: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderBottomLeftRadius: 6,
  },
  bubbleText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
    lineHeight: 21,
  },
  systemMsg: {
    alignItems: 'center',
    marginVertical: 14,
  },
  systemText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
    backgroundColor: colors.bubbleSystem,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },

  // Input
  inputBarWrap: {
    paddingHorizontal: contentPadding,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  plusBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  textInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 110,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textPrimary,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  sendBtnActive: {
    backgroundColor: colors.accentWarm,
  },
});
