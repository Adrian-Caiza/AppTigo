import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Asumo que guardas tus variables de entorno en un .env
// según la estructura de tu proyecto.
// Necesitarás expo-constants o un método similar para leerlas.
// Por ahora, las pondré directo para el ejemplo, pero ¡cámbialas!

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "TU_SUPABASE_URL";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "TU_SUPABASE_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});