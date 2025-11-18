import { supabase } from '../../lib/supabase';
import { Plan } from '../../domain/entities/Plan';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

export const getActivePlans = async (): Promise<Plan[]> => {
    // ¡La magia de RLS!
    // No necesitamos poner ".eq('is_active', true)" aquí.
    // Como el usuario 'anon' (invitado) solo tiene permiso RLS
    // para ver planes activos, Supabase los filtra automáticamente.

    const { data, error } = await supabase
        .from('plans_moviles')
        .select('*')
        .order('price', { ascending: true }); // Ordenemos por precio

    if (error) {
        console.error('Error fetching plans:', error.message);
        throw new Error(error.message);
    }

    return data as Plan[];
};

// --- FUNCIONES CRUD ---

// 1. OBTENER TODOS los planes (para el Asesor)
// RLS se encarga de que solo el asesor pueda llamar esto.
export const getAllPlans = async (): Promise<Plan[]> => {
    const { data, error } = await supabase
        .from('plans_moviles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Plan[];
};

// 2. OBTENER UN plan por ID (para editar)
export const getPlanById = async (id: string): Promise<Plan> => {
    const { data, error } = await supabase
        .from('plans_moviles')
        .select('*')
        .eq('id', id)
        .single(); // .single() es crucial aquí

    if (error) throw new Error(error.message);
    return data as Plan;
};

// 3. CREAR un nuevo plan
export const createPlan = async (planData: Partial<Plan>) => {
    const { data, error } = await supabase
        .from('plans_moviles')
        .insert(planData)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

// 4. ACTUALIZAR un plan
export const updatePlan = async (id: string, planData: Partial<Plan>) => {
    const { data, error } = await supabase
        .from('plans_moviles')
        .update(planData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

// 5. BORRAR un plan
export const deletePlan = async (id: string) => {
    const { data, error } = await supabase
        .from('plans_moviles')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    return data;
};

// --- FUNCIONES DE STORAGE ---

// 6. SUBIR imagen del plan 
export const uploadPlanImage = async (uri: string): Promise<string> => {
    try {
        // 1. Pedir permisos (si no se han dado)
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permiso de galería denegado');
        }

        // 2. Convertir la imagen a un formato que Supabase entienda
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileExt = uri.split('.').pop(); // 'jpg' o 'png'
        const filePath = `${Date.now()}.${fileExt}`; // Nombre único

        // 3. Subir al bucket 'planes-imagenes'
        const { data, error: uploadError } = await supabase.storage
            .from('planes-imagenes') // ID del Bucket [cite: 43]
            .upload(filePath, blob, {
                contentType: blob.type,
                upsert: false,
            });

        if (uploadError) {
            throw uploadError;
        }

        // 4. Obtener la URL pública para guardarla en la tabla 'plans_moviles'
        const { data: publicUrlData } = supabase.storage
            .from('planes-imagenes')
            .getPublicUrl(data.path);

        return publicUrlData.publicUrl;

    } catch (error: any) {
        console.error('Error uploading image:', error);
        throw new Error(error.message);
    }
};

// 7. BORRAR imagen del plan (opcional, para cuando se actualiza)
export const deletePlanImage = async (imageUrl: string) => {
    // Extraer el 'path' de la URL
    const imagePath = imageUrl.split('/planes-imagenes/')[1];

    if (!imagePath) return;

    const { error } = await supabase.storage
        .from('planes-imagenes')
        .remove([imagePath]);

    if (error) {
        console.error('Error deleting old image:', error.message);
    }
};