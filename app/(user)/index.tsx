import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    StatusBar
} from 'react-native';
import { getActivePlans } from '../../src/data/repositories/PlanRepository';
import { Plan } from '../../src/domain/entities/Plan';
import PlanCard from '../../src/presentation/components/PlanCard';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserHomeScreen() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await getActivePlans();
                setPlans(data);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    if (loading) {
        return (
            <LinearGradient
                colors={['#2E0249', '#570A57']}
                style={styles.centered}
            >
                <ActivityIndicator size="large" color="#FFD700" />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            // Mismo tema 'Premium' que las pantallas de invitado
            colors={['#2E0249', '#570A57', '#A91079']}
            style={styles.background}
        >
            <StatusBar barStyle="light-content" />

            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                <View style={styles.container}>

                    {/* --- HEADER --- */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Nuevos Planes Tigo</Text>
                        <Text style={styles.subtitle}>
                            Explora las mejores ofertas seleccionadas para ti
                        </Text>
                    </View>

                    {/* --- LISTA DE PLANES --- */}
                    <FlatList
                        data={plans}
                        renderItem={({ item }) => (
                            <View style={styles.cardWrapper}>
                                <PlanCard
                                    plan={item}
                                    href={`/(user)/plan/${item.id}`} // Ruta de Usuario
                                    buttonText="Ver Detalles y Contratar"
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

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },

    // Header Styles
    headerContainer: {
        marginTop: 10,
        marginBottom: 25,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },

    // List Styles
    listContent: {
        paddingBottom: 40, // Espacio extra al final para no chocar con el TabBar
    },
    cardWrapper: {
        marginBottom: 20, // Separación elegante entre tarjetas
    }
});