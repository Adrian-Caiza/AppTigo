import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { signIn, sendPasswordReset } from '../../src/data/repositories/AuthRepository';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Campos incompletos', 'Por favor, ingresa tu email y contraseña.');
            return;
        }
        setLoading(true);
        try {
            await signIn({ email, password });
            // La redirección la maneja el AuthContext automáticamente
        } catch (error: any) {
            Alert.alert('Error de Inicio de Sesión', error.message || 'Email o contraseña incorrectos.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert('Email requerido', 'Ingresa tu email para restablecer la contraseña.');
            return;
        }
        setLoading(true);
        try {
            await sendPasswordReset(email);
            Alert.alert('Correo Enviado', 'Revisa tu bandeja de entrada para restablecer tu contraseña.');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            // Gradiente inspirado en la imagen (Tonos morados/oscuros elegantes)
            colors={['#2E0249', '#570A57', '#A91079']}
            style={styles.background}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Títulos */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Bienvenido</Text>
                        <Text style={styles.subtitle}>Inicia sesión en Tigo</Text>
                    </View>

                    {/* Inputs Estilizados (Estilo Cápsula) */}
                    <View style={styles.formContainer}>

                        <View style={styles.inputWrapper}>
                            <FontAwesome5 name="envelope" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <FontAwesome5 name="lock" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                editable={!loading}
                            />
                        </View>

                        {/* Enlace Olvidaste Contraseña */}
                        <Pressable onPress={handlePasswordReset} disabled={loading} style={styles.forgotContainer}>
                            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                        </Pressable>

                        {loading && <ActivityIndicator size="large" color="#FFD700" style={{ marginVertical: 20 }} />}

                        {/* Botones de Acción (Restaurados y Estilizados) */}
                        <View style={styles.buttonContainer}>

                            <Pressable
                                style={({ pressed }) => [styles.button, styles.userButton, pressed && styles.buttonPressed]}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                <Text style={styles.userButtonText}>Ingresar como Usuario</Text>
                                <FontAwesome5 name="arrow-right" size={16} color="#2E0249" />
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => [styles.button, styles.advisorButton, pressed && styles.buttonPressed]}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                <Text style={styles.advisorButtonText}>Ingresar como Asesor</Text>
                            </Pressable>

                        </View>

                        {/* Footer / Registro */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>¿No tienes cuenta?</Text>
                            <Link href="/(guest)/register" asChild>
                                <Pressable disabled={loading}>
                                    <Text style={styles.registerLink}>Regístrate</Text>
                                </Pressable>
                            </Link>
                        </View>

                        {/* Botón Volver */}
                        <Link href="/(guest)" asChild>
                            <Pressable style={styles.backLink} disabled={loading}>
                                <Text style={styles.backLinkText}>← Volver al inicio</Text>
                            </Pressable>
                        </Link>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 5,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
    },
    formContainer: {
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fondo translúcido estilo "Glass"
        borderRadius: 30, // Bordes redondeados (Píldora)
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    inputIcon: {
        marginRight: 15,
    },
    input: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
        paddingVertical: 12,
    },
    forgotContainer: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotText: {
        color: '#FFD700', // Dorado para resaltar
        fontSize: 14,
        fontWeight: '600',
    },
    buttonContainer: {
        gap: 15,
        marginBottom: 30,
    },
    button: {
        borderRadius: 30,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        elevation: 3, // Sombra en Android
        shadowColor: '#000', // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    // Estilo Botón Usuario (Principal - Dorado/Amarillo de la imagen)
    userButton: {
        backgroundColor: '#FFD700',
    },
    userButtonText: {
        color: '#2E0249', // Texto oscuro para contraste con amarillo
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Estilo Botón Asesor (Secundario - Transparente con borde o color suave)
    advisorButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    advisorButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    footerText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 15,
    },
    registerLink: {
        color: '#FFD700',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    backLink: {
        alignSelf: 'center',
    },
    backLinkText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
    }
});