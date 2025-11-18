import { supabase } from '../../lib/supabase';
import { Plan } from '../../domain/entities/Plan';

// Definimos un tipo para la contratación que incluya los datos del plan
export interface ContratacionConPlan {
    id: string;
    status: 'pendiente' | 'aprobado' | 'rechazado';
    contracted_at: string;
    plan_id: string;
    user_id: string;
    // Objeto 'plans_moviles' anidado que Supabase nos devolverá
    plans_moviles: Pick<Plan, 'name' | 'price' | 'image_url'> | null;
}

// 1. Crear una nueva contratación
export const createContratacion = async (planId: string, userId: string) => {
    const { data, error } = await supabase
        .from('contrataciones')
        .insert({
            plan_id: planId,
            user_id: userId,
            status: 'pendiente', // Estado inicial
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating contratacion:', error.message);
        throw new Error(error.message);
    }
    return data;
};

// 2. Obtener las contrataciones de UN usuario (con datos del plan)
export const getUserContrataciones = async (userId: string): Promise<ContratacionConPlan[]> => {
    // RLS asegura que esta consulta solo funcione
    // si el 'userId' es el del usuario autenticado.

    const { data, error } = await supabase
        .from('contrataciones')
        .select(`
        id,
        status,
        contracted_at,
        plan_id,
        user_id,
        plans_moviles ( name, price, image_url ) 
    `)
        .eq('user_id', userId)
        .order('contracted_at', { ascending: false });

    if (error) {
        console.error('Error fetching user contrataciones:', error.message);
        throw new Error(error.message);
    }

    return data as unknown as ContratacionConPlan[];
};

export interface ContratacionCompleta {
    id: string;
    status: 'pendiente' | 'aprobado' | 'rechazado';
    contracted_at: string;
    // Perfil del usuario
    profiles: {
        full_name: string;
    } | null;
    // Plan contratado
    plans_moviles: {
        name: string;
    } | null;
}

// 3. Obtener TODAS las contrataciones (para el Asesor)
export const getAllContrataciones = async (): Promise<ContratacionCompleta[]> => {
    // RLS (Paso 6) se encarga de que solo el asesor pueda llamar esto.
    const { data, error } = await supabase
        .from('contrataciones')
        .select(`
        id,
        status,
        contracted_at,
        profiles ( full_name),
        plans_moviles ( name )
    `)
        .order('contracted_at', { ascending: false });

    if (error) {
        console.error('Error fetching all contrataciones:', error.message);
        throw new Error(error.message);
    }
    return data as unknown as ContratacionCompleta[];
};

// 4. Actualizar el estado de una contratación (Aprobar/Rechazar)
export const updateContratacionStatus = async (
    id: string,
    status: 'aprobado' | 'rechazado'
) => {
    const { data, error } = await supabase
        .from('contrataciones')
        .update({ status: status })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating status:', error.message);
        throw new Error(error.message);
    }
    return data;
};