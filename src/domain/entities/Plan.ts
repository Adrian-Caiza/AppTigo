// Esta es nuestra "entidad" de Plan, que coincide con la tabla de Supabase
export interface Plan {
    id: string;
    name: string;
    price: number;
    segment: string | null;
    target_audience: string | null;
    data_gb: number | null;
    minutes: number | null;
    sms_unlimited: boolean | null;
    social_media_details: string | null;
    whatsapp_details: string | null;
    image_url: string | null;
    is_active: boolean | null;
    promotion_details: string | null;
    created_at: string;
}