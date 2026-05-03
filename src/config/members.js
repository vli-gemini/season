export const ME = {
  id: 'me',
  name: 'You',
  initials: 'YO',
  color: '#C4A97D',
  isMe: true,
};

// The 7 other members in the group (+ ME = 8 total)
export const GROUP_MEMBERS = [
  { id: '1', name: 'Sarah Liao',    initials: 'SL', color: '#8B7FF5' },
  { id: '2', name: 'Mark Smith',    initials: 'MS', color: '#5ECA8A' },
  { id: '3', name: 'Priya Nair',    initials: 'PN', color: '#F4A261' },
  { id: '4', name: 'Jordan Lee',    initials: 'JL', color: '#E76F51' },
  { id: '5', name: 'Alex Chen',     initials: 'AC', color: '#64B5F6' },
  { id: '6', name: 'Maya Torres',   initials: 'MT', color: '#EC407A' },
  { id: '7', name: 'Kai Nakamura',  initials: 'KN', color: '#26C6DA' },
];

// All 8 people including you — for group chat display
export const ALL_MEMBERS = [...GROUP_MEMBERS, ME];

// Per-member profile details used on MemberProfileScreen
export const MEMBER_DETAILS = {
  '1': {
    handle: '@sarahliao',
    platforms: [
      { id: 'youtube', label: 'YouTube',  username: '@sarahliaocreates' },
      { id: 'tiktok',  label: 'TikTok',   username: '@sarahliao' },
    ],
    streak: 12,
    madeCount: 26,
    bio: 'Making stuff about creativity, burnout, and getting back up.',
  },
  '2': {
    handle: '@marksmith',
    platforms: [
      { id: 'youtube', label: 'YouTube', username: '@marksmithvideo' },
    ],
    streak: 8,
    madeCount: 24,
    bio: 'Documentary-style videos about real people doing real things.',
  },
  '3': {
    handle: '@priyanair',
    platforms: [
      { id: 'tiktok', label: 'TikTok', username: '@priyanair.makes' },
    ],
    streak: 15,
    madeCount: 19,
    bio: 'Short-form storytelling. Trying to post more, fear less.',
  },
  '4': {
    handle: '@jordanlee',
    platforms: [
      { id: 'youtube', label: 'YouTube', username: '@jordanleecreates' },
      { id: 'tiktok',  label: 'TikTok',  username: '@jordanlee' },
    ],
    streak: 6,
    madeCount: 14,
    bio: 'Gear nerd. Editing obsessive. Slowly learning to just ship it.',
  },
  '5': {
    handle: '@alexchen',
    platforms: [
      { id: 'youtube', label: 'YouTube', username: '@alexchenmakes' },
    ],
    streak: 20,
    madeCount: 21,
    bio: 'Motion graphics and visual experiments. Curious about everything.',
  },
  '6': {
    handle: '@mayatorres',
    platforms: [
      { id: 'tiktok',  label: 'TikTok',   username: '@mayatorres.creates' },
      { id: 'youtube', label: 'YouTube',   username: '@mayatorres' },
    ],
    streak: 9,
    madeCount: 17,
    bio: 'I make things that feel personal and then try not to delete them.',
  },
  '7': {
    handle: '@kainakamura',
    platforms: [
      { id: 'tiktok', label: 'TikTok', username: '@kainakamura' },
    ],
    streak: 11,
    madeCount: 23,
    bio: 'Sound designer turned video person. Still figuring it out.',
  },
};

// Seed DM messages keyed by member id
export const DM_SEEDS = {
  '1': [
    { id: '1', senderId: '1',  text: 'Hey! I really liked what you made yesterday. How long did that take you?', timestamp: '2:14 PM' },
    { id: '2', senderId: 'me', text: 'Thank you! Probably about 3 hours start to finish. The editing took forever.', timestamp: '2:20 PM' },
    { id: '3', senderId: '1',  text: "I felt that. I've been trying to get my editing time down. What do you use?", timestamp: '2:21 PM' },
    { id: '4', senderId: 'me', text: 'Mostly CapCut for the quick stuff, Premiere when it needs to be polished.', timestamp: '2:23 PM' },
  ],
  '2': [
    { id: '1', senderId: '2',  text: "Did you watch the latest thing I posted? I'm not sure about the pacing.", timestamp: '11:05 AM' },
    { id: '2', senderId: 'me', text: 'Yeah I did — I thought the middle section dragged a bit but the ending was strong.', timestamp: '11:12 AM' },
    { id: '3', senderId: '2',  text: 'That\'s exactly what I was worried about. Good to have it confirmed.', timestamp: '11:14 AM' },
  ],
  '3': [
    { id: '1', senderId: 'me', text: 'Your post yesterday hit me. The part about not wanting to finish things.', timestamp: '6:30 PM' },
    { id: '2', senderId: '3',  text: 'I almost didn\'t post it. Glad it landed.', timestamp: '6:45 PM' },
  ],
  '4': [
    { id: '1', senderId: '4',  text: "What's your editing setup? I'm trying to speed up my workflow.", timestamp: '3:00 PM' },
    { id: '2', senderId: 'me', text: 'MacBook Pro M2, Premiere for main edits, CapCut for quick social cuts.', timestamp: '3:08 PM' },
    { id: '3', senderId: '4',  text: 'Nice. I\'ve been debating the M3 but can\'t justify it yet.', timestamp: '3:10 PM' },
  ],
  '5': [
    { id: '1', senderId: '5',  text: 'I loved the motion work in your last video. Did you do that in AE?', timestamp: '9:20 AM' },
    { id: '2', senderId: 'me', text: 'Yeah, After Effects. Took way longer than it looks.', timestamp: '9:35 AM' },
    { id: '3', senderId: '5',  text: 'It always does. Worth it though — it really elevated the piece.', timestamp: '9:37 AM' },
  ],
  '6': [
    { id: '1', senderId: '6',  text: 'Do you ever just sit with something for weeks before posting it?', timestamp: '8:00 PM' },
    { id: '2', senderId: 'me', text: 'All the time. I have drafts from two months ago I still haven\'t touched.', timestamp: '8:14 PM' },
    { id: '3', senderId: '6',  text: 'Same. At some point I think the sitting IS the work.', timestamp: '8:16 PM' },
  ],
  '7': [
    { id: '1', senderId: '7',  text: "The audio in your last one was really clean. What mic are you on?", timestamp: '1:45 PM' },
    { id: '2', senderId: 'me', text: 'Shure MV7 into Focusrite. Simple setup but it works.', timestamp: '1:52 PM' },
    { id: '3', senderId: '7',  text: 'Solid. I\'ve been considering the MV7. Good to hear it holds up.', timestamp: '1:54 PM' },
  ],
};
