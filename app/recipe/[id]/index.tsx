import { ThemedText } from "@/components/ThemedText";
import { useRoute,useTheme } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Ingredient {
    name: string;
    quantity: string;
    notes?: string;
}

interface Step {
    step: number;
    instruction: string;
    time?: string;
    temperature?: string;
}

interface RecipeData {
    _id: string;
    title: string;
    description: string;
    ingredients: Ingredient[];
    steps: Step[];
    metadata: {
        servings: string;
        prep_time: string;
        cook_time: string;
        total_time: string;
        difficulty: string;
        cuisine: string;
        dietary_tags: string[];
    };
    equipment: string[];
    tips: string[];
    channelName: string;
}

interface RecipeResponse {
    success: boolean;
    message: string;
    recipe_id: string;
    recipe_data: RecipeData;
    error: null;
}

export default function RecipePage() {
    const route = useRoute();
    const theme = useTheme();
    const { id } = route.params as { id: string };
    const [recipe, setRecipe] = useState<RecipeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRecipe() {
            try {
                setLoading(true);
                const response = await axios.get(`${BACKEND_URL}/api/v1/users/${id}/recipes`);
                console.warn('Response:', response.data);
                if (response.data.success) {
                    setRecipe(response.data.recipe_data);
                } else {
                    setError('Failed to fetch recipe');
                }
            } catch (err) {
                setError('Error loading recipe');
                console.error('Error fetching recipe:', err);
            } finally {
                setLoading(false);
            }
        }
        
        fetchRecipe();
    }, [id]);

    const styles = StyleSheet.create({
        container: {
            paddingTop:16,
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        contentContainer: {
            padding: 16,
            paddingBottom: 32,
        },
        centered: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
        },
        loadingText: {
            marginTop: 16,
            fontSize: 16,
            color: theme.colors.text,
        },
        errorText: {
            fontSize: 16,
            color: theme.dark ? '#ff6b6b' : '#dc3545',
            textAlign: 'center',
        },
        header: {
            marginBottom: 24,
            backgroundColor: theme.colors.card,
            padding: 20,
            borderRadius: 16,
            shadowColor: theme.colors.border,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 8,
            lineHeight: 34,
            color: theme.colors.text,
        },
        channelName: {
            fontSize: 16,
            color: theme.colors.text,
            opacity: 0.7,
            marginBottom: 12,
            fontStyle: 'italic',
        },
        description: {
            fontSize: 16,
            lineHeight: 22,
            color: theme.colors.text,
            opacity: 0.8,
        },
        metadataContainer: {
            backgroundColor: theme.colors.card,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            shadowColor: theme.colors.border,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        metadataGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        metadataItem: {
            width: '48%',
            marginBottom: 16,
            backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            padding: 12,
            borderRadius: 12,
        },
        metadataLabel: {
            fontSize: 12,
            color: theme.colors.text,
            opacity: 0.6,
            textTransform: 'uppercase',
            fontWeight: '600',
            marginBottom: 4,
        },
        metadataValue: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        tagsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 16,
        },
        tag: {
            backgroundColor: theme.dark ? 'rgba(76, 175, 80, 0.2)' : '#e8f5e8',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            marginRight: 8,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: theme.dark ? 'rgba(76, 175, 80, 0.3)' : '#4CAF50',
        },
        tagText: {
            fontSize: 12,
            color: theme.dark ? '#81c784' : '#2d6a2d',
            fontWeight: '600',
        },
        section: {
            marginBottom: 32,
        },
        sectionTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 16,
            color: theme.colors.text,
            paddingLeft: 4,
        },
        ingredientItem: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            marginBottom: 8,
            borderLeftWidth: 4,
            borderLeftColor: theme.dark ? '#81c784' : '#4CAF50',
            shadowColor: theme.colors.border,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        ingredientText: {
            fontSize: 16,
            lineHeight: 22,
        },
        ingredientQuantity: {
            fontWeight: '700',
            color: theme.colors.text,
        },
        ingredientName: {
            color: theme.colors.text,
        },
        ingredientNotes: {
            color: theme.colors.text,
            opacity: 0.7,
            fontStyle: 'italic',
        },
        equipmentContainer: {
            backgroundColor: theme.colors.card,
            padding: 16,
            borderRadius: 12,
            shadowColor: theme.colors.border,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        equipmentItem: {
            paddingVertical: 6,
            paddingHorizontal: 4,
        },
        equipmentText: {
            fontSize: 15,
            color: theme.colors.text,
            opacity: 0.8,
        },
        stepItem: {
            flexDirection: 'row',
            marginBottom: 24,
            alignItems: 'flex-start',
            backgroundColor: theme.colors.card,
            padding: 16,
            borderRadius: 12,
            shadowColor: theme.colors.border,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        stepNumber: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.dark ? '#66bb6a' : '#4CAF50',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
            marginTop: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
        },
        stepNumberText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
        stepContent: {
            flex: 1,
        },
        stepInstruction: {
            fontSize: 16,
            lineHeight: 24,
            color: theme.colors.text,
        },
        stepMeta: {
            flexDirection: 'row',
            marginTop: 12,
            flexWrap: 'wrap',
        },
        stepMetaText: {
            fontSize: 13,
            color: theme.colors.text,
            backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 16,
            marginRight: 8,
            marginBottom: 4,
            fontWeight: '500',
        },
        tipItem: {
            backgroundColor: theme.dark ? 'rgba(255, 193, 7, 0.15)' : '#fff3cd',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: theme.dark ? '#ffb74d' : '#ffc107',
            shadowColor: theme.colors.border,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        tipText: {
            fontSize: 15,
            lineHeight: 22,
            color: theme.dark ? '#ffb74d' : '#856404',
            fontWeight: '500',
        },
    });

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <ThemedText style={styles.loadingText}>Loading recipe...</ThemedText>
            </View>
        );
    }

    if (error || !recipe) {
        return (
            <View style={styles.centered}>
                <ThemedText style={styles.errorText}>{error || 'Recipe not found'}</ThemedText>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
                <ThemedText style={styles.title}>{recipe.title}</ThemedText>
                <ThemedText style={styles.channelName}>by {recipe.channelName}</ThemedText>
                <ThemedText style={styles.description}>{recipe.description}</ThemedText>
            </View>

            {/* Metadata */}
            <View style={styles.metadataContainer}>
                <View style={styles.metadataGrid}>
                    <View style={styles.metadataItem}>
                        <ThemedText style={styles.metadataLabel}>Prep Time</ThemedText>
                        <ThemedText style={styles.metadataValue}>{recipe.metadata.prep_time}</ThemedText>
                    </View>
                    <View style={styles.metadataItem}>
                        <ThemedText style={styles.metadataLabel}>Cook Time</ThemedText>
                        <ThemedText style={styles.metadataValue}>{recipe.metadata.cook_time}</ThemedText>
                    </View>
                    <View style={styles.metadataItem}>
                        <ThemedText style={styles.metadataLabel}>Total Time</ThemedText>
                        <ThemedText style={styles.metadataValue}>{recipe.metadata.total_time}</ThemedText>
                    </View>
                    <View style={styles.metadataItem}>
                        <ThemedText style={styles.metadataLabel}>Difficulty</ThemedText>
                        <ThemedText style={styles.metadataValue}>{recipe.metadata.difficulty}</ThemedText>
                    </View>
                </View>
                
                {recipe.metadata.dietary_tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                        {recipe.metadata.dietary_tags.map((tag, index) => (
                            <View key={index} style={styles.tag}>
                                <ThemedText style={styles.tagText}>{tag}</ThemedText>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Ingredients */}
            <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Ingredients</ThemedText>
                {recipe.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientItem}>
                        <ThemedText style={styles.ingredientText}>
                            <ThemedText style={styles.ingredientQuantity}>
                                {ingredient.quantity !== "Not specified" ? ingredient.quantity : ""}
                            </ThemedText>
                            {ingredient.quantity !== "Not specified" && " "}
                            <ThemedText style={styles.ingredientName}>{ingredient.name}</ThemedText>
                            {ingredient.notes && (
                                <ThemedText style={styles.ingredientNotes}> ({ingredient.notes})</ThemedText>
                            )}
                        </ThemedText>
                    </View>
                ))}
            </View>

            {/* Equipment */}
            <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Equipment Needed</ThemedText>
                <View style={styles.equipmentContainer}>
                    {recipe.equipment.map((item, index) => (
                        <View key={index} style={styles.equipmentItem}>
                            <ThemedText style={styles.equipmentText}>• {item}</ThemedText>
                        </View>
                    ))}
                </View>
            </View>

            {/* Instructions */}
            <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Instructions</ThemedText>
                {recipe.steps.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                        <View style={styles.stepNumber}>
                            <ThemedText style={styles.stepNumberText}>{step.step}</ThemedText>
                        </View>
                        <View style={styles.stepContent}>
                            <ThemedText style={styles.stepInstruction}>{step.instruction}</ThemedText>
                            {(step.time || step.temperature) && (
                                <View style={styles.stepMeta}>
                                    {step.time && (
                                        <ThemedText style={styles.stepMetaText}>⏱️ {step.time}</ThemedText>
                                    )}
                                    {step.temperature && (
                                        <ThemedText style={styles.stepMetaText}>🌡️ {step.temperature}</ThemedText>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </View>

            {/* Tips */}
            {recipe.tips.length > 0 && (
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Tips & Notes</ThemedText>
                    {recipe.tips.map((tip, index) => (
                        <View key={index} style={styles.tipItem}>
                            <ThemedText style={styles.tipText}>💡 {tip}</ThemedText>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}