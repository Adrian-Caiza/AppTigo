import { supabase } from '../../lib/supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Definimos el tipo de un mensaje
export interface ChatMessage {
    id: number;
    contratacion_id: string;
    sender_id: string;
    message: string;
    created_at: string;
    // Opcional: podemos traer los datos del perfil del remitente
    profiles?: { full_name: string };
}

// 1. Obtener los mensajes iniciales de un chat
export const getMessages = async (contratacionId: string): Promise<ChatMessage[]> => {
    const { data, error } = await supabase
        .from('mensajes_chat')
        .select(`
      *,
      profiles ( full_name )
    `)
        .eq('contratacion_id', contratacionId)
        .order('created_at', { ascending: true }); // Cargar los más antiguos primero

    if (error) {
        console.error('Error fetching messages:', error.message);
        throw error;
    }
    return data as ChatMessage[];
};

// 2. Enviar un nuevo mensaje
export const sendMessage = async (contratacionId: string, senderId: string, message: string) => {
    const { data, error } = await supabase
        .from('mensajes_chat')
        .insert({
            contratacion_id: contratacionId,
            sender_id: senderId,
            message: message,
        });

    if (error) {
        console.error('Error sending message:', error.message);
        throw error;
    }
    return data;
};

// 3. Suscribirse a nuevos mensajes (Realtime)
export const subscribeToChat = (
    contratacionId: string,
    onNewMessage: (payload: RealtimePostgresChangesPayload<ChatMessage>) => void
): RealtimeChannel => {

    const channel = supabase.channel(`chat:${contratacionId}`)
        .on<ChatMessage>(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'mensajes_chat',
                filter: `contratacion_id=eq.${contratacionId}` // Escuchar solo este chat
            },
            (payload) => onNewMessage(payload as RealtimePostgresChangesPayload<ChatMessage>)
        )
        .subscribe();

    return channel;
};

// 4. Darse de baja del canal
export const unsubscribeFromChat = (channel: RealtimeChannel) => {
    supabase.removeChannel(channel);
};