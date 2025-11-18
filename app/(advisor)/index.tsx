import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Plan } from '../../src/domain/entities/Plan';
import { deletePlan, getAllPlans } from '../../src/data/repositories/PlanRepository';
import { Link, useFocusEffect } from 'expo-router';

// Tarjeta de Plan para el Asesor (con botones de acción)
const AdvisorPlanCard = ({ plan, onDelete }: { plan: Plan; onDelete: (id: string) => void }) => {

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

    return (
        <View style={styles.card}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>${plan.price}</Text>
            {/* Botones de Acción */}
            <View style={styles.actions}>
                <Link href={{ pathname: '/(advisor)/form', params: { id: plan.id } }} asChild>
                    <Pressable style={[styles.button, styles.editButton]}>
                        <Text style={styles.buttonText}>Editar</Text>
                    </Pressable>
                </Link>
                <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                    <Text style={styles.buttonText}>Eliminar</Text>
                </Pressable>
            </View>
        </View>
    );
};

// Pantalla principal del Asesor
export default function AdvisorDashboard() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    // useFocusEffect se ejecuta cada vez que la pantalla vuelve a estar visible
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
            // Opcional: si quisieras borrar la imagen de Storage,
            // primero tendrías que buscar el plan, obtener la image_url y llamar a deletePlanImage.
            await deletePlan(id);
            Alert.alert('Éxito', 'Plan eliminado correctamente');
            // Refrescar la lista
            setPlans(plans.filter(plan => plan.id !== id));
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    if (loading && plans.length === 0) {
        return <ActivityIndicator style={styles.centered} size="large" />;
    }

    return (
        <View style={styles.container}>
            <Link href="/(advisor)/form" asChild>
                <Pressable style={[styles.button, styles.createButton]}>
                    <Text style={styles.buttonText}>+ Crear Nuevo Plan</Text>
                </Pressable>
            </Link>

            <Text style={styles.title}>Planes Activos</Text>

            <FlatList
                data={plans}
                renderItem={({ item }) => <AdvisorPlanCard plan={item} onDelete={handleDeletePlan} />}
                keyExtractor={(item) => item.id}
                refreshing={loading}
                onRefresh={fetchPlans}
            />
        </View>
    );
}
// (Usar estilos similares a los del Paso 4, añadiendo los botones de acción)
const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, padding: 16 },
    title: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
    card: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 16, elevation: 3 },
    planName: { fontSize: 18, fontWeight: 'bold' },
    planPrice: { fontSize: 16, color: '#007AFF' },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
    button: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 5, marginLeft: 10 },
    buttonText: { color: 'white', fontWeight: 'bold' },
    editButton: { backgroundColor: '#007AFF' },
    deleteButton: { backgroundColor: '#FF3B30' },
    createButton: { backgroundColor: '#34C759', alignItems: 'center', padding: 12, marginBottom: 16 },
});