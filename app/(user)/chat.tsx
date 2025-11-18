import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ContratacionConPlan, getUserContrataciones } from '../../src/data/repositories/ContratacionRepository';
import { useAuth } from '../../src/presentation/context/AuthContext';
import { format } from 'date-fns';

// Componente para cada tarjeta de conversación
// Podríamos refactorizarlo a /components, pero por ahora está bien aquí.
const ConversationCard = ({ item }: { item: ContratacionConPlan }) => {
    const router = useRouter();

    // OJO: La maqueta del asesor [cite: 109] muestra el "último mensaje".
    // Implementar eso requeriría una consulta de base de datos más compleja.
    // Por ahora, listamos la conversación como un canal de chat.

    const statusStyle = [
        styles.status,
        item.status === 'pendiente' && styles.statusPending,
        item.status === 'aprobado' && styles.statusApproved,
    ];

    return (
        <Pressable style={styles.card} onPress={() => router.push(`/(user)/chat/${item.id}`)}>
            <View>
                <Text style={styles.planName}>
                    Chat sobre: {item.plans_moviles?.name || 'Plan'}
                </Text>
                <Text style={styles.date}>
                    Iniciado el: {format(new Date(item.contracted_at), 'yyyy-MM-dd')}
                </Text>
            </View>
            <Text style={statusStyle}>{item.status.toUpperCase()}</Text>
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
                getUserContrataciones(user.id) // Usamos la función del repositorio
                    .then(setConversations)
                    .catch(err => Alert.alert('Error', err.message))
                    .finally(() => setLoading(false));
            }
        }, [user])
    );

    if (loading) {
        return <ActivityIndicator style={styles.centered} size="large" />;
    }

    if (conversations.length === 0) {
        return <Text style={styles.centered}>Aún no tienes conversaciones.{"\n"}Contrata un plan para iniciar un chat.</Text>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={conversations}
                renderItem={({ item }) => <ConversationCard item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingTop: 10 }}
            />
        </View>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#F5F5F5'
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        marginBottom: 16,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    planName: {
        fontSize: 16,
        fontWeight: 'bold',
        maxWidth: '90%' // Evita que el texto largo empuje el estado
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    status: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        overflow: 'hidden',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    statusPending: { backgroundColor: '#FFA500' }, // Naranja
    statusApproved: { backgroundColor: '#34C759' }, // Verde
});