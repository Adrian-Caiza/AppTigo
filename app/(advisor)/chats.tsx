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
import { ContratacionCompleta, getAllContrataciones } from '../../src/data/repositories/ContratacionRepository';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// Tarjeta para cada conversación
const ConversationCard = ({ item }: { item: ContratacionCompleta }) => {
    const router = useRouter();

    // Formateo de fecha
    const formattedDate = format(new Date(item.contracted_at), 'dd/MM/yyyy');

    // Obtener inicial del cliente
    const clientInitial = item.profiles?.full_name ? item.profiles.full_name[0].toUpperCase() : '?';

    return (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => router.push(`/(advisor)/chat/${item.id}`)}
        >
            {/* Avatar del Cliente */}
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{clientInitial}</Text>
            </View>

            {/* Información Central */}
            <View style={styles.infoContainer}>
                <View style={styles.topRow}>
                    <Text style={styles.clientName} numberOfLines={1}>
                        {item.profiles?.full_name || 'Cliente Desconocido'}
                    </Text>
                    <Text style={styles.dateText}>{formattedDate}</Text>
                </View>

                <View style={styles.bottomRow}>
                    <FontAwesome5 name="mobile-alt" size={12} color="#888" style={{ marginRight: 6 }} />
                    <Text style={styles.planName} numberOfLines={1}>
                        {item.plans_moviles?.name || 'Plan'}
                    </Text>
                </View>
            </View>

            {/* Flecha */}
            <FontAwesome5 name="chevron-right" size={14} color="#CCC" style={{ marginLeft: 10 }} />
        </Pressable>
    );
};

export default function ChatListScreen() {
    const [conversations, setConversations] = useState<ContratacionCompleta[]>([]);
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
            setConversations(data);
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

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

                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Mensajes</Text>
                        <Text style={styles.subtitle}>Conversaciones con clientes</Text>
                    </View>

                    {conversations.length === 0 ? (
                        <View style={styles.emptyState}>
                            <FontAwesome5 name="comments" size={60} color="rgba(255,255,255,0.3)" />
                            <Text style={styles.emptyText}>No hay conversaciones activas.</Text>
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
        padding: 15,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },

    // Avatar
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2E0249', // Púrpura oscuro para contraste
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: '#FFD700', // Letra dorada
        fontSize: 20,
        fontWeight: 'bold',
    },

    // Info Area
    infoContainer: { flex: 1 },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    clientName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        marginLeft: 8
    },
    planName: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic'
    },
});