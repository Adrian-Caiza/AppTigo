import { Tabs, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

export default function UserLayout() {
    return (
        <>
           

            {/* Definimos las TABS */}
            <Tabs screenOptions={{ headerShown: true }}>
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
            </Tabs>
        </>
    );
}