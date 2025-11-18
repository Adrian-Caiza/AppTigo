import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Image,
    StatusBar
} from 'react-native';
import { Plan } from '../../src/domain/entities/Plan';
import { deletePlan, getAllPlans } from '../../src/data/repositories/PlanRepository';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// Tarjeta de Plan para el Asesor
const AdvisorPlanCard = ({ plan, onDelete }: { plan: Plan; onDelete: (id: string) => void }) => {
    const router = useRouter();

    const handleDelete = () => {
        Alert.alert(
            'Confirmar Eliminación',
            `¿Estás seguro de que quieres eliminar el "${plan.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(plan.id) },
            ]
        );
    };

    const handleEdit = () => {
        router.push({ pathname: '/(advisor)/form', params: { id: plan.id } });
    };

    return (
        <View style={styles.card}>
            {/* Imagen del Plan */}
            {plan.image_url ? (
                <Image
                    source={{ uri: plan.image_url }}
                    style={styles.planImage}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.planImage, styles.placeholderImage]}>
                    <FontAwesome5 name="image" size={40} color="#CCC" />
                </View>
            )}

            <View style={styles.cardContent}>
                <View>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planPrice}>${plan.price}/mes</Text>
                </View>

                {/* Botones de Acción (Iconos + Texto) */}
                <View style={styles.actions}>
                    <Pressable style={[styles.actionButton, styles.editButton]} onPress={handleEdit}>
                        <FontAwesome5 name="pen" size={14} color="white" style={{ marginRight: 6 }} />
                        <Text style={styles.actionText}>Editar</Text>
                    </Pressable>

                    <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
                        <FontAwesome5 name="trash" size={14} color="white" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default function AdvisorDashboard() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            fetchPlans();
        }, [])
    );

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const data = await getAllPlans();
            setPlans(data);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlan = async (id: string) => {
        try {
            await deletePlan(id);
            Alert.alert('Éxito', 'Plan eliminado correctamente');
            setPlans(plans.filter(plan => plan.id !== id));
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    if (loading && plans.length === 0) {
        return (
            <LinearGradient colors={['#2E0249', '#570A57']} style={styles.centered}>
                <ActivityIndicator size="large" color="#FFD700" />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#2E0249', '#570A57', '#A91079']}
            style={styles.background}
        >
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                <View style={styles.container}>

                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Gestión de Planes</Text>
                        <Text style={styles.subtitle}>Administra el catálogo comercial</Text>
                    </View>

                    {/* Botón Crear Nuevo (Estilo Premium) */}
                    <Pressable
                        style={({ pressed }) => [styles.createButton, pressed && styles.createButtonPressed]}
                        onPress={() => router.push('/(advisor)/form')}
                    >
                        <FontAwesome5 name="plus" size={16} color="#2E0249" style={{ marginRight: 8 }} />
                        <Text style={styles.createButtonText}>Crear Nuevo Plan</Text>
                    </Pressable>

                    <FlatList
                        data={plans}
                        renderItem={({ item }) => <AdvisorPlanCard plan={item} onDelete={handleDeletePlan} />}
                        keyExtractor={(item) => item.id}
                        refreshing={loading}
                        onRefresh={fetchPlans}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    safeArea: { flex: 1 },
    container: { flex: 1, paddingHorizontal: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // Header
    headerContainer: { marginTop: 10, marginBottom: 20 },
    title: { fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },

    // Create Button
    createButton: {
        backgroundColor: '#FFD700',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 15,
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    createButtonPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
    createButtonText: { color: '#2E0249', fontWeight: 'bold', fontSize: 16 },

    // List
    listContent: { paddingBottom: 40 },

    // Card Styles
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden', // Para que la imagen respete el borde redondeado
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    planImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#EEE',
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0'
    },
    cardContent: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    planName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    planPrice: { fontSize: 16, color: '#007AFF', fontWeight: '600' },

    // Actions
    actions: {
        flexDirection: 'row',
        gap: 10
    },
    actionButton: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: { backgroundColor: '#007AFF' }, // Azul
    deleteButton: { backgroundColor: '#FF3B30', paddingHorizontal: 12 }, // Rojo, solo icono
    actionText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});