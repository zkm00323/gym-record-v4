import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { supabase } from '../lib/supabase';
import { Lang } from './helper/langHelper';

// 身體部位和肌肉部位的類型定義
type BodyPart = string;  // 改為動態類型
type MusclePart = string | null;  // 改為動態類型

interface Exercise {
    id: number;
    created_at: string;
    name: string;
    body_part: BodyPart;
    muscle_part: MusclePart;
}

interface EnumValues {
    body_part: string[];
    muscle_part: string[];
}

const Exercise = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [enumValues, setEnumValues] = useState<EnumValues>({
        body_part: [],
        muscle_part: []
    });

    // 獲取列舉值
    const fetchEnumValues = async () => {
        try {
            const { data, error } = await supabase
                .rpc('get_enum_values');

            if (error) throw error;

            if (data) {
                setEnumValues(data);
            }
        } catch (error) {
            console.error('獲取列舉值時發生錯誤:', error);
        }
    };

    useEffect(() => {
        const initializeApp = async () => {
            try {
                await Lang.initialize();
                await Promise.all([
                    fetchEnumValues(),
                    fetchExercises()
                ]);
            } catch (error) {
                console.error('初始化時發生錯誤:', error);
            }
        };

        initializeApp();
    }, []);

    const fetchExercises = async () => {
        try {
            console.log('開始獲取運動資料...');
            setLoading(true);

            const { data, error } = await supabase
                .from('exercise')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            if (data) {
                setExercises(data);
            } else {
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

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                Lang.reloadTranslations(),
                fetchExercises()
            ]);
        } catch (error) {
            console.error('刷新時發生錯誤:', error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    const renderExerciseItem = ({ item }: { item: Exercise }) => (
        <View style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <View style={styles.exerciseDetails}>
                <Text style={styles.detailText}>
                    {Lang.getLang('exercise.body_part_label')}：{Lang.getLang(`body_part.${item.body_part}`)}
                </Text>
                <Text style={styles.detailText}>
                    {Lang.getLang('exercise.muscle_part_label')}：{item.muscle_part ? Lang.getLang(`muscle_part.${item.muscle_part}`) : Lang.getLang('muscle_part.null')}
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
                <Text style={styles.title}>{Lang.getLang('exercise.title')}</Text>
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={fetchExercises}
                    disabled={loading}
                >
                    <Text style={styles.refreshButtonText}>{Lang.getLang('exercise.refresh')}</Text>
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
                            {loading ? Lang.getLang('exercise.loading') : Lang.getLang('exercise.no_data')}
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