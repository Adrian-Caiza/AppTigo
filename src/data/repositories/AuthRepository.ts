import { supabase } from '../../lib/supabase'; // Ajusta la ruta si es necesario
import { AuthError, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

// Opciones adicionales para el registro
interface SignUpOptions {
    data: {
        full_name: string;
        phone: string;
    };
}

// Función para Registrarse
export const signUp = async (credentials: SignUpWithPasswordCredentials & { options: SignUpOptions }) => {
    const { data, error } = await supabase.auth.signUp(credentials);

    if (error) {
        console.error('Error signing up:', error.message);
        throw error;
    }

    return data;
};

// Función para Iniciar Sesión
export const signIn = async (credentials: SignInWithPasswordCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
        console.error('Error signing in:', error.message);
        throw error;
    }

    return data;
};

// Función para Cerrar Sesión
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Error signing out:', error.message);
        throw error;
    }
};

// Función para Restablecer Contraseña
export const sendPasswordReset = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        // IMPORTANTE: Debes configurar esta 'deep link' en tu app.json
        // y en la configuración de Supabase (URL Redirects)
        // redirectTo: 'exp://tu-app/reset-password', 
    });

    if (error) {
        console.error('Error sending password reset:', error.message);
        throw error;
    }
    return data;
};