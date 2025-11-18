import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/presentation/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

// Este es el layout principal
function RootLayout() {
  const { session, profile, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments(); // Segmentos de la URL actual

  useEffect(() => {
    if (loading) return; // Si estamos cargando, no hacer nada
    
    const inAuthGroup = segments[0] === '(guest)';
    const inUserGroup = segments[0] === '(user)';
    const inAdvisorGroup = segments[0] === '(advisor)';

    // 1. Si no hay sesión (y no estamos en el grupo 'guest')
    if (!session && !inAuthGroup) {
      router.replace('/(guest)');
    } 
    // 2. Si hay sesión y es 'usuario_registrado'
    else if (session && profile?.role === 'usuario_registrado' && !inUserGroup) {
      router.replace('/(user)'); // Redirige al index de (user)
    } 
    // 3. Si hay sesión y es 'asesor_comercial'
    else if (session && profile?.role === 'asesor_comercial' && !inAdvisorGroup) {
      router.replace('/(advisor)'); // Redirige al index de (advisor)
    }
  }, [session, profile, loading, segments]);

  if (loading) {
    // Puedes mostrar un Splash Screen aquí
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
  }

  // Define las "pilas" (stacks) de navegación principales
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(guest)" />
      <Stack.Screen name="(user)" />
      <Stack.Screen name="(advisor)" />
    </Stack>
  );
}

// Envolvemos toda la app con el AuthProvider
export default function AppLayout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}