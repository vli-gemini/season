// Season — Group Matching Algorithm
//
// Input:  an array of user objects (one per person who completed the quiz)
// Output: { groups, waitlisted, summary }
//
// Each user object must have these fields (matching the quiz answer IDs):
//   id        — unique user identifier (string)
//   stage     — 'starting' | 'building' | 'established' | 'experienced'
//   niche     — 'video' | 'audio' | 'written' | 'visual' | 'mixed'
//   struggle  — 'consistency' | 'motivation' | 'direction' | 'isolation' | 'balance'
//   need      — 'accountability' | 'feedback' | 'belonging' | 'inspiration' | 'direction'
//   style     — 'open' | 'process' | 'listen' | 'responsive'
//   region    — 'americas' | 'europe' | 'asia'
//   platforms — array, e.g. ['youtube', 'instagram']

const STAGE_ORDER = ['starting', 'building', 'established', 'experienced'];
const MIN_GROUP = 5;
const MAX_GROUP = 8;

function stageIndex(stage) {
  return STAGE_ORDER.indexOf(stage);
}

// Hard constraints — region must match, stages must be within 1 level of each other
function canPair(a, b) {
  if (a.region !== b.region) return false;
  return Math.abs(stageIndex(a.stage) - stageIndex(b.stage)) <= 1;
}

// A candidate can join a group only if they're compatible with every existing member
function canJoinGroup(candidate, group) {
  return group.every(member => canPair(candidate, member));
}

// How compatible are two users? Higher score = better match
function pairScore(a, b) {
  let score = 0;

  // What they need from the group (high weight)
  if (a.need === b.need) score += 3;

  // What they're struggling with — shared pain builds empathy (secondary weight)
  if (a.struggle === b.struggle) score += 1;

  // How they participate in groups (soft weight)
  if (a.style === b.style) score += 1;

  // Different niches are better — creators won't be competing with each other (soft)
  const bothKnown = a.niche !== 'mixed' && b.niche !== 'mixed';
  if (bothKnown && a.niche !== b.niche) score += 1;

  // Shared platforms mean shared context (soft)
  if (a.platforms && b.platforms) {
    const overlap = a.platforms.filter(p => b.platforms.includes(p)).length;
    score += overlap * 0.3;
  }

  return score;
}

// Average pairwise score across all pairs in a group
function groupScore(group) {
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      total += pairScore(group[i], group[j]);
      pairs++;
    }
  }
  return pairs > 0 ? total / pairs : 0;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Main matching function
// Returns: { groups: Array<Array<user>>, waitlisted: Array<user>, summary: object }
export function matchUsers(users) {
  const pool = shuffle(users);
  const assigned = new Set();
  const fullGroups = [];
  const partialGroups = [];

  for (const seed of pool) {
    if (assigned.has(seed.id)) continue;

    assigned.add(seed.id);
    const group = [seed];

    // Find all compatible unassigned users and rank them by fit
    const candidates = pool
      .filter(u => !assigned.has(u.id) && canPair(u, seed))
      .map(u => ({ user: u, score: pairScore(seed, u) }))
      .sort((a, b) => b.score - a.score);

    for (const { user } of candidates) {
      if (group.length >= MAX_GROUP) break;
      if (canJoinGroup(user, group)) {
        group.push(user);
        assigned.add(user.id);
      }
    }

    if (group.length >= MIN_GROUP) {
      fullGroups.push(group);
    } else {
      partialGroups.push(group);
    }
  }

  const waitlisted = partialGroups.flat();

  return {
    groups: fullGroups,
    waitlisted,
    summary: {
      totalUsers: users.length,
      groupsFormed: fullGroups.length,
      usersMatched: fullGroups.reduce((n, g) => n + g.length, 0),
      usersWaitlisted: waitlisted.length,
      averageGroupScore: fullGroups.length
        ? Number((fullGroups.reduce((sum, g) => sum + groupScore(g), 0) / fullGroups.length).toFixed(2))
        : 0,
    },
  };
}

// Returns a plain-English explanation of a group — useful for your admin view
export function explainGroup(group) {
  return {
    size: group.length,
    region: group[0].region,
    stages: group.map(u => u.stage),
    needs: group.map(u => u.need),
    niches: group.map(u => u.niche),
    styles: group.map(u => u.style),
    score: Number(groupScore(group).toFixed(2)),
    members: group.map(u => u.id),
  };
}
