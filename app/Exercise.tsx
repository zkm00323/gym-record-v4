import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { supabase } from '../lib/supabase';

// 身體部位列舉
type BodyPart = 'chest' | 'legs' | 'back' | 'arms' | 'core' | 'shoulders' | 'unknow' | 'hips';

// 肌肉部位列舉
type MusclePart = 'up_chest' | 'mid_chest' | 'lower_chest' | null;

interface Exercise {
    id: number;
    created_at: string;
    name: string;
    body_part: BodyPart;
    muscle_part: MusclePart;
}

const bodyPartMap: Record<BodyPart, string> = {
    chest: '胸部',
    legs: '腿部',
    back: '背部',
    arms: '手臂',
    core: '核心',
    shoulders: '肩部',
    unknow: '未知',
    hips: '臀部'
};

const musclePartMap: Record<Exclude<MusclePart, null>, string> = {
    up_chest: '上胸',
    mid_chest: '中胸',
    lower_chest: '下胸'
};

const Exercise = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        console.log('Component mounted');
        try {
            console.log('開始獲取運動資料...');
            setLoading(true);
            const { data, error } = await supabase
                .from('exercise')
                .select('*')
                .order('created_at', { ascending: false });

            console.log('Supabase 回應:', { data, error });

            if (error) {
                throw error;
            }

            if (data) {
                console.log('設置運動資料:', data);
                setExercises(data);
            } else {
                console.log('沒有獲取到資料');
                setExercises([]);
            }
        } catch (error) {
            console.error('獲取資料時發生錯誤:', error);
            setError(error instanceof Error ? error.message : '發生錯誤');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchExercises();
    }, []);

    const renderExerciseItem = ({ item }: { item: Exercise }) => (
        <View style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <View style={styles.exerciseDetails}>
                <Text style={styles.detailText}>部位：{bodyPartMap[item.body_part]}</Text>
                <Text style={styles.detailText}>
                    肌群：{item.muscle_part ? musclePartMap[item.muscle_part] : '未指定'}
                </Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>運動列表</Text>
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={fetchExercises}
                    disabled={loading}
                >
                    <Text style={styles.refreshButtonText}>刷新</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={exercises}
                renderItem={renderExerciseItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {loading ? '載入中...' : '沒有運動資料'}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 16,
        paddingHorizontal: 20,
        fontFamily: 'poppins-Bold',
    },
    listContainer: {
        padding: 20,
    },
    exerciseItem: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'poppins-Bold',
    },
    exerciseDetails: {
        gap: 4,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'poppins-Regular',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'poppins-Regular',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 16,
    },
    refreshButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 8,
    },
    refreshButtonText: {
        color: '#fff',
        fontFamily: 'poppins-Regular',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'poppins-Regular',
    },
});

export default Exercise; 