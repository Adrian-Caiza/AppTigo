import { Stack } from 'expo-router';

// Stack de navegación para usuarios no autenticados
export default function GuestLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="catalog" />
        </Stack>
    );
}