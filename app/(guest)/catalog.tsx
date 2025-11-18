import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TextInput,
    Pressable,
    StatusBar,
    Platform
} from 'react-native';
import { getActivePlans } from '../../src/data/repositories/PlanRepository';
import { Plan } from '../../src/domain/entities/Plan';
import PlanCard from '../../src/presentation/components/PlanCard';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'; 

export default function GuestCatalogScreen() {
    const router = useRouter();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estado para la búsqueda (Lógica intacta)
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await getActivePlans();
                setPlans(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    // Filtrado (Lógica intacta)
    const filteredPlans = plans.filter(plan =>
        plan.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <LinearGradient colors={['#2E0249', '#570A57']} style={styles.centered}>
                <ActivityIndicator size="large" color="#FFD700" />
            </LinearGradient>
        );
    }

    if (error) {
        return (
            <LinearGradient colors={['#2E0249', '#570A57']} style={styles.centered}>
                <Text style={styles.errorText}>Error al cargar planes: {error}</Text>
                <Pressable onPress={() => router.back()} style={styles.backButtonError}>
                    <Text style={styles.backButtonText}>Volver</Text>
                </Pressable>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#2E0249', '#570A57', '#A91079']}
            style={styles.background}
        >
            <StatusBar barStyle="light-content" />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>

                    {/* --- HEADER --- */}
                    <View style={styles.header}>
                        <Pressable onPress={() => router.back()} style={styles.backButton}>
                            <FontAwesome5 name="arrow-left" size={20} color="#FFF" />
                        </Pressable>

                        <Link href="/(guest)/login" asChild>
                            <Pressable style={styles.loginButton}>
                                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                            </Pressable>
                        </Link>
                    </View>

                    <Text style={styles.title}>Planes Disponibles</Text>
                    <Text style={styles.subtitle}>Encuentra el plan perfecto para ti</Text>

                    {/* --- BARRA DE BÚSQUEDA (Estilo Glass) --- */}
                    <View style={styles.searchContainer}>
                        <FontAwesome5 name="search" size={16} color="rgba(255,255,255,0.6)" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar planes (ej. Smart, Premium)..."
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <Pressable onPress={() => setSearchQuery('')}>
                                <FontAwesome5 name="times-circle" size={16} color="rgba(255,255,255,0.6)" />
                            </Pressable>
                        )}
                    </View>

                    {/* --- LISTA DE PLANES --- */}
                    <FlatList
                        data={filteredPlans}
                        renderItem={({ item }) => (
                            <View style={styles.cardWrapper}>
                                <PlanCard
                                    plan={item}
                                    href={`/(guest)/plan/${item.id}`}
                                    buttonText="Ver Detalles"
                                />
                            </View>
                        )}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />

                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

// --- ESTILOS MEJORADOS ---
const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    errorText: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center'
    },
    backButtonError: {
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8
    },

    // Header Styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
    },
    backButtonText: {
        color: '#FFF'
    },
    loginButton: {
        backgroundColor: '#FFD700', // Dorado para resaltar la acción
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 }
    },
    loginButtonText: {
        color: '#2E0249',
        fontWeight: 'bold',
        fontSize: 14,
    },

    // Text Styles
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 20
    },

    // Search Bar Styles
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)', // Efecto cristal
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
    },

    // List Styles
    listContent: {
        paddingBottom: 20,
    },
    cardWrapper: {
        marginBottom: 20, // Espacio entre tarjetas
        // El PlanCard interno tiene fondo blanco, lo que crea un buen contraste con el fondo oscuro
    }
});