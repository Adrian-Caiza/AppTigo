import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, Pressable } from 'react-native';
import { getActivePlans } from '../../src/data/repositories/PlanRepository';
import { Plan } from '../../src/domain/entities/Plan';
import PlanCard from '../../src/presentation/components/PlanCard'; // Importamos el componente
import { Link, useRouter } from 'expo-router';

export default function GuestCatalogScreen() {
    const router = useRouter();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // BONUS: Estado para la búsqueda [cite: 114]
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

    // BONUS: Filtrar planes basado en la búsqueda [cite: 114]
    const filteredPlans = plans.filter(plan =>
        plan.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <ActivityIndicator style={styles.centered} size="large" />;
    }
    if (error) {
        return <Text style={styles.centered}>Error al cargar planes: {error}</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Header con botón de volver y login */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Volver</Text>
                </Pressable>
                <Link href="/(guest)/login" asChild>
                    <Pressable style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                    </Pressable>
                </Link>
            </View>

            <Text style={styles.title}>Planes Disponibles</Text>

            {/* Barra de Búsqueda (Bonus) [cite: 114] */}
            <TextInput
                style={styles.searchBar}
                placeholder="Buscar planes..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <FlatList
                data={filteredPlans} // Usamos los planes filtrados
                renderItem={({ item }) => (
                    <PlanCard
                        plan={item}
                        href={`/(guest)/plan/${item.id}`} // Ruta de Invitado
                        buttonText="Ver Detalles"
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, paddingTop: 50, paddingHorizontal: 16, backgroundColor: '#F5F5F5' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        fontSize: 16,
        color: '#007AFF',
    },
    loginButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    loginButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16
    },
    searchBar: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 16,
    },
});