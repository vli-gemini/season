import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { GreatVibes_400Regular } from '@expo-google-fonts/great-vibes';
import { ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { Bungee_400Regular } from '@expo-google-fonts/bungee';
import { Navigation } from './src/navigation';

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    DMSerifDisplay_400Regular,
    DancingScript_700Bold,
    GreatVibes_400Regular,
    ArchivoBlack_400Regular,
    Bungee_400Regular,
  });

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: '#5D4463' }} />;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Navigation />
    </SafeAreaProvider>
  );
}
