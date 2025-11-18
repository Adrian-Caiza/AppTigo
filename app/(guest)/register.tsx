import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    Text,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signUp } from '../../src/data/repositories/AuthRepository'; // Ajusta la ruta

export default function SignUpScreen() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        setLoading(true);
        try {
            await signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone,
                    },
                },
            });
            // El trigger de Supabase se encargará de crear el perfil.
            Alert.alert('¡Éxito!', 'Cuenta creada. Revisa tu email para confirmar.');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* ---- BOTÓN VOLVER (NUEVO) ---- */}
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Volver</Text>
                </Pressable>

                <Text style={styles.title}>Crear Cuenta</Text>

                <TextInput
                    placeholder="Nombre Completo"
                    value={fullName}
                    onChangeText={setFullName}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Teléfono (Ej: 0991234567)"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    style={styles.input}
                />
                <TextInput
                    placeholder="tu@email.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                />
                <TextInput
                    placeholder="Contraseña (mín. 6 caracteres)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <Button
                    title={loading ? 'Creando...' : 'Crear Cuenta'}
                    onPress={handleSignUp}
                    disabled={loading}
                />

                {/* ---- ENLACE A LOGIN (NUEVO) ---- */}
                <View style={styles.footer}>
                    <Text>¿Ya tienes una cuenta? </Text>
                    <Link href="/(guest)/login" asChild>
                        <Pressable>
                            <Text style={styles.link}>Inicia Sesión</Text>
                        </Pressable>
                    </Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// --- ESTILOS MEJORADOS ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        paddingTop: 60, // Más espacio arriba
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 32,
        color: '#111',
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        backgroundColor: 'white',
        padding: 12,
        marginBottom: 16,
        borderRadius: 8,
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    link: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
    },
    backButtonText: {
        color: '#007AFF',
        fontSize: 16,
    }
});