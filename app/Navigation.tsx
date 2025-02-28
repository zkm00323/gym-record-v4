import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Main from './Main';
import Exercise from './Exercise';

type Screen = 'Main' | 'Exercise';

const Navigation = () => {
    const [currentScreen, setCurrentScreen] = React.useState<Screen>('Main');

    const renderScreen = () => {
        switch (currentScreen) {
            case 'Main':
                return <Main />;
            case 'Exercise':
                return <Exercise />;
            default:
                return <Main />;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {renderScreen()}
            </View>
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        currentScreen === 'Main' && styles.activeTab
                    ]}
                    onPress={() => setCurrentScreen('Main')}
                >
                    <Text style={styles.tabText}>主頁</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        currentScreen === 'Exercise' && styles.activeTab
                    ]}
                    onPress={() => setCurrentScreen('Exercise')}
                >
                    <Text style={styles.tabText}>運動</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#fff',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#f0f0f0',
    },
    tabText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'poppins-Regular',
    },
});

export default Navigation; 