import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StatusBar
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../src/presentation/context/AuthContext';
import { getMessages, sendMessage, subscribeToChat, unsubscribeFromChat, ChatMessage } from '../../../src/data/repositories/ChatRepository';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../../../src/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ChatScreen() {
    const { id: contratacionId } = useLocalSearchParams<{ id: string }>();
    const { user, profile } = useAuth();

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const channelRef = useRef<RealtimeChannel | null>(null);
    const flatListRef = useRef<FlatList>(null);

    // ... (Tus useEffects de carga y suscripción se mantienen igual) ...
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
        const handleNewMessage = (payload: any) => {
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

        return () => {
            if (channelRef.current) {
                unsubscribeFromChat(channelRef.current);
            }
        };
    }, [contratacionId]);

    // Scroll al final
    useEffect(() => {
        if (flatListRef.current) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const handleSend = async () => {
        if (newMessage.trim().length === 0 || !user) return;

        try {
            const messageText = newMessage;
            setNewMessage('');
            await sendMessage(contratacionId, user.id, messageText);
        } catch (error: any) {
            console.error('Error al enviar:', error.message);
            setNewMessage(newMessage);
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

            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
                <KeyboardAvoidingView
                    // Usamos 'padding' en iOS y 'height' en Android para mejor compatibilidad
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    // Ajustamos el offset. 100 suele cubrir el Header + StatusBar
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 100}
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
                        contentContainerStyle={styles.chatContent}
                        showsVerticalScrollIndicator={false}
                        // Esto ayuda a mantener la posición del scroll cuando aparece el teclado
                        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
                    />

                    {/* Área de Input */}
                    <View style={styles.inputWrapper}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={newMessage}
                                onChangeText={setNewMessage}
                                placeholder="Escribe un mensaje..."
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                multiline
                            />
                            <Pressable
                                style={({ pressed }) => [styles.sendButton, pressed && styles.sendButtonPressed]}
                                onPress={handleSend}
                            >
                                <FontAwesome5 name="paper-plane" size={18} color="#2E0249" />
                            </Pressable>
                        </View>
                    </View>

                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

// ... (El componente MessageBubble y los estilos se mantienen igual que en la respuesta anterior)
// ...

// Solo asegúrate de que MessageBubble y styles estén aquí abajo como antes
const MessageBubble = ({ message, isCurrentUser, currentUserRole }: { message: ChatMessage; isCurrentUser: boolean; currentUserRole?: 'usuario_registrado' | 'asesor_comercial'; }) => {
    const defaultName = currentUserRole === 'usuario_registrado' ? 'Asesor' : 'Cliente';
    const displayName = message.profiles?.full_name || defaultName;

    return (
        <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble]}>
            {!isCurrentUser && <Text style={styles.senderName}>{displayName}</Text>}
            <Text style={[styles.messageText, isCurrentUser ? styles.currentUserText : styles.otherUserText]}>{message.message}</Text>
            <Text style={[styles.timeText, isCurrentUser ? styles.currentUserTime : styles.otherUserTime]}>
                {new Date(message.created_at).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1 },
    safeArea: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    chatContent: { paddingHorizontal: 15, paddingTop: 20, paddingBottom: 10 },
    inputWrapper: { padding: 15,marginBottom: 0, backgroundColor: 'rgba(20, 0, 35, 0.6)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    input: { flex: 1, color: '#FFF', fontSize: 16, maxHeight: 100, paddingTop: 8, paddingBottom: 8 },
    sendButton: { width: 40, height: 40, backgroundColor: '#FFD700', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10, elevation: 3 },
    sendButtonPressed: { opacity: 0.8, transform: [{ scale: 0.95 }] },
    messageContainer: { maxWidth: '80%', padding: 12, borderRadius: 20, marginBottom: 12 },
    currentUserBubble: { alignSelf: 'flex-end', backgroundColor: '#FFD700', borderBottomRightRadius: 2, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, elevation: 2 },
    currentUserText: { color: '#2E0249', fontSize: 16 },
    currentUserTime: { color: 'rgba(46, 2, 73, 0.6)' },
    otherUserBubble: { alignSelf: 'flex-start', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
    otherUserText: { color: '#FFF', fontSize: 16 },
    otherUserTime: { color: 'rgba(255, 255, 255, 0.5)' },
    senderName: { fontSize: 12, fontWeight: 'bold', color: '#FFD700', marginBottom: 4, marginLeft: 2 },
    messageText: { lineHeight: 22 },
    timeText: { fontSize: 10, alignSelf: 'flex-end', marginTop: 4 },
});