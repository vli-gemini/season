import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { contentPadding } from '../theme/layout';
import { LinearGradient } from '../components/Gradient';
import { getSeasonGradient } from '../theme/seasonGradient';
import { CURRENT_DAY, TOTAL_DAYS } from '../config/season';
import { GROUP_MEMBERS, DM_SEEDS } from '../config/members';
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

const UNREAD_COUNTS = { '3': 2, '5': 1 };

const MEMBERS = GROUP_MEMBERS.map((m) => ({
  ...m,
  lastMsg: LAST_MESSAGES[m.id] ?? '',
  unread: UNREAD_COUNTS[m.id] ?? 0,
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
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('DM', { user: item })}
    >
      <Avatar member={item} size={44} />
      <View style={styles.rowInfo}>
        <View style={styles.rowMeta}>
          <Text style={[styles.rowName, item.unread > 0 && styles.rowNameUnread]}>
            {item.name}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unread}</Text>
            </View>
          )}
        </View>
        <Text
          style={[styles.rowPreview, item.unread > 0 && styles.rowPreviewUnread]}
          numberOfLines={1}
        >
          {item.lastMsg}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient
        colors={getSeasonGradient(CURRENT_DAY, TOTAL_DAYS)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Embers />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Messages</Text>
        <View style={{ width: 38 }} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: contentPadding,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  backBtn: { padding: 4, width: 38 },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
  },
  list: {
    paddingHorizontal: contentPadding,
    paddingTop: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
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
    marginBottom: 3,
  },
  rowName: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textPrimary,
  },
  rowNameUnread: {
    color: colors.textPrimary,
  },
  rowPreview: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textMuted,
  },
  rowPreviewUnread: {
    color: colors.textSecondary,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accentWarm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.background,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
