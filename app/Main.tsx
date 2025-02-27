import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { styles } from './Styles';
import { signOut, useSession } from './helper/accountHelper';

const Main = () => {

    const session = useSession();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{session?.user?.email}</Text>
            <Text>{session?.user?.id}</Text>

            <TouchableOpacity style={styles.login} onPress={() => signOut()}>
                <Text style={{ color: 'white', fontSize: 16 }}>
                    登出
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default Main