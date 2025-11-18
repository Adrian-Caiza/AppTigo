import React, { useState, useEffect } from 'react';
import { 
    Text, 
    TextInput, 
    StyleSheet, 
    ScrollView, 
    Alert, 
    Image, 
    Pressable, 
    KeyboardAvoidingView, 
    Platform, 
    ActivityIndicator,
    View 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Plan } from '../../src/domain/entities/Plan';
import { getPlanById, createPlan, updatePlan, uploadPlanImage } from '../../src/data/repositories/PlanRepository';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlanFormScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEditing = !!id;

    const [form, setForm] = useState<Partial<Plan>>({
        name: '',
        price: 0,
        data_gb: 0,
        minutes: 0,
        promotion_details: '',
        image_url: null,
    });
    const [newImage, setNewImage] = useState<{ uri: string; base64: string; ext: string } | null>(null);
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
            quality: 0.8,
            base64: true,
        });

        // 1. Primero, verificamos que no se cancele y que existan 'assets'
        if (!result.canceled && result.assets) {
            const asset = result.assets[0];

            // 2. AHORA verificamos la propiedad 'base64'
            if (asset.base64) {
                // En este bloque, TypeScript sabe que asset.base64 es un 'string'
                const fileExt = asset.uri.split('.').pop() || 'jpg';

                setNewImage({
                    uri: asset.uri,
                    base64: asset.base64,
                    ext: fileExt
                });
            } else {
                // Es bueno manejar el caso en que base64 falle
                Alert.alert('Error', 'No se pudo procesar la imagen seleccionada.');
            }
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        let uploadedImageUrl = form.image_url;

        try {
            if (newImage) {
                uploadedImageUrl = await uploadPlanImage(newImage.base64, newImage.ext);
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
    const imageUri = newImage?.uri || form.image_url;

    if (loading && isEditing) {
        return (
            <LinearGradient colors={['#2E0249', '#570A57']} style={styles.centered}>
                <ActivityIndicator size="large" color="#FFD700" />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#2E0249', '#570A57', '#A91079']}
            style={styles.background}
        >
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingContainer}
                >
                    <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
                        
                        <View style={styles.header}>
                            <Text style={styles.title}>{isEditing ? 'Editar Plan' : 'Nuevo Plan'}</Text>
                            <Text style={styles.subtitle}>Completa la información del catálogo</Text>
                        </View>

                        {/* --- Nombre --- */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre del Plan</Text>
                            <View style={styles.inputWrapper}>
                                <FontAwesome5 name="tag" size={16} color="#FFD700" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    value={form.name ?? ''}
                                    onChangeText={v => handleInputChange('name', v)}
                                    placeholder="Ej: Plan Smart 10GB"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                />
                            </View>
                        </View>

                        {/* --- Precio --- */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Precio Mensual ($)</Text>
                            <View style={styles.inputWrapper}>
                                <FontAwesome5 name="dollar-sign" size={16} color="#FFD700" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    value={String(form.price ?? 0)}
                                    onChangeText={v => handleInputChange('price', v)}
                                    keyboardType="numeric"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                />
                            </View>
                        </View>

                        {/* --- Datos y Minutos (Fila doble) --- */}
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.label}>Gigas (0=Inf)</Text>
                                <View style={styles.inputWrapper}>
                                    <FontAwesome5 name="database" size={14} color="#FFD700" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        value={String(form.data_gb ?? 0)}
                                        onChangeText={v => handleInputChange('data_gb', v)}
                                        keyboardType="numeric"
                                        placeholderTextColor="rgba(255,255,255,0.4)"
                                    />
                                </View>
                            </View>

                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Minutos (0=Inf)</Text>
                                <View style={styles.inputWrapper}>
                                    <FontAwesome5 name="clock" size={14} color="#FFD700" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        value={String(form.minutes ?? 0)}
                                        onChangeText={v => handleInputChange('minutes', v)}
                                        keyboardType="numeric"
                                        placeholderTextColor="rgba(255,255,255,0.4)"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* --- Promoción --- */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Promoción (Opcional)</Text>
                            <View style={styles.inputWrapper}>
                                <FontAwesome5 name="bullhorn" size={16} color="#FFD700" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    value={form.promotion_details ?? ''}
                                    onChangeText={v => handleInputChange('promotion_details', v)}
                                    placeholder="Ej: ¡Primer mes gratis!"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                />
                            </View>
                        </View>

                        {/* --- Selector de Imagen --- */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Imagen del Plan</Text>
                            
                            {imageUri ? (
                                <View style={styles.imagePreviewContainer}>
                                    <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
                                    <Pressable style={styles.changeImageButton} onPress={handlePickImage}>
                                        <FontAwesome5 name="camera" size={14} color="#FFF" />
                                        <Text style={styles.changeImageText}>Cambiar</Text>
                                    </Pressable>
                                </View>
                            ) : (
                                <Pressable style={styles.uploadButton} onPress={handlePickImage}>
                                    <FontAwesome5 name="image" size={24} color="rgba(255,255,255,0.5)" />
                                    <Text style={styles.uploadText}>Toque para subir imagen</Text>
                                </Pressable>
                            )}
                        </View>

                        {/* --- Botones --- */}
                        <View style={styles.footer}>
                            <Pressable 
                                style={({pressed}) => [styles.submitButton, pressed && styles.buttonPressed]}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#2E0249" />
                                ) : (
                                    <Text style={styles.submitButtonText}>
                                        {isEditing ? 'Actualizar Plan' : 'Crear Plan'}
                                    </Text>
                                )}
                            </Pressable>

                            <Pressable onPress={() => router.back()} style={styles.cancelButton}>
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </Pressable>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    safeArea: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    keyboardAvoidingContainer: { flex: 1 },
    
    formContainer: { 
        paddingHorizontal: 20, 
        paddingBottom: 50 
    },

    header: {
        marginTop: 10,
        marginBottom: 25,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
    },

    inputGroup: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        color: '#FFD700', // Dorado para etiquetas
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)', // Glass effect
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        height: 50,
    },
    icon: {
        marginRight: 10,
        width: 20,
        textAlign: 'center',
    },
    input: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
        height: '100%',
    },

    // Image Styles
    uploadButton: {
        height: 150,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderStyle: 'dashed',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        color: 'rgba(255,255,255,0.5)',
        marginTop: 10,
        fontSize: 14,
    },
    imagePreviewContainer: {
        position: 'relative',
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        backgroundColor: '#000',
    },
    changeImageButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeImageText: {
        color: '#FFF',
        fontSize: 12,
        marginLeft: 6,
        fontWeight: 'bold',
    },

    // Footer Buttons
    footer: {
        marginTop: 20,
        gap: 15,
    },
    submitButton: {
        backgroundColor: '#FFD700', // Dorado
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }]
    },
    submitButtonText: {
        color: '#2E0249', // Texto oscuro
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        alignItems: 'center',
        padding: 10,
    },
    cancelText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
    }
});