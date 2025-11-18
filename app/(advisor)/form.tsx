import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Image, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Plan } from '../../src/domain/entities/Plan';
import { getPlanById, createPlan, updatePlan, uploadPlanImage } from '../../src/data/repositories/PlanRepository';
import * as ImagePicker from 'expo-image-picker';

export default function PlanFormScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>(); // Obtiene el ID de la URL
    const isEditing = !!id;

    const [form, setForm] = useState<Partial<Plan>>({
        name: '',
        price: 0,
        data_gb: 0,
        minutes: 0,
        promotion_details: '',
        image_url: null,
    });
    const [newImage, setNewImage] = useState<string | null>(null); // URI de la nueva imagen
    const [loading, setLoading] = useState(false);

    // Si es modo "Editar", carga los datos del plan
    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            getPlanById(id)
                .then(setForm)
                .catch(err => Alert.alert('Error', 'No se pudieron cargar los datos del plan.'))
                .finally(() => setLoading(false));
        }
    }, [id, isEditing]);

    const handleInputChange = (field: keyof Plan, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setNewImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        let uploadedImageUrl = form.image_url;

        try {
            if (newImage) {
                uploadedImageUrl = await uploadPlanImage(newImage);
            }

            const planData = {
                ...form,
                price: Number(form.price) || 0,
                // Usamos ?? null para asegurarnos de que "0" se guarde como NULL (o 0, según tu lógica)
                // Para este caso, 0 gigas/minutos significa 0, no ilimitado. Usaremos NULL para ilimitado.
                data_gb: Number(form.data_gb) || null,
                minutes: Number(form.minutes) || null,
                image_url: uploadedImageUrl,
            };

            if (isEditing) {
                await updatePlan(id, planData);
                Alert.alert('Éxito', 'Plan actualizado correctamente');
            } else {
                await createPlan(planData);
                Alert.alert('Éxito', 'Plan creado correctamente');
            }

            router.back();

        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo guardar el plan');
        } finally {
            setLoading(false);
        }
    };

    // Guardamos la URI en una variable. TypeScript podrá inferir el tipo correctamente.
    const imageUri = newImage || form.image_url; // <-- CORRECCIÓN 1

    return (
        <ScrollView style={styles.formContainer}>
            <Text style={styles.label}>Nombre del Plan</Text>
            <TextInput
                style={styles.input}
                value={form.name ?? ''} // <-- CORRECCIÓN 2: (?? '') maneja null/undefined
                onChangeText={v => handleInputChange('name', v)}
                placeholder="Ej: Plan Smart 10GB"
            />

            <Text style={styles.label}>Precio Mensual ($)</Text>
            <TextInput
                style={styles.input}
                value={String(form.price ?? 0)} // <-- CORRECCIÓN 3: Convertimos a String
                onChangeText={v => handleInputChange('price', v)}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Gigas de Datos (Dejar en 0 para Ilimitado)</Text>
            <TextInput
                style={styles.input}
                value={String(form.data_gb ?? 0)} // <-- CORRECCIÓN 4: Convertimos a String
                onChangeText={v => handleInputChange('data_gb', v)}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Minutos (Dejar en 0 para Ilimitado)</Text>
            <TextInput
                style={styles.input}
                value={String(form.minutes ?? 0)} // <-- CORRECCIÓN 5: Convertimos a String
                onChangeText={v => handleInputChange('minutes', v)}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Promoción (Opcional)</Text>
            <TextInput
                style={styles.input}
                value={form.promotion_details ?? ''} // <-- CORRECCIÓN 6: (?? '') maneja null/undefined
                onChangeText={v => handleInputChange('promotion_details', v)}
                placeholder="Ej: ¡Primer mes gratis!"
            />

            {/* Selector de Imagen */}
            <Text style={styles.label}>Imagen del Plan</Text>
            <Pressable style={styles.imagePicker} onPress={handlePickImage}>
                <Text>Seleccionar Imagen</Text>
            </Pressable>

            {/* Vista previa de la imagen */}
            {/* Usamos la variable 'imageUri' que definimos arriba */}
            {imageUri && ( // <-- CORRECCIÓN 7
                <Image
                    source={{ uri: imageUri }} // <-- CORRECCIÓN 8
                    style={styles.imagePreview}
                />
            )}

            <Button
                title={loading ? 'Guardando...' : (isEditing ? 'Actualizar Plan' : 'Crear Plan')}
                onPress={handleSubmit}
                disabled={loading}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    formContainer: { flex: 1, padding: 16 },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#CCC', padding: 10, borderRadius: 5, backgroundColor: 'white' },
    imagePicker: { padding: 15, backgroundColor: '#EEE', borderRadius: 5, alignItems: 'center', marginBottom: 10 },
    imagePreview: { width: '100%', height: 200, borderRadius: 5, marginBottom: 16, backgroundColor: '#F0F0F0' },
});