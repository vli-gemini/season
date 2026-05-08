// Run this to test the matching algorithm with fake users:
//   node scripts/testMatch.mjs

import { matchUsers, explainGroup } from '../src/utils/matchAlgorithm.js';

// --- Sample users (stand-ins for real quiz responses) ---

const sampleUsers = [
  { id: 'u1',  region: 'americas', stage: 'building',     niche: 'video',   struggle: 'consistency', need: 'accountability', style: 'open',       platforms: ['youtube', 'instagram'] },
  { id: 'u2',  region: 'americas', stage: 'building',     niche: 'written', struggle: 'motivation',  need: 'accountability', style: 'process',    platforms: ['twitter', 'instagram'] },
  { id: 'u3',  region: 'americas', stage: 'starting',     niche: 'audio',   struggle: 'isolation',   need: 'belonging',      style: 'listen',     platforms: ['podcast'] },
  { id: 'u4',  region: 'americas', stage: 'building',     niche: 'visual',  struggle: 'direction',   need: 'feedback',       style: 'open',       platforms: ['instagram'] },
  { id: 'u5',  region: 'americas', stage: 'starting',     niche: 'video',   struggle: 'consistency', need: 'accountability', style: 'responsive', platforms: ['tiktok', 'youtube'] },
  { id: 'u6',  region: 'americas', stage: 'building',     niche: 'mixed',   struggle: 'balance',     need: 'inspiration',    style: 'open',       platforms: ['instagram', 'twitter'] },
  { id: 'u7',  region: 'americas', stage: 'established',  niche: 'video',   struggle: 'direction',   need: 'feedback',       style: 'process',    platforms: ['youtube'] },
  { id: 'u8',  region: 'americas', stage: 'building',     niche: 'written', struggle: 'motivation',  need: 'belonging',      style: 'listen',     platforms: ['twitter'] },
  { id: 'u9',  region: 'americas', stage: 'established',  niche: 'audio',   struggle: 'consistency', need: 'accountability', style: 'open',       platforms: ['podcast', 'instagram'] },
  { id: 'u10', region: 'americas', stage: 'established',  niche: 'visual',  struggle: 'isolation',   need: 'belonging',      style: 'responsive', platforms: ['instagram'] },
  { id: 'u11', region: 'europe',   stage: 'building',     niche: 'video',   struggle: 'motivation',  need: 'inspiration',    style: 'open',       platforms: ['youtube', 'tiktok'] },
  { id: 'u12', region: 'europe',   stage: 'building',     niche: 'written', struggle: 'direction',   need: 'feedback',       style: 'process',    platforms: ['twitter'] },
  { id: 'u13', region: 'europe',   stage: 'starting',     niche: 'audio',   struggle: 'isolation',   need: 'belonging',      style: 'listen',     platforms: ['podcast'] },
  { id: 'u14', region: 'europe',   stage: 'building',     niche: 'visual',  struggle: 'consistency', need: 'accountability', style: 'open',       platforms: ['instagram'] },
  { id: 'u15', region: 'europe',   stage: 'established',  niche: 'video',   struggle: 'balance',     need: 'direction',      style: 'responsive', platforms: ['youtube'] },
  { id: 'u16', region: 'asia',     stage: 'building',     niche: 'video',   struggle: 'consistency', need: 'accountability', style: 'open',       platforms: ['youtube', 'tiktok'] },
  { id: 'u17', region: 'asia',     stage: 'building',     niche: 'visual',  struggle: 'direction',   need: 'feedback',       style: 'process',    platforms: ['instagram'] },
  { id: 'u18', region: 'asia',     stage: 'starting',     niche: 'written', struggle: 'motivation',  need: 'belonging',      style: 'listen',     platforms: ['twitter'] },
  { id: 'u19', region: 'asia',     stage: 'building',     niche: 'audio',   struggle: 'isolation',   need: 'inspiration',    style: 'responsive', platforms: ['podcast'] },
  { id: 'u20', region: 'asia',     stage: 'experienced',  niche: 'video',   struggle: 'balance',     need: 'direction',      style: 'open',       platforms: ['youtube'] },
];

// --- Run the match ---

const result = matchUsers(sampleUsers);

console.log('\n=== SEASON MATCHING RESULTS ===\n');
console.log('Summary:', result.summary);

console.log('\n--- Groups ---');
result.groups.forEach((group, i) => {
  const info = explainGroup(group);
  console.log(`\nGroup ${i + 1}:`);
  console.log(`  Members:  ${info.members.join(', ')}`);
  console.log(`  Region:   ${info.region}`);
  console.log(`  Stages:   ${info.stages.join(', ')}`);
  console.log(`  Needs:    ${info.needs.join(', ')}`);
  console.log(`  Niches:   ${info.niches.join(', ')}`);
  console.log(`  Score:    ${info.score}`);
});

if (result.waitlisted.length > 0) {
  console.log(`\n--- Waitlisted (not enough compatible users this cohort) ---`);
  console.log(result.waitlisted.map(u => `  ${u.id} — ${u.region}, ${u.stage}`).join('\n'));
}
