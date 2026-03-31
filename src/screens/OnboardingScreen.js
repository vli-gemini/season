import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { Button } from '../components/Button';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    headline: 'Eight creators.\nChosen for exactly\nwhere you are.',
    cta: 'Find your people',
    bg: require('../../assets/onboarding1.jpg'),
  },
  {
    id: '2',
    headline: 'Thirty days.\nOne season.\nMeaningful because it ends.',
    cta: 'Find your people',
    bg: require('../../assets/onboarding2.jpg'),
  },
  {
    id: '3',
    headline: 'Your next season starts\nwith the right people.',
    cta: 'Find your people',
    bg: require('../../assets/onboarding3.jpg'),
  },
];

export function OnboardingScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleCta = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      navigation.replace('Auth');
    }
  };

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <ImageBackground
        source={item.bg}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        onError={() => {}} // gracefully handle missing assets
      />
      <LinearGradient
        colors={['rgba(13,11,20,0)', 'rgba(13,11,20,0.55)', 'rgba(13,11,20,0.95)', '#0D0B14']}
        locations={[0, 0.35, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.wordmark}>Season</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.headline}>{item.headline}</Text>
          <Button label={item.cta} onPress={handleCta} style={styles.ctaBtn} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      />
      {/* Dot indicators */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    width,
    height,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordmark: {
    fontSize: 18,
    fontWeight: '300',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  bottom: {
    gap: 24,
  },
  headline: {
    fontSize: 30,
    fontWeight: '300',
    color: colors.textPrimary,
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  ctaBtn: {
    borderRadius: 14,
  },
  dots: {
    position: 'absolute',
    bottom: 130,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: colors.textPrimary,
    width: 16,
  },
});
