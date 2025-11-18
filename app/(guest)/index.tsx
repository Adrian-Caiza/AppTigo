import React from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar } from 'react-native';
import { useRouter } from 'expo-router'; // Usamos el hook useRouter
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

export default function WelcomeScreen() {
    const router = useRouter(); // Inicializamos el router

    return (
        <LinearGradient
            // Gradiente Púrpura/Magenta elegante
            colors={['#2E0249', '#570A57', '#A91079']}
            style={styles.background}
        >
            <StatusBar barStyle="light-content" />

            <View style={styles.container}>

                {/* --- SECCIÓN SUPERIOR: Logo y Textos --- */}
                <View style={styles.headerContent}>
                    <View style={styles.iconCircle}>
                        <FontAwesome5 name="signal" size={50} color="#FFF" />
                    </View>

                    <Text style={styles.title}>Tigo Conecta</Text>
                    <Text style={styles.subtitle}>
                        Descubre los mejores planes móviles para ti. Conecta, navega y disfruta sin límites.
                    </Text>
                </View>

                {/* --- SECCIÓN INFERIOR: Botones --- */}
                <View style={styles.buttonContainer}>

                    {/* 1. Botón Principal (Dorado): Explorar */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            styles.primaryButton,
                            pressed && styles.buttonPressed
                        ]}
                        onPress={() => router.push('/(guest)/catalog')}
                    >
                        <FontAwesome5 name="search" size={20} color="#2E0249" style={{ marginRight: 10 }} />
                        <Text style={styles.primaryButtonText}>Explorar como Invitado</Text>
                    </Pressable>

                    {/* 2. Botón Secundario (Transparente): Iniciar Sesión */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            styles.secondaryButton,
                            pressed && styles.buttonPressed
                        ]}
                        onPress={() => router.push('/(guest)/login')}
                    >
                        <Text style={styles.secondaryButtonText}>Iniciar Sesión</Text>
                    </Pressable>

                    {/* 3. Footer: Registro */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>¿Aún no eres parte?</Text>
                        <Pressable onPress={() => router.push('/(guest)/register')}>
                            <Text style={styles.linkText}>Regístrate aquí</Text>
                        </Pressable>
                    </View>

                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 60,
        justifyContent: 'space-between', // Empuja el header arriba y los botones abajo
    },
    // Estilos del Header
    headerContent: {
        alignItems: 'center',
        marginTop: 80,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 16,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 24,
    },

    // Estilos de los Botones
    buttonContainer: {
        width: '100%',
        gap: 16, // Espacio vertical entre botones
        marginBottom: 200,
    },
    button: {
        width: '100%',
        height: 60, // Altura fija para asegurar consistencia
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4, // Sombra Android
        shadowColor: '#000', // Sombra iOS
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },

    // Botón Dorado (Invitado)
    primaryButton: {
        backgroundColor: '#FFD700',
    },
    primaryButtonText: {
        color: '#2E0249', // Texto oscuro
        fontSize: 18,
        fontWeight: 'bold',
    },

    // Botón Outline (Login)
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.6)',
    },
    secondaryButtonText: {
        color: '#FFF', // Texto blanco
        fontSize: 18,
        fontWeight: '600',
    },

    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    footerText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 15,
        marginRight: 6,
    },
    linkText: {
        color: '#FFD700',
        fontSize: 15,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});