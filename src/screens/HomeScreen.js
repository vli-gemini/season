import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
  Animated,
  Image,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
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
          backgroundColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.28)',
          overflow: 'hidden',
        },
      ]}
    >
      {member?.avatar ? (
        <Image
          source={member.avatar}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : (
        <Ionicons name="person" size={size * 0.52} color="rgba(255,255,255,0.75)" />
      )}
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
            <Text style={styles.senderName}>
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

// ── Mascot circle button ──────────────────────────────────────────────────────

function MascotDayButton({ day, totalDays, onPress, isOpen }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.mascotBtn}
      accessibilityLabel={`Day ${day}, open date picker`}
      accessibilityRole="button"
    >
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.mascotBtnOverlay]} />

      {/* Mascot clipped to head area */}
      <View style={styles.mascotClipOuter} pointerEvents="none">
        <View style={styles.mascotClipInner}>
          <SeasonMascot day={day} totalDays={totalDays} style={styles.mascotInBtn} />
        </View>
      </View>

      {/* Day badge */}
      <View style={styles.dayBadge}>
        <Text style={styles.dayBadgeText}>Day {day}</Text>
      </View>

      {/* Open/close indicator */}
      <View style={styles.mascotChevron}>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={9}
          color="rgba(255,255,255,0.55)"
        />
      </View>
    </TouchableOpacity>
  );
}

// ── Date picker dropdown ──────────────────────────────────────────────────────

const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const SHORT_DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function DatePickerDropdown({ visible, day, totalDays, seasonStart, onSelectDay, style }) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [rendered, setRendered] = useState(visible);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setRendered(false));
    }
  }, [visible]);

  // Scroll to selected day when opened
  useEffect(() => {
    if (visible && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: Math.max(0, (day - 3)) * 52, animated: true });
      }, 150);
    }
  }, [visible, day]);

  if (!rendered) return null;

  const translateY = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });
  const opacity    = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Animated.View style={[styles.datePicker, style, { opacity, transform: [{ translateY }] }]}>
      <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.datePickerOverlay]} />

      <ScrollView
        ref={scrollRef}
        style={styles.datePickerScroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {Array.from({ length: totalDays }, (_, i) => {
          const d = i + 1;
          const date = new Date(seasonStart);
          date.setDate(date.getDate() + i);
          const isSelected = d === day;
          return (
            <TouchableOpacity
              key={d}
              style={[styles.dpRow, isSelected && styles.dpRowSelected]}
              onPress={() => onSelectDay(d)}
              activeOpacity={0.7}
            >
              {isSelected && (
                <View style={[StyleSheet.absoluteFill, styles.dpRowSelectedBg]} />
              )}
              <Text style={[styles.dpNum, isSelected && styles.dpNumSelected]}>
                Day {d}
              </Text>
              <Text style={[styles.dpDate, isSelected && styles.dpDateSelected]}>
                {SHORT_MONTHS[date.getMonth()]} {date.getDate()}
              </Text>
              <Text style={[styles.dpDow, isSelected && styles.dpDowSelected]}>
                {SHORT_DAYS[date.getDay()]}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark" size={13} color="rgba(255,255,255,0.80)" style={styles.dpCheck} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [inputHeight, setInputHeight] = useState(22);
  const [day, setDay] = useState(CURRENT_DAY);
  const [pickerOpen, setPickerOpen] = useState(false);
  const flatListRef = useRef(null);
  const mountOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(mountOp, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  }, []);

  // Compute season start date (day 1) from CURRENT_DAY and today
  const seasonStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (CURRENT_DAY - 1));
    return d;
  }, []);

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
    setInputHeight(22);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSelectDay = useCallback((d) => {
    setDay(d);
    setPickerOpen(false);
  }, []);

  const daysLeft = TOTAL_DAYS - day;

  return (
    <View style={styles.root}>
      <Image
        source={require('../../assets/splash background.png')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.bgOverlay]} />

      <Animated.View style={[styles.flex, { opacity: mountOp }]}>
      <Embers currentDay={day} />

      {/* ── Header (transparent, floats over background) ── */}
      <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <MascotDayButton
            day={day}
            totalDays={TOTAL_DAYS}
            onPress={() => setPickerOpen((v) => !v)}
            isOpen={pickerOpen}
          />

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

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => navigation.navigate('DMList')}
              accessibilityLabel="Direct messages"
              accessibilityRole="button"
            >
              <Ionicons name="chatbubble-ellipses-outline" size={19} color="rgba(255,255,255,0.70)" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerAvatarBtn}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.75}
              accessibilityLabel="Your profile"
              accessibilityRole="button"
            >
              <Avatar member={ME} size={34} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Date picker + tap-to-close (absolutely positioned from root) ── */}
      {pickerOpen && (
        <TouchableOpacity
          style={[StyleSheet.absoluteFill, { zIndex: 9 }]}
          activeOpacity={1}
          onPress={() => setPickerOpen(false)}
        />
      )}
      <DatePickerDropdown
        visible={pickerOpen}
        day={day}
        totalDays={TOTAL_DAYS}
        seasonStart={seasonStart}
        onSelectDay={handleSelectDay}
        style={{ top: insets.top + 74, left: contentPadding, right: contentPadding }}
      />

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
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        {/* ── Input bar ── */}
        <View style={styles.inputBarWrap}>
          <View style={[styles.inputBarGlass, input.length > 0 && styles.inputBarGlassActive]}>
            <View style={styles.inputBar}>
              <TouchableOpacity
                style={styles.attachBtn}
                onPress={handleAttach}
                accessibilityLabel="Attach file"
                accessibilityRole="button"
              >
                <Ionicons name="add-outline" size={22} color="rgba(255,255,255,0.50)" />
              </TouchableOpacity>
              <TextInput
                style={[styles.textInput, { height: inputHeight }, Platform.OS === 'web' && styles.textInputWeb]}
                placeholder="Share what you made..."
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={input}
                onChangeText={(text) => {
                  if (text.length < input.length) setInputHeight(22);
                  setInput(text);
                }}
                onContentSizeChange={(e) => setInputHeight(
                  Math.max(22, Math.min(e.nativeEvent.contentSize.height, 90))
                )}
                multiline
                maxLength={500}
                selectionColor="#ffffff"
                cursorColor="#ffffff"
                underlineColorAndroid="transparent"
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
                  color="#000"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const MASCOT_BTN_SIZE = 56;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D0B14',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  bgOverlay: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  flex: { flex: 1 },

  // ── Header ──
  headerWrap: {
    zIndex: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: contentPadding,
    paddingTop: 5,
    paddingBottom: 8,
    gap: 12,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
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
  },
  headerAvatarBtn: {
    flexShrink: 0,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Mascot button ──
  mascotBtn: {
    width: MASCOT_BTN_SIZE,
    height: MASCOT_BTN_SIZE,
    borderRadius: MASCOT_BTN_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    flexShrink: 0,
  },
  mascotBtnOverlay: {
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  mascotClipOuter: {
    width: MASCOT_BTN_SIZE,
    height: 38,
    overflow: 'hidden',
    position: 'absolute',
    top: -6,
    alignItems: 'center',
  },
  mascotClipInner: {
    marginLeft: -1,
  },
  mascotInBtn: {
    // SeasonMascot style override — rendered at 90×122, we clip to show face
  },
  dayBadge: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.38)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dayBadgeText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(255,255,255,0.90)',
    letterSpacing: 0.3,
  },
  mascotChevron: {
    position: 'absolute',
    top: 4,
    right: 4,
  },

  // ── Date picker ──
  datePicker: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 15,
    height: 240,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  datePickerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.30)',
  },
  datePickerScroll: {
    flex: 1,
    paddingVertical: 6,
  },
  dpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 14,
    overflow: 'hidden',
  },
  dpRowSelected: {
    // background handled by dpRowSelectedBg
  },
  dpRowSelectedBg: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    marginHorizontal: 8,
  },
  dpNum: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(255,255,255,0.65)',
    width: 52,
  },
  dpNumSelected: {
    color: '#fff',
  },
  dpDate: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.50)',
    flex: 1,
  },
  dpDateSelected: {
    color: 'rgba(255,255,255,0.85)',
  },
  dpDow: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.40)',
    width: 32,
    textAlign: 'right',
  },
  dpDowSelected: {
    color: 'rgba(255,255,255,0.70)',
  },
  dpCheck: {
    marginLeft: 4,
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
    color: '#fff',
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

  // ── Input bar ──
  inputBarWrap: {
    paddingHorizontal: contentPadding,
    paddingTop: 24,
    paddingBottom: 24,
  },
  inputBarGlass: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#777',
    backgroundColor: 'rgba(0,0,0,0.30)',
    minHeight: 56,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 10,
    gap: 6,
    minHeight: 54,
  },
  attachBtn: {
    paddingHorizontal: 2,
    marginBottom: 6,
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    marginBottom: 6,
    paddingHorizontal: 4,
    paddingVertical: 0,
    textAlignVertical: 'center',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#fff',
  },
  textInputWeb: {
    outlineStyle: 'none',
    caretColor: '#ffffff',
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {},
});
