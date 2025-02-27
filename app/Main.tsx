import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import { styles } from './Styles';
import { signOut, useProfile } from './helper/accountHelper';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';
import { Alert } from 'react-native';

const Main = () => {
    const { profile, loading, getProfile } = useProfile();
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                await uploadAvatar(result.assets[0].base64);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('錯誤', '選擇圖片時發生錯誤');
        }
    };

    const uploadAvatar = async (base64File: string) => {
        try {
            setUploading(true);

            const fileName = `${profile?.id}-${Date.now()}.jpg`;

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

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: data.publicUrl })
                .eq('id', profile?.id);

            if (updateError) {
                throw updateError;
            }

            await getProfile();
            Alert.alert('成功', '頭像已更新');

        } catch (error) {
            console.error('Error uploading avatar:', error);
            Alert.alert('錯誤', '上傳頭像時發生錯誤');
        } finally {
            setUploading(false);
        }
    };

    console.log(profile?.avatar_url);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
                <Text>載入中...</Text>
            ) : (
                <>
                    <TouchableOpacity onPress={pickImage}>
                        <Image
                            source={{ uri: profile?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 20 }}
                        />
                        {uploading && <Text>上傳中...</Text>}
                        <Text style={{ textAlign: 'center', color: '#666' }}>點擊更換頭像</Text>
                    </TouchableOpacity>
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