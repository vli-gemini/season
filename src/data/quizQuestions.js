export const quizQuestions = [
  {
    id: 1,
    question: 'The hardest part of being a creator right now is...',
    options: [
      { id: 'a', label: 'Feeling like I\'m figuring it out alone' },
      { id: 'b', label: 'Maintaining any kind of consistent output' },
      { id: 'c', label: 'Staying motivated when nothing seems to land' },
      { id: 'd', label: 'Knowing what to make next' },
      { id: 'e', label: 'Pushing through creative blocks' },
    ],
  },
  {
    id: 2,
    question: 'When something you made doesn\'t land, you...',
    options: [
      { id: 'a', label: 'Feel like I\'m right back to square one' },
      { id: 'b', label: 'Take a step back and try to figure out why' },
      { id: 'c', label: 'Push past it and try something new' },
      { id: 'd', label: 'Question everything about my creative direction' },
      { id: 'e', label: 'None of the above' },
    ],
  },
  {
    id: 3,
    question: 'What would actually help you most right now?',
    options: [
      { id: 'a', label: 'Someone to hold me accountable' },
      { id: 'b', label: 'People who understand the struggle without explaining' },
      { id: 'c', label: 'Honest feedback that isn\'t just encouragement' },
      { id: 'd', label: 'Seeing others make progress doing the same thing' },
      { id: 'e', label: 'None of the above' },
    ],
  },
  {
    id: 4,
    question: 'Where are you in your creative journey?',
    options: [
      { id: 'a', label: 'Just starting out — still figuring it all out' },
      { id: 'b', label: 'Building — posting but not yet consistent' },
      { id: 'c', label: 'Established — consistent output, growing my audience' },
      { id: 'd', label: 'Experienced — questioning what\'s next despite the track record' },
      { id: 'e', label: 'None of the above' },
    ],
  },
  {
    id: 5,
    question: 'Something you rarely admit about creating...',
    options: [
      { id: 'a', label: 'I feel more alone in this than I let on' },
      { id: 'b', label: 'I\'m not sure I can find people who truly get it' },
      { id: 'c', label: 'I\'m harder on myself than I\'d ever be on anyone else' },
      { id: 'd', label: 'Sometimes I wonder if I should have started at all' },
      { id: 'e', label: 'None of the above' },
    ],
  },
  {
    id: 6,
    question: 'What would make this season feel worthwhile?',
    options: [
      { id: 'a', label: 'Finding people who truly get what I\'m building' },
      { id: 'b', label: 'Being more honest about what I\'m working on' },
      { id: 'c', label: 'Finding a clearer creative direction' },
      { id: 'd', label: 'Just doing it — getting out of my own way' },
      { id: 'e', label: 'None of the above' },
    ],
  },
  {
    id: 7,
    question: 'Where do you create?',
    options: [
      { id: 'a', label: 'YouTube' },
      { id: 'b', label: 'TikTok' },
      { id: 'c', label: 'Instagram' },
      { id: 'd', label: 'Podcasts' },
      { id: 'e', label: 'Other(s)' },
    ],
    multiSelect: true,
  },
  {
    id: 8,
    question: 'Tell us where to find your work.',
    subtitle: 'Add at least one username so we can find your people.',
    type: 'social_handles',
    platforms: [
      { id: 'youtube', label: 'YouTube', placeholder: 'username' },
      { id: 'tiktok', label: 'TikTok', placeholder: 'username' },
    ],
  },
];
