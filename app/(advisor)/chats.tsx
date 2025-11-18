import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ContratacionCompleta, getAllContrataciones } from '../../src/data/repositories/ContratacionRepository';

// Tarjeta para cada conversación
const ConversationCard = ({ item }: { item: ContratacionCompleta }) => {
    const router = useRouter();

    // OJO: La maqueta [cite: 109] muestra el "último mensaje". 
    // Esto requeriría una consulta SQL más compleja (bonus).
    // Por ahora, listamos la conversación.

    return (
        <Pressable style={styles.card} onPress={() => router.push(`/(advisor)/chat/${item.id}`)}>
            <Text style={styles.clientName}>{item.profiles?.full_name || 'Cliente'}</Text>
            <Text style={styles.planName}>Chat sobre: {item.plans_moviles?.name || 'Plan'}</Text>
            {/* <Text style={styles.lastMessage}>Último mensaje aquí...</Text> */}
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
            const data = await getAllContrataciones(); // Reutilizamos la función
            setConversations(data);
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator style={styles.centered} size="large" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={conversations}
                renderItem={({ item }) => <ConversationCard item={item} />}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, padding: 16 },
    card: { backgroundColor: 'white', padding: 20, borderRadius: 8, marginBottom: 16, elevation: 3 },
    clientName: { fontSize: 18, fontWeight: 'bold' },
    planName: { fontSize: 16, color: '#555', marginTop: 4 },
    // lastMessage: { fontSize: 14, color: '#888', marginTop: 8, fontStyle: 'italic' },
});