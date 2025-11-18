import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    Alert,
    StatusBar
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ContratacionCompleta, getAllContrataciones, updateContratacionStatus } from '../../src/data/repositories/ContratacionRepository';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// Tarjeta para cada solicitud
const SolicitudCard = ({ item, onUpdate }: { item: ContratacionCompleta; onUpdate: (id: string, status: 'aprobado' | 'rechazado') => void }) => {
    const router = useRouter();

    const handleChat = () => {
        router.push(`/(advisor)/chat/${item.id}`);
    };

    const formattedDate = format(new Date(item.contracted_at), 'yyyy-MM-dd');

    // Colores y Texto según estado
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aprobado': return '#34C759'; // Verde
            case 'rechazado': return '#FF3B30'; // Rojo
            default: return '#FFA500'; // Naranja
        }
    };

    return (
        <View style={styles.card}>
            {/* Cabecera de la tarjeta */}
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                            {item.profiles?.full_name ? item.profiles.full_name[0].toUpperCase() : '?'}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.clientName}>{item.profiles?.full_name || 'Cliente Desconocido'}</Text>
                        <Text style={styles.date}>{formattedDate}</Text>
                    </View>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Detalles del Plan */}
            <Text style={styles.planLabel}>Solicita:</Text>
            <Text style={styles.planName}>{item.plans_moviles?.name || 'Plan no disponible'}</Text>

            {/* Botones de Acción */}
            <View style={styles.actionsContainer}>

                {/* Botón de Chat (Siempre visible) */}
                <Pressable style={[styles.actionButton, styles.chatButton]} onPress={handleChat}>
                    <FontAwesome5 name="comments" size={16} color="white" style={{ marginRight: 6 }} />
                    <Text style={styles.actionText}>Chat</Text>
                </Pressable>

                {/* Botones de Gestión (Solo si está pendiente) */}
                {item.status === 'pendiente' && (
                    <View style={styles.decisionButtons}>
                        <Pressable
                            style={[styles.actionButton, styles.rejectButton]}
                            onPress={() => onUpdate(item.id, 'rechazado')}
                        >
                            <FontAwesome5 name="times" size={16} color="white" />
                        </Pressable>

                        <Pressable
                            style={[styles.actionButton, styles.approveButton]}
                            onPress={() => onUpdate(item.id, 'aprobado')}
                        >
                            <FontAwesome5 name="check" size={16} color="white" style={{ marginRight: 6 }} />
                            <Text style={styles.actionText}>Aprobar</Text>
                        </Pressable>
                    </View>
                )}
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
            // Actualización optimista local
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
                        <Text style={styles.title}>Solicitudes</Text>
                        <Text style={styles.subtitle}>Revisa y aprueba contrataciones</Text>
                    </View>

                    {contrataciones.length === 0 ? (
                        <View style={styles.emptyState}>
                            <FontAwesome5 name="check-circle" size={60} color="rgba(255,255,255,0.3)" />
                            <Text style={styles.emptyText}>No hay solicitudes pendientes.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={contrataciones}
                            renderItem={({ item }) => <SolicitudCard item={item} onUpdate={handleUpdateStatus} />}
                            keyExtractor={(item) => item.id}
                            refreshing={loading}
                            onRefresh={fetchData}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    background: { flex: 1 },
    safeArea: { flex: 1 },
    container: { flex: 1, paddingHorizontal: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // Header
    headerContainer: { marginTop: 10, marginBottom: 20 },
    title: { fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },

    // Empty State
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#FFF', fontSize: 16, marginTop: 20 },

    // List
    listContent: { paddingBottom: 40 },

    // Card Styles
    card: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarText: { fontSize: 18, fontWeight: 'bold', color: '#555' },
    clientName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    date: { fontSize: 12, color: '#888' },

    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12
    },
    statusText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },

    planLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
    planName: { fontSize: 18, fontWeight: 'bold', color: '#007AFF', marginBottom: 15 },

    // Buttons
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    decisionButtons: {
        flexDirection: 'row',
        gap: 10
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        elevation: 2
    },
    chatButton: { backgroundColor: '#007AFF' },
    approveButton: { backgroundColor: '#34C759' },
    rejectButton: { backgroundColor: '#FF3B30', paddingHorizontal: 12 },
    actionText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});