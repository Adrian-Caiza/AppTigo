import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdvisorLayout() {
    const insets = useSafeAreaInsets(); // Para calcular el espacio de los botones del celular

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                // --- ESTILOS DEL HEADER ---
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

                // --- ESTILOS DEL TAB BAR ---
                tabBarStyle: {
                    backgroundColor: '#150022', // Fondo oscuro
                    borderTopWidth: 0,
                    elevation: 0,
                    // Altura dinámica que se adapta al dispositivo
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#FFD700', // Dorado
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            {/* --- TABS PRINCIPALES --- */}
            <Tabs.Screen
                name="index" // app/(advisor)/index.tsx
                options={{
                    title: 'Planes',
                    tabBarIcon: ({ color, size }) => <Ionicons name="briefcase" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="requests" // app/(advisor)/requests.tsx
                options={{
                    title: 'Solicitudes',
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="clipboard-list" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="chats" // app/(advisor)/chats.tsx
                options={{
                    title: 'Chats',
                    tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile" // app/(advisor)/profile.tsx
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} />,
                }}
            />

            {/* --- PANTALLAS OCULTAS (Sin Tab) --- */}
            <Tabs.Screen
                name="form" // app/(advisor)/form.tsx
                options={{
                    href: null,
                    headerShown: true,
                    title: 'Crear/Editar Plan'
                }}
            />
            <Tabs.Screen
                name="chat/[id]" // app/(advisor)/chat/[id].tsx
                options={{
                    href: null,
                    headerShown: true,
                    title: 'Chat con Cliente'
                }}
            />
            <Tabs.Screen
                name="edit-profile"
                options={{
                    href: null,
                    title: 'Editar Perfil'
                }}
            />
        </Tabs>
    );
}