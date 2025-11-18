import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/presentation/context/AuthContext';
import { updateProfile, ProfileUpdateData } from '../../src/data/repositories/ProfileRepository';

export default function EditProfileScreen() {
    const { user, profile, refreshProfile } = useAuth(); // Obtenemos la nueva función
    const router = useRouter();

    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [phone, setPhone] = useState(profile?.phone || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const data: ProfileUpdateData = {
                full_name: fullName,
                phone: phone,
            };

            await updateProfile(user.id, data);

            await refreshProfile(); // ¡Refrescamos el contexto!

            Alert.alert('Éxito', 'Tu perfil ha sido actualizado.');
            router.back(); // Volvemos a la pantalla de perfil

        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo actualizar el perfil.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.label}>Nombre Completo</Text>
                <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Tu nombre completo"
                />

                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Tu teléfono"
                    keyboardType="phone-pad"
                />

                {loading ? (
                    <ActivityIndicator size="large" style={{ marginTop: 20 }} />
                ) : (
                    <View style={{ marginTop: 20 }}>
                        <Button title="Guardar Cambios" onPress={handleSave} />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
});