import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 1. Importar esto

export default function UserLayout() {
    const insets = useSafeAreaInsets(); // 2. Obtener las medidas seguras

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                // --- HEADER (Sin cambios) ---
                headerTintColor: '#FFF',
                headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
                headerBackground: () => (
                    <LinearGradient
                        colors={['#2E0249', '#4a0072']}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    />
                ),

                // --- TAB BAR (Corregido) ---
                tabBarStyle: {
                    backgroundColor: '#150022',
                    borderTopWidth: 0,
                    elevation: 0,
                    // 3. Altura dinámica: 60 base + lo que mida la barra del sistema
                    height: 60 + insets.bottom,
                    // 4. Padding dinámico: Si hay barra, úsala; si no, usa 8px
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#FFD700',
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            {/* ... (El resto de las Tabs: index, plans, chat, profile) ... */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="plans"
                options={{
                    title: 'Mis Planes',
                    tabBarIcon: ({ color, size }) => <Ionicons name="cart" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chats',
                    tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
                }}
            />

            {/* --- PANTALLAS OCULTAS --- */}
            <Tabs.Screen name="plan/[id]" options={{ href: null, title: 'Detalles del Plan' }} />
            <Tabs.Screen name="chat/[id]" options={{ href: null, title: 'Chat con Asesor' }} />
            <Tabs.Screen name="edit-profile" options={{ href: null, title: 'Editar Perfil' }} />
        </Tabs>
    );
}