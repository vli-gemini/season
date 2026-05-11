import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { EmailScreen } from '../screens/EmailScreen';
import { WaitlistScreen } from '../screens/WaitlistScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { DMListScreen } from '../screens/DMListScreen';
import { DMScreen } from '../screens/DMScreen';
import { MemberProfileScreen } from '../screens/MemberProfileScreen';
import { GroupSettingsScreen } from '../screens/GroupSettingsScreen';
import { SeasonEndingScreen } from '../screens/SeasonEndingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SeasonWrapScreen } from '../screens/SeasonWrapScreen';
import { MatchRevealScreen } from '../screens/MatchRevealScreen';
import { ConfirmationScreen } from '../screens/ConfirmationScreen';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['http://localhost:8081'],
  config: {
    screens: {
      Splash:      '/',
      Onboarding:  '/onboarding',
      Quiz: {
        path: '/quiz/:questionIndex',
        parse:     { questionIndex: (n) => parseInt(n, 10) - 1 },
        stringify: { questionIndex: (n) => String((n ?? 0) + 1) },
      },
      Waitlist:    '/waitlist',
      Confirmation: '/confirmation',
      MatchReveal: '/match',
      Email:       '/email',
      Home:        '/home',
      GroupSettings: '/group',
      DMList:      '/dms',
      DM:          '/dm',
      MemberProfile: '/member',
      Profile:     '/profile',
      SeasonWrap:   '/season-wrap',
      SeasonEnding: '/season-ending',
    },
  },
};

export function Navigation() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Splash"       component={SplashScreen} />
        <Stack.Screen name="Onboarding"   component={OnboardingScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Quiz"         component={QuizScreen}        options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Waitlist"     component={WaitlistScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="MatchReveal"  component={MatchRevealScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Email"        component={EmailScreen}       options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Home"        component={HomeScreen} />
        <Stack.Screen name="GroupSettings" component={GroupSettingsScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="DMList"      component={DMListScreen}     options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="DM"          component={DMScreen}         options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="MemberProfile" component={MemberProfileScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Profile"     component={ProfileScreen}    options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="SeasonWrap"   component={SeasonWrapScreen}   options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="SeasonEnding" component={SeasonEndingScreen}  options={{ animation: 'slide_from_bottom' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
