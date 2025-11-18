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

// Componente para cada tarjeta de conversación (Estilizado)
const ConversationCard = ({ item }: { item: ContratacionConPlan }) => {
    const router = useRouter();

    // Colores dinámicos para el estado
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aprobado': return '#34C759'; // Verde
            case 'rechazado': return '#FF3B30'; // Rojo
            default: return '#FFA500'; // Naranja/Dorado
        }
    };

    const formattedDate = format(new Date(item.contracted_at), 'yyyy-MM-dd');

    return (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => router.push(`/(user)/chat/${item.id}`)}
        >
            <View style={styles.cardContent}>

                {/* Icono de Chat */}
                <View style={styles.iconContainer}>
                    <FontAwesome5 name="comments" size={24} color="#007AFF" />
                </View>

                {/* Información Principal */}
                <View style={styles.infoContainer}>
                    <Text style={styles.planName} numberOfLines={1}>
                        {item.plans_moviles?.name || 'Plan Desconocido'}
                    </Text>
                    <Text style={styles.dateText}>Iniciado: {formattedDate}</Text>

                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                    </View>
                </View>

                {/* Flecha de navegación */}
                <FontAwesome5 name="chevron-right" size={16} color="#CCC" />

            </View>
        </Pressable>
    );
};

export default function UserChatListScreen() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ContratacionConPlan[]>([]);
    const [loading, setLoading] = useState(true);

    // useFocusEffect para recargar cada vez que volvemos a esta pestaña
    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                setLoading(true);
                getUserContrataciones(user.id)
                    .then(setConversations)
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

                    {/* --- HEADER --- */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Mis Conversaciones</Text>
                        <Text style={styles.subtitle}>Contacta con tus asesores</Text>
                    </View>

                    {conversations.length === 0 ? (
                        <View style={styles.emptyState}>
                            <FontAwesome5 name="comment-slash" size={60} color="rgba(255,255,255,0.3)" />
                            <Text style={styles.emptyText}>No tienes chats activos.</Text>
                            <Text style={styles.emptySubText}>Contrata un plan para iniciar uno.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={conversations}
                            renderItem={({ item }) => <ConversationCard item={item} />}
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

// --- Estilos ---
const styles = StyleSheet.create({
    background: { flex: 1 },
    safeArea: { flex: 1 },
    container: { flex: 1, paddingHorizontal: 20 },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

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
    listContent: { paddingTop: 10, paddingBottom: 40 },

    // Card Styles
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden' // Para el efecto de pulsación
    },
    cardPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.99 }]
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F8FF', // Azul muy claro
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    planName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4
    },
    dateText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 8,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    statusText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});