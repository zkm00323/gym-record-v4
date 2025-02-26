import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Image, TextInput } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID, WEB_CLIENT_ID } from '@env';

import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import React from "react";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

interface UserInfo {
  picture?: string;
  email: string;
  verified_email: boolean;
  name: string;
}

export default function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '570378973190-rmuqd6rlr59escil3th8p9rvh8gm927l.apps.googleusercontent.com',
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  });

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    onGoogleLogin();
  }, [response]);

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  async function onGoogleLogin() {
    const user = await getLocalUser();
    if (!user) {
      if (response?.type === "success") {
        if (response.authentication?.idToken) {
          const token = response.authentication.idToken;
          console.log(">>>", response);


          const { data, error } = await supabase.auth.signInWithIdToken({
            'provider': 'google',
            'token': token,
          });
          if (error) {
            Alert.alert(error.message)
            console.log("> >", error);
          } else {
            // setUserInfo(data.user)
          }
        }

        // const token = response?.authentication?.accessToken;
        // if (token) {
        //   try {
        //     const response = await fetch(
        //       "https://www.googleapis.com/userinfo/v2/me",
        //       { headers: { Authorization: `Bearer ${token}` } }
        //     );
        //     const user = await response.json();
        //     await AsyncStorage.setItem("@user", JSON.stringify(user));
        //     setUserInfo(user);
        //   } catch (error) { }
        // }
      }
    } else {
      setUserInfo(user);
      console.log("loaded locally");
    }
  }

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      {session && session.user ? (
        <View style={styles.card}>
          <Text style={styles.text}>Email: {session?.user?.email}</Text>
        </View>
      ) : (<View />)}

      {!userInfo ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      ) : (
        <View style={styles.card}>
          {userInfo?.picture && (
            <Image source={{ uri: userInfo?.picture }} style={styles.image} />
          )}
          <Text style={styles.text}>Email: {userInfo.email}</Text>
          <Text style={styles.text}>
            Verified: {userInfo.verified_email ? "yes" : "no"}
          </Text>
          <Text style={styles.text}>Name: {userInfo.name}</Text>
        </View>
      )}
      <Button
        title="remove local store"
        onPress={async () => {
          supabase.auth.signOut();
          await AsyncStorage.removeItem("@user");
          setUserInfo(null);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
      />

      <Button
        title="Sign in"
        disabled={loading}
        onPress={() => signInWithEmail()}
      />

      <Button
        title="Sign up"
        disabled={loading}
        onPress={() => signUpWithEmail()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    width: "80%",
  },
});