import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ContratacionCompleta, getAllContrataciones, updateContratacionStatus } from '../../src/data/repositories/ContratacionRepository';
import { format } from 'date-fns';

// Tarjeta para cada solicitud
const SolicitudCard = ({ item, onUpdate }: { item: ContratacionCompleta; onUpdate: (id: string, status: 'aprobado' | 'rechazado') => void }) => {
    const router = useRouter();

    const handleChat = () => {
        router.push(`/(advisor)/chat/${item.id}`);
    };

    const formattedDate = format(new Date(item.contracted_at), 'yyyy-MM-dd');

    const statusStyle = [
        styles.status,
        item.status === 'pendiente' && styles.statusPending,
        item.status === 'aprobado' && styles.statusApproved,
        item.status === 'rechazado' && styles.statusRejected,
    ];

    return (
        <View style={styles.card}>
            <Text style={styles.clientName}>{item.profiles?.full_name || 'Cliente'}</Text>
            <Text style={styles.planName}>{item.plans_moviles?.name || 'Plan'}</Text>
            <Text style={styles.date}>Fecha: {formattedDate}</Text>
            <Text style={statusStyle}>{item.status.toUpperCase()}</Text>

            {/* Botones de Acción */}
            <View style={styles.actions}>
                {item.status === 'pendiente' && (
                    <>
                        <Pressable style={[styles.button, styles.approveButton]} onPress={() => onUpdate(item.id, 'aprobado')}>
                            <Text style={styles.buttonText}>✓ Aprobar</Text>
                        </Pressable>
                        <Pressable style={[styles.button, styles.rejectButton]} onPress={() => onUpdate(item.id, 'rechazado')}>
                            <Text style={styles.buttonText}>X Rechazar</Text>
                        </Pressable>
                    </>
                )}
                <Pressable style={[styles.button, styles.chatButton]} onPress={handleChat}>
                    <Text style={styles.buttonText}>🗨️</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default function SolicitudesScreen() {
    const [contrataciones, setContrataciones] = useState<ContratacionCompleta[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getAllContrataciones();
            setContrataciones(data);
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: 'aprobado' | 'rechazado') => {
        try {
            await updateContratacionStatus(id, status);
            // Actualizar la lista localmente para que se refleje el cambio
            setContrataciones(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, status: status } : item
                )
            );
        } catch (err: any) {
            Alert.alert('Error', `No se pudo ${status} la solicitud.`);
        }
    };

    if (loading && contrataciones.length === 0) {
        return <ActivityIndicator style={styles.centered} size="large" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={contrataciones}
                renderItem={({ item }) => <SolicitudCard item={item} onUpdate={handleUpdateStatus} />}
                keyExtractor={(item) => item.id}
                refreshing={loading}
                onRefresh={fetchData}
            />
        </View>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, padding: 16 },
    card: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 16, elevation: 3 },
    clientName: { fontSize: 18, fontWeight: 'bold' },
    planName: { fontSize: 16, color: '#333' },
    date: { fontSize: 14, color: '#666', marginVertical: 4 },
    status: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, overflow: 'hidden', color: 'white', fontWeight: 'bold', alignSelf: 'flex-start', marginTop: 4 },
    statusPending: { backgroundColor: '#FFA500' },
    statusApproved: { backgroundColor: '#34C759' },
    statusRejected: { backgroundColor: '#FF3B30' },
    actions: { flexDirection: 'row', marginTop: 12, justifyContent: 'flex-start' },
    button: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, marginRight: 10 },
    buttonText: { color: 'white', fontWeight: 'bold' },
    approveButton: { backgroundColor: '#34C759' },
    rejectButton: { backgroundColor: '#FF3B30' },
    chatButton: { backgroundColor: '#007AFF' },
});