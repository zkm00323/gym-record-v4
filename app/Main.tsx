import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import { styles } from './Styles';
import { signOut, useProfile } from './helper/accountHelper';
import { uploadProfileImage } from './helper/accountHelper';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const Main = () => {
    const { profile, loading, getProfile, updateGender } = useProfile();
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async () => {
        if (!profile?.id) return;

        try {
            setUploading(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                const uploadResult = await uploadProfileImage(profile.id, result.assets[0].base64);
                if (uploadResult.success) {
                    await getProfile();
                    Alert.alert('成功', '頭像已更新');
                }
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            Alert.alert('錯誤', '上傳頭像時發生錯誤');
        } finally {
            setUploading(false);
        }
    };

    const handleGenderChange = async (gender: 'male' | 'female') => {
        try {
            await updateGender(gender);
            Alert.alert('成功', '性別已更新');
        } catch (error) {
            Alert.alert('錯誤', '更新性別時發生錯誤');
        }
    };

    const getGenderText = (gender: 'male' | 'female' | null) => {
        switch (gender) {
            case 'male':
                return '男性';
            case 'female':
                return '女性';
            default:
                return '未設定';
        }
    };

    console.log(profile?.avatar_url);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
                <Text>載入中...</Text>
            ) : (
                <>
                    <TouchableOpacity onPress={handleImageUpload}>
                        <Image
                            source={{ uri: profile?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 20 }}
                        />
                        {uploading && <Text>上傳中...</Text>}
                        <Text style={{ textAlign: 'center', color: '#666' }}>點擊更換頭像</Text>
                    </TouchableOpacity>
                    <Text>{profile?.username || profile?.email}</Text>
                    <Text>{profile?.id}</Text>

                    <View style={{ width: 200, marginVertical: 20 }}>
                        <Text style={{ textAlign: 'center', marginBottom: 10, color: '#666' }}>
                            目前性別：{getGenderText(profile?.gender)}
                        </Text>
                        <View style={{ gap: 10 }}>
                            <TouchableOpacity
                                style={[
                                    styles.login,
                                    { backgroundColor: profile?.gender === 'male' ? '#4CAF50' : '#2196F3' }
                                ]}
                                onPress={() => handleGenderChange('male')}
                            >
                                <Text style={{ color: 'white' }}>設為男性</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.login,
                                    { backgroundColor: profile?.gender === 'female' ? '#4CAF50' : '#2196F3' }
                                ]}
                                onPress={() => handleGenderChange('female')}
                            >
                                <Text style={{ color: 'white' }}>設為女性</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

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