import React, { useState } from 'react';
import {
    View,
    TextInput,
    Pressable,
    StyleSheet,
    Text,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { signUp } from '../../src/data/repositories/AuthRepository';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SignUpScreen() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!fullName || !email || !password || !phone) {
            Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
            return;
        }

        setLoading(true);
        try {
            // Nota: Pasamos los datos adicionales en options.data
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

            Alert.alert(
                '¡Éxito!',
                'Cuenta creada. Revisa tu email para confirmar.'
            );
            router.replace('/(guest)/login');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            // Mismo gradiente que en el Login para consistencia
            colors={['#2E0249', '#570A57', '#A91079']}
            style={styles.background}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Botón Volver (Discreto en la parte superior) */}
                    <Pressable onPress={() => router.back()} style={styles.backButtonTop}>
                        <FontAwesome5 name="arrow-left" size={20} color="#FFF" />
                        <Text style={styles.backButtonText}>Volver</Text>
                    </Pressable>

                    {/* Encabezado */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Regístrate</Text>
                        <Text style={styles.subtitle}>Únete a Tigo hoy mismo</Text>
                    </View>

                    {/* Formulario */}
                    <View style={styles.formContainer}>

                        {/* Nombre Completo */}
                        <View style={styles.inputWrapper}>
                            <FontAwesome5 name="user" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Nombre Completo"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                value={fullName}
                                onChangeText={setFullName}
                                style={styles.input}
                            />
                        </View>

                        {/* Email */}
                        <View style={styles.inputWrapper}>
                            <FontAwesome5 name="envelope" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                style={styles.input}
                            />
                        </View>

                        {/* Teléfono */}
                        <View style={styles.inputWrapper}>
                            <FontAwesome5 name="phone" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Teléfono"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                style={styles.input}
                            />
                        </View>

                        {/* Contraseña */}
                        <View style={styles.inputWrapper}>
                            <FontAwesome5 name="lock" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Contraseña"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.input}
                            />
                        </View>

                        {loading ? (
                            <ActivityIndicator size="large" color="#FFD700" style={{ marginVertical: 20 }} />
                        ) : (
                            <Pressable
                                style={({ pressed }) => [styles.registerButton, pressed && styles.buttonPressed]}
                                onPress={handleSignUp}
                            >
                                <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                                <FontAwesome5 name="check" size={16} color="#2E0249" />
                            </Pressable>
                        )}

                        {/* Footer: Ir a Login */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
                            <Link href="/(guest)/login" asChild>
                                <Pressable>
                                    <Text style={styles.loginLink}>Inicia Sesión</Text>
                                </Pressable>
                            </Link>
                        </View>

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
        paddingTop: 60, // Espacio extra arriba para el botón volver
    },
    backButtonTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#FFF',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '500',
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    formContainer: {
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Efecto Glass
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginBottom: 16,
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
    registerButton: {
        backgroundColor: '#FFD700', // Dorado
        borderRadius: 30,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
        marginBottom: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    registerButtonText: {
        color: '#2E0249', // Contraste oscuro
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 15,
        marginRight: 5,
    },
    loginLink: {
        color: '#FFD700',
        fontSize: 15,
        fontWeight: 'bold',
    },
});