interface RecipeIngredient {
  amount: string;
  unit: string;
  name: string;
  notes?: string;
}

interface RecipeDetails {
  preptime: string;
  cooktime: string;
  totaltime: string;
  servings: string;
}

interface RecipeMeta {
  author: string;
  published: string;
  image: string;
}

interface Recipe {
  name: string;
  summary: string;
  meta: RecipeMeta;
  details: RecipeDetails;
  ingredients: RecipeIngredient[];
  instructions: string[];
  notes?: string[];
}

export { Recipe, RecipeMeta, RecipeDetails, RecipeIngredient };
