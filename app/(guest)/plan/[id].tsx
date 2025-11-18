import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getPlanById } from '../../../src/data/repositories/PlanRepository';
import { Plan } from '../../../src/domain/entities/Plan';

export default function GuestPlanDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [plan, setPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getPlanById(id)
                .then(setPlan)
                .catch(err => Alert.alert('Error', 'No se pudo cargar el plan.'))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleGoToLogin = () => {
        Alert.alert(
            'Función Requerida',
            'Debes iniciar sesión o registrarte para contratar este plan.',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Iniciar Sesión', onPress: () => router.push('/(guest)/login') }
            ]
        );
    };

    if (loading) {
        return <ActivityIndicator style={styles.centered} size="large" />;
    }
    if (!plan) {
        return <Text style={styles.centered}>Plan no encontrado.</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            {/* <Image source={{ uri: plan.image_url }} style={styles.image} /> */}
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>${plan.price}/mes</Text>
            <Text style={styles.planPromo}>{plan.promotion_details}</Text>

            <Text style={styles.details}>Datos: {plan.data_gb ? `${plan.data_gb} GB` : 'Ilimitado'}</Text>
            <Text style={styles.details}>Minutos: {plan.minutes ? `${plan.minutes} min` : 'Ilimitado'}</Text>
            <Text style={styles.details}>WhatsApp: {plan.whatsapp_details}</Text>
            <Text style={styles.details}>Redes Sociales: {plan.social_media_details}</Text>

            <Pressable style={styles.button} onPress={handleGoToLogin}>
                <Text style={styles.buttonText}>Contratar Plan</Text>
            </Pressable>
        </ScrollView>
    );
}

// (Reutiliza los estilos de 'app/(user)/plan/[id].tsx')
const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, padding: 16, backgroundColor: 'white' },
    image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 16 },
    planName: { fontSize: 26, fontWeight: 'bold' },
    planPrice: { fontSize: 22, color: '#007AFF', marginVertical: 8 },
    planPromo: { fontSize: 16, color: 'green', fontStyle: 'italic', marginBottom: 16 },
    details: { fontSize: 16, marginBottom: 8 },
    button: { marginTop: 24, backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});