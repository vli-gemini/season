import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { WaitlistScreen } from '../screens/WaitlistScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { DMScreen } from '../screens/DMScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SeasonWrapScreen } from '../screens/SeasonWrapScreen';

const Stack = createNativeStackNavigator();

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Waitlist" component={WaitlistScreen} />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="DM"
          component={DMScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="SeasonWrap"
          component={SeasonWrapScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
