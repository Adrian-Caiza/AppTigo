import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Alert,
    StatusBar,
    ScrollView
} from 'react-native';
import { useAuth } from '../../src/presentation/context/AuthContext';
import { signOut } from '../../src/data/repositories/AuthRepository';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

export default function AdvisorProfileScreen() {
    const { user, profile } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            // El AuthContext maneja la redirección
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    // Obtener iniciales
    const getInitials = () => {
        return profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'A';
    };

    return (
        <LinearGradient
            colors={['#2E0249', '#570A57', '#A91079']}
            style={styles.background}
        >
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* --- SECCIÓN DE CABECERA --- */}
                    <View style={styles.headerSection}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>{getInitials()}</Text>
                            {/* Badge de Verificado para Asesor */}
                            <View style={styles.verifiedBadge}>
                                <FontAwesome5 name="check" size={10} color="#FFF" />
                            </View>
                        </View>

                        <Text style={styles.nameText}>{profile?.full_name || 'Asesor'}</Text>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>Asesor Comercial</Text>
                        </View>
                    </View>

                    {/* --- SECCIÓN DE INFORMACIÓN --- */}
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Credenciales</Text>

                        <View style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <View style={styles.iconBox}>
                                    <FontAwesome5 name="id-badge" size={18} color="#FFD700" />
                                </View>
                                <View>
                                    <Text style={styles.infoLabel}>Email Corporativo</Text>
                                    <Text style={styles.infoValue}>{user?.email || 'No disponible'}</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.infoRow}>
                                <View style={styles.iconBox}>
                                    <FontAwesome5 name="phone-square-alt" size={18} color="#FFD700" />
                                </View>
                                <View>
                                    <Text style={styles.infoLabel}>Teléfono de Contacto</Text>
                                    <Text style={styles.infoValue}>{profile?.phone || 'No registrado'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* --- SECCIÓN DE ACCIONES --- */}
                    <View style={styles.actionSection}>

                        <Pressable
                            style={({ pressed }) => [styles.actionButton, styles.editButton, pressed && styles.buttonPressed]}
                            onPress={() => router.push('/(advisor)/edit-profile')}
                        >
                            <FontAwesome5 name="user-cog" size={18} color="#2E0249" style={{ marginRight: 10 }} />
                            <Text style={styles.editButtonText}>Editar Perfil</Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [styles.actionButton, styles.logoutButton, pressed && styles.buttonPressed]}
                            onPress={handleSignOut}
                        >
                            <FontAwesome5 name="sign-out-alt" size={18} color="#FFF" style={{ marginRight: 10 }} />
                            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                        </Pressable>

                    </View>

                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    safeArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },

    // Header Section
    headerSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 35,
    },
    avatarContainer: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFD700', 
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        position: 'relative',
    },
    avatarText: {
        fontSize: 45,
        fontWeight: 'bold',
        color: '#FFF',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#007AFF',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2E0249',
    },
    nameText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    roleBadge: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)', 
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.5)',
    },
    roleText: {
        fontSize: 14,
        color: '#FFD700',
        fontWeight: '600',
        letterSpacing: 0.5,
    },

    // Info Section
    infoSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 15,
        marginLeft: 5,
    },
    infoCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 15,
    },

    // Action Section
    actionSection: {
        gap: 15,
    },
    actionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },

    editButton: {
        backgroundColor: '#FFD700',
    },
    editButtonText: {
        color: '#2E0249',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: 'rgba(255, 59, 48, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255, 59, 48, 0.5)',
    },
    logoutButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});