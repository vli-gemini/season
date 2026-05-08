import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { LinearGradient } from '../components/Gradient';
import { getSeasonGradient } from '../theme/seasonGradient';
import { CURRENT_DAY, TOTAL_DAYS } from '../config/season';
import { GROUP_MEMBERS } from '../config/members';
import { Embers } from '../components/Embers';

const LAST_MESSAGES = {
  '1': "I felt that. I've been trying to get my editing time down.",
  '2': "That's exactly what I was worried about. Good to have it confirmed.",
  '3': "I almost didn't post it. Glad it landed.",
  '4': "Nice. I've been debating the M3 but can't justify it yet.",
  '5': "It always does. Worth it though — it really elevated the piece.",
  '6': "Same. At some point I think the sitting IS the work.",
  '7': "Solid. I've been considering the MV7. Good to hear it holds up.",
};

const TIMESTAMPS = {
  '1': '9:41 AM', '2': '10:02 AM', '3': 'just now',
  '4': 'yesterday', '5': '2h ago', '6': 'Mon', '7': 'Sun',
};

const UNREAD_COUNTS = { '3': 2, '5': 1 };

const MEMBERS = GROUP_MEMBERS.map((m) => ({
  ...m,
  lastMsg: LAST_MESSAGES[m.id] ?? '',
  unread: UNREAD_COUNTS[m.id] ?? 0,
  timestamp: TIMESTAMPS[m.id] ?? '',
}));

function Avatar({ member, size = 44 }) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: member.color + '33',
          borderWidth: 1.5,
          borderColor: member.color + '55',
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.33 }]}>
        {member.initials}
      </Text>
    </View>
  );
}

export function DMListScreen({ navigation }) {
  const renderItem = ({ item }) => {
    const unreadHint = item.unread > 0 ? `, ${item.unread} unread` : '';
    const rowLabel = `${item.name}, ${item.lastMsg}, ${item.timestamp}${unreadHint}`;
    return (
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('DM', { user: item })}
        accessibilityLabel={rowLabel}
        accessibilityRole="button"
      >
        <Avatar member={item} size={46} />
        <View style={styles.rowInfo}>
          <View style={styles.rowMeta}>
            <Text style={[styles.rowName, item.unread > 0 && styles.rowNameUnread]}>
              {item.name}
            </Text>
            <View style={styles.rowMetaRight}>
              {item.unread > 0 && (
                <View
                  style={styles.unreadBadge}
                  accessible
                  accessibilityLabel={`${item.unread} unread`}
                >
                  <Text style={styles.unreadBadgeText}>{item.unread}</Text>
                </View>
              )}
              <Text style={[styles.timestamp, item.unread > 0 && styles.timestampUnread]}>
                {item.timestamp}
              </Text>
            </View>
          </View>
          <Text
            style={[styles.rowPreview, item.unread > 0 && styles.rowPreviewUnread]}
            numberOfLines={1}
          >
            {item.lastMsg}
          </Text>
        </View>
      </TouchableOpacity>
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
            onPress={() => navigation.navigate('Home')}
            style={styles.backBtn}
            accessibilityLabel="Back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.title}>Messages</Text>
          <View style={{ width: 38 }} />
        </View>
      </View>

      <FlatList
        data={MEMBERS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerWrap: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: contentPadding,
    paddingVertical: 14,
  },
  backBtn: { padding: 4, width: 38 },
  title: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  list: {
    paddingHorizontal: contentPadding,
    paddingTop: 16,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
  },
  rowInfo: { flex: 1 },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rowMetaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  timestampUnread: {
    color: colors.accentVibrant,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  rowName: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },
  rowNameUnread: {
    color: colors.textPrimary,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  rowPreview: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
    lineHeight: 18,
  },
  rowPreviewUnread: {
    color: colors.textSecondary,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accentVibrant,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: 60,
  },
});
