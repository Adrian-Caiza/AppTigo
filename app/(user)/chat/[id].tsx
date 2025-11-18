import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../src/presentation/context/AuthContext';
import { getMessages, sendMessage, subscribeToChat, unsubscribeFromChat, ChatMessage } from '../../../src/data/repositories/ChatRepository';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../../../src/lib/supabase';

export default function ChatScreen() {
    const { id: contratacionId } = useLocalSearchParams<{ id: string }>();
    const { user, profile } = useAuth(); // Nuestro usuario actual

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const channelRef = useRef<RealtimeChannel | null>(null);
    const flatListRef = useRef<FlatList>(null);

    // Cargar mensajes iniciales
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const initialMessages = await getMessages(contratacionId);
                setMessages(initialMessages);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [contratacionId]);

    // Suscribirse a Realtime
    useEffect(() => {
        // Definir el handler para nuevos mensajes
        const handleNewMessage = (payload: any) => {
            // Necesitamos cargar el perfil del remitente
            const fetchMessageWithProfile = async (messageId: number) => {
                const { data } = await supabase.from('mensajes_chat')
                    .select('*, profiles(full_name)')
                    .eq('id', messageId)
                    .single();
                if (data) {
                    setMessages(currentMessages => [...currentMessages, data as ChatMessage]);
                }
            };

            fetchMessageWithProfile(payload.new.id);
        };

        const channel = subscribeToChat(contratacionId, handleNewMessage);
        channelRef.current = channel;

        // Limpieza al desmontar el componente
        return () => {
            if (channelRef.current) {
                unsubscribeFromChat(channelRef.current);
            }
        };
    }, [contratacionId]);

    // Scroll al final cuando llegan mensajes
    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSend = async () => {
        if (newMessage.trim().length === 0 || !user) return;

        try {
            const messageText = newMessage;
            setNewMessage(''); // Limpiar el input inmediatamente
            await sendMessage(contratacionId, user.id, messageText);
        } catch (error: any) {
            console.error('Error al enviar:', error.message);
            // Opcional: Poner el mensaje de vuelta en el input si falla
            setNewMessage(newMessage);
        }
    };

    if (loading) {
        return <ActivityIndicator style={styles.centered} size="large" />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={90} // Ajusta este valor según tu header
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <MessageBubble
                        message={item}
                        isCurrentUser={item.sender_id === user?.id}
                        currentUserRole={profile?.role}
                    />
                )}
                style={styles.chatArea}
            />

            {/* Input de Mensaje */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Escribe un mensaje..."
                />
                <Pressable style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>Enviar</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

// Componente de Burbuja de Mensaje
const MessageBubble = ({ message, isCurrentUser, currentUserRole }: { message: ChatMessage; isCurrentUser: boolean; currentUserRole?: 'usuario_registrado' | 'asesor_comercial'; }) => {
    // 1. Determina cuál debe ser el nombre por defecto.
    const defaultName = currentUserRole === 'usuario_registrado' ? 'Asesor' : 'Cliente';
    // 2. Intenta usar el nombre real (ej. "Juan Pérez"), si falla, usa el por defecto.
    const displayName = message.profiles?.full_name || defaultName;
    return (
        <View
            style={[
                styles.messageContainer,
                isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
            ]}
        >
            {!isCurrentUser && (
                <Text style={styles.senderName}>
                    {/* Esto es el nombre del usuario cuando el asesor está viendo el chat */}
                    {displayName}
                </Text>
            )}

            {/* --- INICIO DE LA CORRECCIÓN --- */}
            <Text style={[
                styles.messageText,
                isCurrentUser && styles.currentUserMessageText // Aplica el color blanco si es el usuario actual
            ]}>
                {message.message}
            </Text>
            {/* --- FIN DE LA CORRECCIÓN --- */}

            <Text style={[
                styles.messageTime,
                isCurrentUser && styles.currentUserMessageTime // Pequeña mejora para la hora
            ]}>
                {new Date(message.created_at).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );
};

// --- Estilos del Chat ---
const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#F0F0F0' },
    chatArea: { flex: 1, paddingHorizontal: 10, paddingTop: 10 },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderColor: '#CCC',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'white',
    },
    sendButton: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 20,
        paddingHorizontal: 15,
    },
    sendButtonText: { color: 'white', fontWeight: 'bold' },
    messageContainer: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    currentUserMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
    },
    otherUserMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E5E5EA',
    },
    senderName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 2,
    },
    messageText: {
        fontSize: 16,
        color: 'black', // Ajuste para que el texto sea negro en el fondo claro
    },

    currentUserMessageText: { // Opcional si quieres texto blanco
        color: 'white',
    },
    messageTime: {
        fontSize: 10,
        color: '#888',
        alignSelf: 'flex-end',
        marginTop: 2,
    },
    currentUserMessageTime: { // <-- AÑADIR ESTE ESTILO (Opcional, pero recomendado)
    color: '#E0E0E0', // Un color más claro para la burbuja azul
    },
});