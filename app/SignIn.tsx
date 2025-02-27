import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Button, TextInput, TouchableOpacity, Image } from 'react-native'

import { styles } from './Styles';
import { signInWithEmail, signUpWithEmail, useGoogleAuth } from './helper/accountHelper';

const SocialButton = ({ imageSource, onPress }) => (
    <TouchableOpacity style={{ width: 50, height: 50, backgroundColor: '#000', borderRadius: 99, justifyContent: 'center', alignItems: 'center' }} onPress={onPress}>
        <Image source={imageSource} style={{ width: '40%', height: '40%' }} />
    </TouchableOpacity>
);

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { request, promptAsync } = useGoogleAuth();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.title}>GYM Record</Text>
            <Text style={styles.subtitle}>Help you get stronger</Text>
            <View style={{ marginTop: 50 }} />
            <TextInput placeholder='請輸入帳號' style={styles.input} value={email} onChangeText={setEmail} />
            <View style={{ marginTop: 10 }} />
            <TextInput placeholder='請輸入密碼' style={styles.input} value={password} onChangeText={setPassword} />
            <View style={{ marginTop: 10 }} />
            <TouchableOpacity style={styles.login} onPress={() => signInWithEmail(email, password)}>
                <Text style={{ color: 'white', fontSize: 16 }}>
                    登入
                </Text>
            </TouchableOpacity>
            <View style={{ marginTop: 10 }} />
            <TouchableOpacity style={styles.register} onPress={() => signUpWithEmail(email, password)}>
                <Text style={{ color: 'black', fontSize: 16 }}>
                    註冊
                </Text>
            </TouchableOpacity>
            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={{ marginHorizontal: 10 }}>or</Text>
                <View style={styles.dividerLine} />
            </View>
            <View style={{ marginTop: 10 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 15 }}>
                <SocialButton imageSource={require('../assets/image/apple.png')} onPress={() => promptAsync()} />
                <SocialButton imageSource={require('../assets/image/google.png')} onPress={() => promptAsync()} />
            </View>
            <View style={{ marginTop: 100 }} />
        </View>
    )
}

export default SignIn