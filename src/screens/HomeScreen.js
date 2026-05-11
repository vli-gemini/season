import React, { useState, useRef, useEffect } from 'react';
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
  PanResponder,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { LinearGradient } from '../components/Gradient';
import { contentPadding } from '../theme/layout';
import { getSeasonGradient } from '../theme/seasonGradient';
import { CURRENT_DAY, TOTAL_DAYS } from '../config/season';
import { ALL_MEMBERS, ME } from '../config/members';
import { Embers } from '../components/Embers';
import { SeasonMascot } from '../components/SeasonMascot';

const MEMBERS = ALL_MEMBERS;

const INITIAL_MESSAGES = [
  {
    id: 'sep-today',
    type: 'date',
    label: 'Today',
  },
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
          backgroundColor: member.color + '35',
          borderWidth: 1.5,
          borderColor: member.color + '70',
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.33 }]}>
        {member.initials}
      </Text>
    </View>
  );
}

function DateSeparator({ label }) {
  return (
    <View style={styles.dateSep}>
      <View style={styles.dateSepLine} />
      <Text style={styles.dateSepText}>{label}</Text>
      <View style={styles.dateSepLine} />
    </View>
  );
}

function Message({ message, prevMessage, onSenderPress }) {
  const isMe = message.sender?.isMe;
  const isSystem = message.type === 'system';

  const prevIsReal = prevMessage && prevMessage.type !== 'date' && prevMessage.type !== 'system';
  const isSameGroup = prevIsReal && prevMessage.sender?.id === message.sender?.id;

  if (isSystem) {
    return (
      <View style={styles.systemMsg}>
        <Text style={styles.systemText}>{message.text}</Text>
      </View>
    );
  }

  const senderName = isMe ? 'You' : message.sender?.name ?? '';
  const a11yLabel = `${senderName}: ${message.text}`;

  return (
    <View
      style={[
        styles.messageRow,
        isMe && styles.messageRowMe,
        isSameGroup ? styles.messageRowGrouped : styles.messageRowFirst,
      ]}
      accessible
      accessibilityLabel={a11yLabel}
    >
      {!isMe && (
        <TouchableOpacity
          style={styles.avatarCol}
          onPress={() => onSenderPress?.(message.sender)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`View ${message.sender?.name}'s profile`}
        >
          {!isSameGroup && <Avatar member={message.sender} size={30} />}
        </TouchableOpacity>
      )}

      <View style={[styles.bubbleCol, isMe && styles.bubbleColMe]}>
        {!isMe && !isSameGroup && (
          <TouchableOpacity
            style={styles.senderRow}
            onPress={() => onSenderPress?.(message.sender)}
            activeOpacity={0.7}
          >
            <Text style={[styles.senderName, { color: message.sender.color }]}>
              {message.sender.name.split(' ')[0]}
            </Text>
            <Text style={styles.msgTime}>{message.timestamp}</Text>
          </TouchableOpacity>
        )}

        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
            {message.text}
          </Text>
        </View>

        {isMe && !isSameGroup && (
          <Text style={styles.myTime}>{message.timestamp}</Text>
        )}
      </View>
    </View>
  );
}

function clampDay(relX, width, total) {
  const pct = Math.max(0, Math.min(1, relX / width));
  return Math.max(1, Math.min(total, Math.round(pct * (total - 1)) + 1));
}

function SeasonProgressHeader({ day, totalDays, onDayChange }) {
  const progress = (day - 1) / (totalDays - 1);
  const daysLeft = totalDays - day;

  const trackRef   = useRef(null);
  const trackW     = useRef(0);
  const trackPageX = useRef(0);
  const dayScale   = useRef(new Animated.Value(1)).current;
  const prevDay    = useRef(day);

  useEffect(() => {
    if (day === prevDay.current) return;
    prevDay.current = day;
    Animated.sequence([
      Animated.timing(dayScale, { toValue: 1.3, duration: 90, useNativeDriver: true }),
      Animated.spring(dayScale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();
  }, [day]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderGrant: (evt) => {
        const relX = evt.nativeEvent.pageX - trackPageX.current;
        onDayChange(clampDay(relX, trackW.current, totalDays));
      },
      onPanResponderMove: (evt, gs) => {
        const relX = gs.moveX - trackPageX.current;
        onDayChange(clampDay(relX, trackW.current, totalDays));
      },
    })
  ).current;

  const thumbPct = `${Math.round(progress * 100)}%`;

  return (
    <View style={styles.progressCard}>
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.progressCardOverlay]} />

      <View style={styles.progressCardRow}>
        <TouchableOpacity
          onPress={() => onDayChange(Math.max(1, day - 1))}
          style={styles.dayArrow}
          hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
          accessibilityLabel="Previous day"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={13} color="rgba(255,255,255,0.55)" />
        </TouchableOpacity>

        <Animated.Text
          style={[styles.progressCardDay, { transform: [{ scale: dayScale }] }]}
        >
          Day {day}
        </Animated.Text>

        <TouchableOpacity
          onPress={() => onDayChange(Math.min(totalDays, day + 1))}
          style={styles.dayArrow}
          hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
          accessibilityLabel="Next day"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-forward" size={13} color="rgba(255,255,255,0.55)" />
        </TouchableOpacity>

        <Text style={styles.progressCardOf}>of {totalDays}</Text>
        <View style={styles.progressCardSpacer} />
        <Text style={styles.progressCardRight}>
          {daysLeft > 0 ? `${daysLeft} days left` : 'Season complete'}
        </Text>
      </View>

      <View
        ref={trackRef}
        style={styles.progressTrackOuter}
        onLayout={() => {
          trackRef.current?.measure((_fx, _fy, w, _h, px) => {
            trackW.current = w;
            trackPageX.current = px;
          });
        }}
        {...panResponder.panHandlers}
      >
        <View style={styles.progressTrack} pointerEvents="none">
          <LinearGradient
            colors={getSeasonGradient(day, totalDays)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: thumbPct }]}
          />
        </View>
        <View style={[styles.progressThumb, { left: thumbPct }]} />
      </View>
    </View>
  );
}

export function HomeScreen({ navigation }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [day, setDay] = useState(CURRENT_DAY);
  const flatListRef = useRef(null);

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

  const daysLeft = TOTAL_DAYS - day;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Image
        source={require('../../assets/splash background.png')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.bgOverlay]} />
      <Embers currentDay={day} />

      {/* ── Header ── */}
      <View style={styles.headerWrap}>
        <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.headerOverlay]} />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerAvatarBtn}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.75}
            accessibilityLabel="Your profile"
            accessibilityRole="button"
          >
            <Avatar member={ME} size={34} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerCenter}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('GroupSettings')}
            accessibilityLabel="the hideout group settings"
            accessibilityRole="button"
          >
            <Text style={styles.groupName}>the hideout</Text>
            <Text style={styles.groupSub}>
              {MEMBERS.length} creators · day {day}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => navigation.navigate('DMList')}
            accessibilityLabel="Direct messages"
            accessibilityRole="button"
          >
            <Ionicons name="chatbubble-ellipses-outline" size={19} color="rgba(255,255,255,0.70)" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Season ending banner ── */}
      {daysLeft <= 7 && (
        <TouchableOpacity
          style={[styles.countdownBanner, daysLeft <= 0 && styles.countdownBannerEnded]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('SeasonEnding', { day })}
        >
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.bannerOverlay, daysLeft <= 0 && styles.bannerOverlayEnded]} />
          <Ionicons
            name={daysLeft <= 0 ? 'ribbon-outline' : 'time-outline'}
            size={13}
            color="rgba(255,255,255,0.80)"
          />
          <Text style={styles.countdownText}>
            {daysLeft <= 0
              ? "Your season has ended — see what's next"
              : daysLeft === 1
              ? 'Last day — choose who you continue with'
              : `${daysLeft} days left — choose who continues with you`}
          </Text>
          <Ionicons name="chevron-forward" size={12} color="rgba(255,255,255,0.45)" />
        </TouchableOpacity>
      )}

      {/* ── Messages + input ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            if (item.type === 'date') {
              return <DateSeparator label={item.label} />;
            }
            const prev = index > 0 ? messages[index - 1] : null;
            return (
              <Message
                message={item}
                prevMessage={prev}
                onSenderPress={(sender) => {
                  if (sender.isMe) navigation.navigate('Profile');
                  else navigation.navigate('MemberProfile', { user: sender });
                }}
              />
            );
          }}
          ListHeaderComponent={
            <SeasonProgressHeader
              day={day}
              totalDays={TOTAL_DAYS}
              onDayChange={setDay}
            />
          }
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        <SeasonMascot
          day={day}
          totalDays={TOTAL_DAYS}
          style={styles.mascot}
        />

        {/* ── Input bar ── */}
        <View style={styles.inputBarWrap}>
          <View style={styles.inputBarGlass}>
            <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, styles.inputBarOverlay]} />

            <View style={styles.inputBar}>
              <TouchableOpacity
                style={styles.attachBtn}
                onPress={handleAttach}
                accessibilityLabel="Attach file"
                accessibilityRole="button"
              >
                <Ionicons name="add-circle-outline" size={22} color="rgba(255,255,255,0.50)" />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                placeholder="Share what you made..."
                placeholderTextColor="rgba(255,255,255,0.40)"
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={sendMessage}
                style={[styles.sendBtn, input.trim() && styles.sendBtnActive]}
                disabled={!input.trim()}
                accessibilityLabel="Send message"
                accessibilityRole="button"
                accessibilityState={{ disabled: !input.trim() }}
              >
                <Ionicons
                  name="arrow-up"
                  size={16}
                  color={input.trim() ? '#fff' : 'rgba(255,255,255,0.45)'}
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
  safe: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  bgOverlay: {
    backgroundColor: 'rgba(0,0,0,0.52)',
  },
  flex: { flex: 1 },

  // ── Header ──
  headerWrap: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  headerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.20)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: contentPadding,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 12,
  },
  headerAvatarBtn: {
    flexShrink: 0,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  groupName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
    letterSpacing: -0.2,
  },
  groupSub: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.55)',
    marginTop: 1,
    letterSpacing: 0.1,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },

  // ── Season ending banner ──
  countdownBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: contentPadding,
    marginTop: 10,
    marginBottom: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  countdownBannerEnded: {
    borderColor: 'rgba(255,255,255,0.22)',
  },
  bannerOverlay: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  bannerOverlayEnded: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  countdownText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.70)',
    lineHeight: 17,
  },

  // ── Message list ──
  messageList: {
    paddingHorizontal: contentPadding,
    paddingTop: 14,
    paddingBottom: 8,
  },

  // ── Season progress card (list header) ──
  progressCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 14,
    marginBottom: 20,
  },
  progressCardOverlay: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  progressCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 2,
  },
  dayArrow: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCardDay: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
    minWidth: 52,
    textAlign: 'center',
  },
  progressCardOf: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.55)',
    marginLeft: 2,
  },
  progressCardSpacer: { flex: 1 },
  progressCardRight: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.55)',
  },
  progressTrackOuter: {
    height: 18,
    justifyContent: 'center',
  },
  progressTrack: {
    height: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.20)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressThumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.95)',
    top: 2,
    marginLeft: -7,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.70)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },

  // ── Date separator ──
  dateSep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 16,
  },
  dateSepLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  dateSepText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.50)',
    letterSpacing: 0.5,
  },

  // ── Messages ──
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowMe: {
    flexDirection: 'row-reverse',
  },
  messageRowFirst: {
    marginTop: 14,
    marginBottom: 2,
  },
  messageRowGrouped: {
    marginTop: 3,
    marginBottom: 2,
  },
  avatarCol: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  bubbleCol: {
    maxWidth: '76%',
  },
  bubbleColMe: {
    alignItems: 'flex-end',
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 4,
    marginLeft: 2,
  },
  senderName: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    letterSpacing: 0.1,
  },
  msgTime: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.50)',
  },
  myTime: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.50)',
    marginTop: 3,
    marginRight: 2,
  },
  bubble: {
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  bubbleMe: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
  },
  bubbleOther: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  bubbleText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#fff',
    lineHeight: 22,
  },
  bubbleTextMe: {
    color: '#fff',
  },
  systemMsg: {
    alignItems: 'center',
    marginVertical: 12,
  },
  systemText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },

  // ── Mascot ──
  mascot: {
    position: 'absolute',
    right: 16,
    bottom: Platform.OS === 'ios' ? 96 : 74,
    zIndex: 10,
  },

  // ── Input bar ──
  inputBarWrap: {
    paddingHorizontal: contentPadding,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  inputBarGlass: {
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  inputBarOverlay: {
    backgroundColor: 'rgba(0,0,0,0.20)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 10,
    paddingRight: 8,
    paddingVertical: 8,
    gap: 6,
  },
  attachBtn: {
    paddingHorizontal: 2,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    minHeight: 34,
    maxHeight: 110,
    paddingHorizontal: 6,
    paddingVertical: 7,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#fff',
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  sendBtnActive: {
    backgroundColor: colors.accentVibrant,
    borderColor: colors.accent,
  },
});
