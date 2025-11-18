import { supabase } from '../../lib/supabase';

// Tipo de datos que permitimos actualizar
export interface ProfileUpdateData {
    full_name: string;
    phone: string;
}

export const updateProfile = async (userId: string, data: ProfileUpdateData) => {
    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: data.full_name,
            phone: data.phone,
        })
        .eq('id', userId); // Asegurarse de actualizar solo el perfil del usuario

    if (error) {
        console.error('Error updating profile:', error.message);
        throw error;
    }
};

