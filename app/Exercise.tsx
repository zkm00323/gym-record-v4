import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Exercise = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>運動頁面</Text>
            <Text style={styles.paragraph}>
                這裡將會是運動相關的內容。
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'poppins-Bold',
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 8,
        fontFamily: 'poppins-Regular',
    },
});

export default Exercise; 