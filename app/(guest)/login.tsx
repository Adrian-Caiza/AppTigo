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
    Platform
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { signIn, sendPasswordReset } from '../../src/data/repositories/AuthRepository';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Maneja el inicio de sesión.
     * La lógica es la misma para ambos roles; el AuthContext
     * se encargará de redirigir según el rol del perfil.
     */
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Campos incompletos', 'Por favor, ingresa tu email y contraseña.');
            return;
        }
        setLoading(true);
        try {
            await signIn({ email, password });
            // El AuthContext y el _layout.tsx se encargarán de la
            // redirección automática al layout (user) o (advisor).
        } catch (error: any) {
            Alert.alert('Error de Inicio de Sesión', error.message || 'Email o contraseña incorrectos.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Maneja la solicitud de restablecimiento de contraseña.
     */
    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert('Email requerido', 'Ingresa tu email para restablecer la contraseña.');
            return;
        }
        setLoading(true);
        try {
            await sendPasswordReset(email);
            Alert.alert(
                'Correo Enviado',
                'Revisa tu bandeja de entrada para restablecer tu contraseña.'
            );
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Iniciar Sesión</Text>

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="tu@email.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                />

                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!loading}
                />

                {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        styles.userButton,
                        (loading || pressed) && styles.buttonDisabled
                    ]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Ingresar como Usuario</Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        styles.advisorButton,
                        (loading || pressed) && styles.buttonDisabled
                    ]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Ingresar como Asesor</Text> 
                </Pressable>

                <Pressable onPress={handlePasswordReset} disabled={loading}>
                    <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
                </Pressable>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>¿No tienes cuenta? </Text>
                    <Link href="/(guest)/register" asChild>
                        <Pressable disabled={loading}>
                            <Text style={styles.link}>Regístrate</Text>
                        </Pressable>
                    </Link>
                </View>

                <View style={styles.footer}>
                    <Link href="/(guest)/" asChild>
                        <Pressable disabled={loading}>
                            <Text style={styles.link}>← Volver</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 32,
        color: '#111',
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    button: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    userButton: {
        backgroundColor: '#007AFF', // Azul
    },
    advisorButton: {
        backgroundColor: '#34C759', // Verde [cite: 109]
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    link: {
        color: '#007AFF',
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 15,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    footerText: {
        fontSize: 15,
        color: '#555',
    },
    loader: {
        marginVertical: 10,
        alignSelf: 'center',
    },
});