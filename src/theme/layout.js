import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const MAX_CONTENT_WIDTH = 768;
export const MIN_MARGIN = 24;

// On screens narrower than 816px (768 + 2×24), use 24px margins.
// On wider screens, center the 768px content with equal margins.
export const contentPadding = Math.max(MIN_MARGIN, (width - MAX_CONTENT_WIDTH) / 2);
