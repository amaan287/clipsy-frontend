export interface Ingredient {
  name: string;
  quantity: string;
  notes?: string | null;
}

export interface Step {
  step: number;
  instruction: string;
  time?: string | null;
  temperature?: string | null;
}

export interface Metadata {
  servings: string;
  prep_time: string;
  cook_time: string;
  total_time: string;
  difficulty: string;
  cuisine: string;
  dietary_tags: string[];
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  metadata: Metadata;
  equipment: string[];
  tips: string[];
  ocrExtractedInfo: string;
  channelName: string;
  savedDate: string;
  isRecipe: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface RecipeApiResponse {
  success: boolean;
  message: string;
  recipe_id?: string | null;
  recipe_data: {
    recipes: Recipe[];
  };
  error?: string | null;
}
