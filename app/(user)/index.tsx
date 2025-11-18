import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { getActivePlans } from '../../src/data/repositories/PlanRepository';
import { Plan } from '../../src/domain/entities/Plan';
import PlanCard from '../../src/presentation/components/PlanCard'; // Reutilizamos el mismo PlanCard


export default function UserHomeScreen() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await getActivePlans();
                setPlans(data);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    if (loading) {
        return <ActivityIndicator style={styles.centered} size="large" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nuevos Planes Tigo</Text>
            <FlatList
                data={plans}
                // 3. ACTUALIZAR el renderItem
                renderItem={({ item }) => (
                    <PlanCard
                        plan={item}
                        href={`/(user)/plan/${item.id}`} // Ruta de Usuario
                        buttonText="Ver Detalles y Contratar"
                    />
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

// 4. ELIMINAR los estilos de 'UserPlanCard' de aquí (card, planName, etc.)
// Dejar solo los estilos que usa esta pantalla (centered, container, title)
const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});