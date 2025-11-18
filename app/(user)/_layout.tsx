import { Tabs } from 'expo-router';
// Aquí importarías los íconos (ej: de Ionicons)
import { Ionicons } from '@expo/vector-icons'; 

export default function UserLayout() {
    return (
        <Tabs screenOptions={{ headerShown: true }}>
            <Tabs.Screen
                name="index"
                options={{ title: 'Inicio' /*, tabBarIcon: ... */ }}
            />
            <Tabs.Screen
                name="plans"
                options={{ title: 'Mis Planes' /*, tabBarIcon: ... */ }}
            />
            <Tabs.Screen
                name="chat"
                options={{ title: 'Chat' /*, tabBarIcon: ... */ }}
            />
            <Tabs.Screen
                name="profile"
                options={{ title: 'Perfil' /*, tabBarIcon: ... */ }}
            />
        </Tabs>
    );
}