import { useFonts } from 'expo-font';
import React from 'react';
import Auth from './app/Auth';
import SignIn from './app/SignIn';
import Navigation from './app/Navigation';
import { StyleSheet } from 'react-native';
import { useSession } from './app/helper/accountHelper';

export default function App() {
  const [fontsLoaded] = useFonts({
    "poppins-Bold": require("./assets/font/Poppins-Bold.ttf"),
    "poppins-Regular": require("./assets/font/Poppins-Regular.ttf"),
  });

  const session = useSession();

  return session && session.user ? <Navigation /> : <SignIn />;
}
