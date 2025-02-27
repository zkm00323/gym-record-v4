import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import Auth from './app/Auth';
import SignIn from './app/SignIn';
import Main from './app/Main';
import { StyleSheet } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { useSession } from './app/helper/accountHelper';

export default function App() {
  const [fontsLoaded] = useFonts({
    "poppins-Bold": require("./assets/font/Poppins-Bold.ttf"),
    "poppins-Regular": require("./assets/font/Poppins-Regular.ttf"),
  })

  const session = useSession();

  return session && session.user ? <Main /> : <SignIn />;
};
