import React from 'react';
import { Tabs } from 'expo-router';
// Importa los íconos que prefieras, ej:
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AdvisorLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: true,
            // Aquí puedes definir colores para el tab activo/inactivo
        }}>
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

            {/* Ocultamos la pantalla del formulario para que no sea un Tab */}
            <Tabs.Screen
                name="form" // app/(advisor)/form.tsx
                options={{
                    href: null, // Oculta este tab
                    headerShown: true, // Muestra el header en la pantalla del form
                    title: 'Crear/Editar Plan'
                }}
            />
            <Tabs.Screen
                name="chat/[id]" // app/(advisor)/chat/[id].tsx
                options={{
                href: null, // Oculta este tab
                headerShown: true,
                title: 'Chat con Cliente'
                }}
            />
            <Tabs.Screen
                name="edit-profile" 
                options={{
                href: null, // Oculto de la barra de tabs
                title: 'Editar Perfil' // Título del header
                }}
            />
        </Tabs>
    );
}