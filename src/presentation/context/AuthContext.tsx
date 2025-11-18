import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

// Definimos el tipo de nuestro contexto
interface AuthContextData {
    session: Session | null;
    user: User | null;
    profile: Profile | null; // Usaremos un tipo 'Profile' para el rol
    loading: boolean;
    refreshProfile: () => Promise<void>;
}

// Tipo para nuestro perfil (coincide con la tabla 'profiles')
interface Profile {
    id: string;
    full_name: string;
    phone: string;
    role: 'usuario_registrado' | 'asesor_comercial';
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

// Nuestro Provider (el "cerebro")
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        // Esta lógica es la misma que está en el useEffect
        if (session?.user) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (data) {
                setProfile(data as Profile);
            } else if (error) {
                console.error('Error refreshing profile:', error.message);
            }
        }
    };

    useEffect(() => {
        // Escuchar cambios de autenticación
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                // Si hay sesión, buscamos su perfil y rol
                if (session?.user) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (data) {
                        setProfile(data as Profile);
                    } else if (error) {
                        console.error('Error fetching profile:', error.message);
                    }
                } else {
                    setProfile(null); // Limpiar perfil si no hay sesión
                }
                setLoading(false);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, user, profile, loading, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};