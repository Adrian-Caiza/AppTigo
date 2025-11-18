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
import { ContratacionConPlan, getUserContrataciones } from '../../src/data/repositories/ContratacionRepository';
import { useAuth } from '../../src/presentation/context/AuthContext';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// Tarjeta para cada contratación (Estilizada)
const ContratacionCard = ({ item }: { item: ContratacionConPlan }) => {
    const router = useRouter();

    const handleChat = () => {
        router.push(`/(user)/chat/${item.id}`);
    };

    const formattedDate = format(new Date(item.contracted_at), 'yyyy-MM-dd');

    // Colores dinámicos para el estado
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aprobado': return '#34C759'; // Verde
            case 'rechazado': return '#FF3B30'; // Rojo
            default: return '#FFA500'; // Naranja/Dorado (Pendiente)
        }
    };

    return (
        <View style={styles.card}>
            {/* Encabezado de la tarjeta: Nombre y Estado */}
            <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                    <FontAwesome5 name="mobile-alt" size={18} color="#555" style={{ marginRight: 8 }} />
                    <Text style={styles.planName}>{item.plans_moviles?.name ?? 'Plan Desconocido'}</Text>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>

            {/* Cuerpo: Fecha */}
            <Text style={styles.dateText}>Solicitado el: {formattedDate}</Text>

            {/* Separador visual */}
            <View style={styles.divider} />

            {/* Botón de Acción: Chat */}
            <Pressable
                style={({ pressed }) => [styles.chatButton, pressed && styles.chatButtonPressed]}
                onPress={handleChat}
            >
                <FontAwesome5 name="comments" size={16} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.chatButtonText}>Chat con Asesor</Text>
            </Pressable>
        </View>
    );
};

export default function MisContratacionesScreen() {
    const { user } = useAuth();
    const [contrataciones, setContrataciones] = useState<ContratacionConPlan[]>([]);
    const [loading, setLoading] = useState(true);

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

                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Mis Contrataciones</Text>
                        <Text style={styles.subtitle}>Gestiona tus planes y contacta soporte</Text>
                    </View>

                    {contrataciones.length === 0 ? (
                        <View style={styles.emptyState}>
                            <FontAwesome5 name="clipboard-list" size={60} color="rgba(255,255,255,0.3)" />
                            <Text style={styles.emptyText}>Aún no has contratado ningún plan.</Text>
                            <Text style={styles.emptySubText}>Ve al inicio para explorar opciones.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={contrataciones}
                            renderItem={({ item }) => <ContratacionCard item={item} />}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}

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
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5
    },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },

    // Empty State
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 20 },
    emptySubText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 5 },

    // List
    listContent: { paddingBottom: 40 },

    // Card Styles
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
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
        alignItems: 'flex-start',
        marginBottom: 8
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10
    },
    planName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flexShrink: 1
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignItems: 'center'
    },
    statusText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold'
    },
    dateText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 15,
        marginLeft: 26 // Alineado con el texto del título (icono + margen)
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 15,
    },
    chatButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    chatButtonPressed: {
        opacity: 0.8
    },
    chatButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    },
});