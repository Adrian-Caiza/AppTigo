import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Link, LinkProps } from 'expo-router';
import { Plan } from '../../domain/entities/Plan';

interface PlanCardProps {
    plan: Plan;
    /** La ruta de destino (ej: "/(guest)/plan/123" o "/(user)/plan/123") */
    href: LinkProps['href'];
    /** El texto del botón (ej: "Ver Detalles") */
    buttonText: string;
}

export default function PlanCard({ plan, href, buttonText }: PlanCardProps) {
    return (
        <View style={styles.card}>
            {/* Aquí puedes añadir la imagen si lo deseas */}
            {/* <Image source={{ uri: plan.image_url }} style={styles.image} /> */}

            {plan.image_url && (
                <Image 
                    source={{ uri: plan.image_url }} 
                    style={styles.image} 
                    resizeMode="cover" 
                />
            )}

            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>${plan.price}/mes</Text>

            {plan.promotion_details && (
                <Text style={styles.planPromo}>{plan.promotion_details}</Text>
            )}

            <View style={styles.features}>
                <Text style={styles.featureText}>
                    {plan.data_gb ? `${plan.data_gb} GB` : 'Datos Ilimitados'}
                </Text>
                <Text style={styles.featureText}>
                    {plan.minutes ? `${plan.minutes} min` : 'Minutos Ilimitados'}
                </Text>
            </View>

            <Link href={href} asChild>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: 
    { width: '100%',
        height: 150, 
        borderRadius: 8, 
        marginBottom: 12 
    },
    planName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    planPrice: {
        fontSize: 18,
        color: '#007AFF',
        marginVertical: 4
    },
    planPromo: {
        fontSize: 14,
        color: 'green',
        fontStyle: 'italic',
        marginBottom: 8
    },
    features: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 10
    },
    featureText: {
        fontSize: 14,
        color: '#333'
    },
    button: {
        marginTop: 12,
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },
});