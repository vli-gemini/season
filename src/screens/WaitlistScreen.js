import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const MESSAGES = [
  'Philosophizing...',
  'Consulting the universe...',
  'Reading between the timezones...',
  'Weighing creative energies...',
  'Contemplating your spirit...',
  'Assembling the constellation...',
  'Finding your people...',
];

const CHAR_INTERVAL = 48;
const PAUSE_AFTER = 700;
const TOTAL_DURATION = 3000;

function randomIndex(exclude) {
  let i;
  do { i = Math.floor(Math.random() * MESSAGES.length); } while (i === exclude);
  return i;
}

export function WaitlistScreen({ navigation, route }) {
  const { answers = {}, verifiedEmail = null } = route.params ?? {};
  const [msgIndex, setMsgIndex] = useState(() => randomIndex(-1));
  const [displayed, setDisplayed] = useState('');
  const charRef = useRef(0);
  const timerRef = useRef(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    charRef.current = 0;
    setDisplayed('');
    const full = MESSAGES[msgIndex];

    const tick = () => {
      charRef.current += 1;
      setDisplayed(full.slice(0, charRef.current));

      if (charRef.current < full.length) {
        timerRef.current = setTimeout(tick, CHAR_INTERVAL);
      } else {
        timerRef.current = setTimeout(() => {
          if (Date.now() - startTime.current >= TOTAL_DURATION) {
            navigation.replace('Confirmation', { answers, verifiedEmail });
          } else {
            setMsgIndex(randomIndex(msgIndex));
          }
        }, PAUSE_AFTER);
      }
    };

    timerRef.current = setTimeout(tick, CHAR_INTERVAL);
    return () => clearTimeout(timerRef.current);
  }, [msgIndex]);

  return (
    <SafeAreaView style={styles.safe}>
      <Image
        source={require('../../assets/splash background.png')}
        style={[StyleSheet.absoluteFill, styles.bgImage]}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.bgOverlay]} />

      <View style={styles.container}>
        <Text style={styles.message}>{displayed}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  bgOverlay: {
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  message: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});
