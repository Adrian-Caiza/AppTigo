import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido a Tigo</Text>
            <Text style={styles.subtitle}>Descubre nuestros planes móviles</Text>

            <View style={styles.buttonContainer}>
                {/* Botón para explorar como invitado */}
                <Link href="/(guest)/catalog" asChild>
                    <Pressable style={[styles.button, styles.primaryButton]}>
                        <Text style={styles.primaryButtonText}>Explorar como Invitado</Text>
                    </Pressable>
                </Link>

                {/* "Botón" para Iniciar Sesión (estilo de enlace) */}
                <Link href="/(guest)/login" asChild>
                    <Pressable style={styles.linkButton}>
                        <Text style={styles.linkButtonText}>Iniciar Sesión</Text>
                    </Pressable>
                </Link>

                {/* Botón para Registrarse */}
                <Link href="/(guest)/register" asChild>
                    <Pressable style={[styles.button, styles.secondaryButton]}>
                        <Text style={styles.secondaryButtonText}>Registrarse</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}

// --- Estilos (basados en la maqueta ) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'white', // Asumiendo fondo blanco
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0033A0', // Azul Tigo
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#555',
        marginBottom: 48,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        width: '100%',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    primaryButton: {
        backgroundColor: '#007AFF', // Azul primario
    },
    primaryButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    secondaryButton: {
        backgroundColor: '#EFEFEF', // Gris claro
    },
    secondaryButtonText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
    },
    linkButton: {
        padding: 16, // Mismo padding para alinear
        alignItems: 'center',
        marginBottom: 16,
    },
    linkButtonText: {
        color: '#007AFF', // Azul
        fontSize: 16,
        fontWeight: '500',
    },
});