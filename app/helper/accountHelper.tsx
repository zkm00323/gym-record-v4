import { View, Text } from 'react-native'
import React from 'react'
import { supabase } from "../../lib/supabase";
import { Alert } from "react-native";
import { Session } from '@supabase/supabase-js';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID, WEB_CLIENT_ID } from '@env';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        webClientId: WEB_CLIENT_ID,
    });

    React.useEffect(() => {
        if (response?.type === "success" && response.authentication?.idToken) {
            handleGoogleLogin(response.authentication.idToken);
        }
    }, [response]);

    return { request, promptAsync };
}

async function handleGoogleLogin(idToken: string) {
    try {
        const { data, error } = await supabase.auth.signInWithIdToken({
            'provider': 'google',
            'token': idToken
        });
        if (error) {
            Alert.alert(error.message);
        }
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
        }
    }
}

export function useSession() {
    const [session, setSession] = React.useState<Session | null>(null);

    React.useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return session;
}

export default function accountHelper() {
    return (
        <View>
            <Text>accountHelper</Text>
        </View>
    )
}

export async function signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) Alert.alert(error.message);
}

export async function signUpWithEmail(email: string, password: string) {
    const {
        data: { session },
        error,
    } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert("Please check your inbox for email verification!");
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(error.message);
}