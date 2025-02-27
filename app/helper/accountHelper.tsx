import { View, Text, Alert } from 'react-native'
import React from 'react'
import { supabase } from "../../lib/supabase";
import { Session } from '@supabase/supabase-js';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID, WEB_CLIENT_ID } from '@env';
import { decode } from 'base64-arraybuffer';

WebBrowser.maybeCompleteAuthSession();

export interface Profile {
    id: string;
    username: string | null;
    avatar_url: string | null;
    email: string | null;
    gender: 'male' | 'female' | null;
}

type ProfileUpdateFields = Partial<Omit<Profile, 'id' | 'email'>>;

export function useProfile() {
    const session = useSession();
    const [profile, setProfile] = React.useState<Profile | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (session?.user?.id) {
            getProfile();
        }
    }, [session]);

    async function getProfile() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select(`username, avatar_url, gender`)
                .eq('id', session?.user?.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error.message);
                return;
            }

            if (data) {
                setProfile({
                    id: session?.user?.id || null,
                    email: session?.user?.email || null,
                    ...data
                } as Profile);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile(updates: ProfileUpdateFields) {
        if (!session?.user?.id) return;

        try {
            setLoading(true);
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', session.user.id);

            if (error) {
                Alert.alert('Error updating profile:', error.message);
                return false;
            }

            await getProfile();
            return true;
        } catch (error) {
            console.error('Error:', error);
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            }
            return false;
        } finally {
            setLoading(false);
        }
    }

    async function uploadAvatar(base64File: string) {
        if (!session?.user?.id) return { success: false };

        try {
            setLoading(true);
            const fileName = `${session.user.id}-${Date.now()}.jpg`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, decode(base64File), {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = await supabase.storage
                .from('avatars')
                .getPublicUrl(uploadData.path);

            const success = await updateProfile({ avatar_url: data.publicUrl });
            return { success, publicUrl: data.publicUrl };
        } catch (error) {
            console.error('Error uploading avatar:', error);
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            }
            return { success: false };
        } finally {
            setLoading(false);
        }
    }

    return {
        profile,
        loading,
        updateProfile,
        uploadAvatar
    };
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

export function useGoogleAuth() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '570378973190-rmuqd6rlr59escil3th8p9rvh8gm927l.apps.googleusercontent.com',
        iosClientId: IOS_CLIENT_ID,
        webClientId: WEB_CLIENT_ID,
    });

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

    React.useEffect(() => {
        if (response?.type === "success" && response.authentication?.idToken) {
            handleGoogleLogin(response.authentication.idToken);
        }
    }, [response]);

    return { request, promptAsync };
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