import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getPlanById } from '../../../src/data/repositories/PlanRepository';
import { createContratacion } from '../../../src/data/repositories/ContratacionRepository';
import { Plan } from '../../../src/domain/entities/Plan';
import { useAuth } from '../../../src/presentation/context/AuthContext'; // Importamos el hook de Auth

export default function PlanDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth(); // Obtenemos el usuario de nuestro contexto

    const [plan, setPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(true);
    const [hireLoading, setHireLoading] = useState(false);

    useEffect(() => {
        if (id) {
            getPlanById(id)
                .then(setPlan)
                .catch(err => Alert.alert('Error', 'No se pudo cargar el plan.'))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleHirePlan = async () => {
        if (!user || !plan) return;

        setHireLoading(true);
        try {
            await createContratacion(plan.id, user.id);
            Alert.alert(
                '¡Solicitud Enviada!',
                'Tu solicitud de contratación ha sido enviada. Un asesor la revisará pronto.',
                [
                    // Navegamos a la pestaña "Mis Planes"
                    { text: 'OK', onPress: () => router.push('/(user)/plans') }
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo procesar la solicitud.');
        } finally {
            setHireLoading(false);
        }
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

            {/* Aquí iría el resto de detalles (minutos, gigas, etc.) */}
            <Text style={styles.details}>Datos: {plan.data_gb ? `${plan.data_gb} GB` : 'Ilimitado'}</Text>
            <Text style={styles.details}>Minutos: {plan.minutes ? `${plan.minutes} min` : 'Ilimitado'}</Text>
            <Text style={styles.details}>WhatsApp: {plan.whatsapp_details}</Text>
            <Text style={styles.details}>Redes Sociales: {plan.social_media_details}</Text>

            <Pressable
                style={[styles.button, hireLoading && styles.buttonDisabled]}
                onPress={handleHirePlan}
                disabled={hireLoading}
            >
                <Text style={styles.buttonText}>
                    {hireLoading ? 'Procesando...' : 'Contratar Plan'}
                </Text>
            </Pressable>
        </ScrollView>
    );
}

// (Reutiliza y adapta los estilos, añade 'ScrollView')
import { ScrollView } from 'react-native-gesture-handler'; // Asegúrate de instalarlo

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, padding: 16, backgroundColor: 'white' },
    image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 16 },
    planName: { fontSize: 26, fontWeight: 'bold' },
    planPrice: { fontSize: 22, color: '#007AFF', marginVertical: 8 },
    planPromo: { fontSize: 16, color: 'green', fontStyle: 'italic', marginBottom: 16 },
    details: { fontSize: 16, marginBottom: 8 },
    button: { marginTop: 24, backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
    buttonDisabled: { backgroundColor: '#A9A9A9' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});