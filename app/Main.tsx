import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { styles } from './Styles';
import { signOut, useProfile } from './helper/accountHelper';

const Main = () => {
    const { profile, loading } = useProfile();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
                <Text>載入中...</Text>
            ) : (
                <>
                    {profile?.avatar_url && (
                        <Image
                            source={{ uri: profile.avatar_url }}
                            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 20 }}
                        />
                    )}
                    <Text>{profile?.username || profile?.email}</Text>
                    <Text>{profile?.id}</Text>

                    <TouchableOpacity style={styles.login} onPress={() => signOut()}>
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            登出
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    )
}

export default Main