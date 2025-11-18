import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useAuth } from '../../src/presentation/context/AuthContext';
import { signOut } from '../../src/data/repositories/AuthRepository';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { user, profile } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            // El AuthContext y el _layout.tsx se encargarán de
            // redirigir automáticamente al (guest) layout.
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Avatar (como en la maqueta ) */}
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
                </Text>
            </View>
            <Text style={styles.name}>{profile?.full_name || 'Usuario'}</Text>
            <Text style={styles.email}>{user?.email || 'email@ejemplo.com'}</Text>

            {/* Tarjeta de Información */}
            <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{profile?.phone || 'No registrado'}</Text>
            </View>

            {/* Botones de Acción */}
            <Pressable style={[styles.button, styles.editButton]}>
                <Text style={styles.buttonText}>Editar Perfil</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.logoutButton]} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </Pressable>
        </View>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#F5F5F5' },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    avatarText: { color: 'white', fontSize: 40, fontWeight: 'bold' },
    name: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
    email: { fontSize: 16, color: '#888', marginBottom: 24 },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        width: '100%',
        marginBottom: 12,
    },
    infoLabel: { fontSize: 12, color: '#888' },
    infoValue: { fontSize: 16, fontWeight: '500' },
    button: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    editButton: { backgroundColor: '#007AFF' },
    logoutButton: { backgroundColor: '#FF3B30' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});