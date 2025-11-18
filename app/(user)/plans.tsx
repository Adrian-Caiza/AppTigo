import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ContratacionConPlan, getUserContrataciones } from '../../src/data/repositories/ContratacionRepository';
import { useAuth } from '../../src/presentation/context/AuthContext';
import { format } from 'date-fns'; // 'npm install date-fns' para formatear la fecha

// Tarjeta para cada contratación
const ContratacionCard = ({ item }: { item: ContratacionConPlan }) => {
    const router = useRouter();

    const handleChat = () => {
        // Navegamos al chat, pasando el ID de la contratación
        // (Implementaremos esto en el Paso 7)
        router.push(`/(user)/chat/${item.id}`);
    };

    // Formatear la fecha '2024-11-10T...' a '2024-11-10'
    const formattedDate = format(new Date(item.contracted_at), 'yyyy-MM-dd');

    // Estilo dinámico para el estado
    const statusStyle = [
        styles.status,
        item.status === 'pendiente' && styles.statusPending,
        item.status === 'aprobado' && styles.statusApproved,
    ];

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.planName}>{item.plans_moviles?.name ?? 'Plan no disponible'}</Text>
                <Text style={statusStyle}>{item.status.toUpperCase()}</Text>
            </View>
            <Text style={styles.date}>Fecha: {formattedDate}</Text>

            <Pressable style={styles.chatButton} onPress={handleChat}>
                <Text style={styles.chatButtonText}>Chat con Asesor</Text>
            </Pressable>
        </View>
    );
};

export default function MisContratacionesScreen() {
    const { user } = useAuth();
    const [contrataciones, setContrataciones] = useState<ContratacionConPlan[]>([]);
    const [loading, setLoading] = useState(true);

    // useFocusEffect para recargar cada vez que volvemos a esta pestaña
    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                setLoading(true);
                getUserContrataciones(user.id)
                    .then(setContrataciones)
                    .catch(err => Alert.alert('Error', err.message))
                    .finally(() => setLoading(false));
            }
        }, [user])
    );

    if (loading) {
        return <ActivityIndicator style={styles.centered} size="large" />;
    }

    if (contrataciones.length === 0) {
        return <Text style={styles.centered}>Aún no has contratado ningún plan.</Text>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={contrataciones}
                renderItem={({ item }) => <ContratacionCard item={item} />}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, padding: 16 },
    card: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 16, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    planName: { fontSize: 18, fontWeight: 'bold' },
    status: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, overflow: 'hidden', color: 'white', fontWeight: 'bold' },
    statusPending: { backgroundColor: '#FFA500' }, // Naranja
    statusApproved: { backgroundColor: '#34C759' }, // Verde
    date: { fontSize: 14, color: '#666', marginVertical: 8 },
    chatButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 5, alignItems: 'center' },
    chatButtonText: { color: 'white', fontWeight: 'bold' },
});