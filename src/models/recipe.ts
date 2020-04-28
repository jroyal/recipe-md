interface RecipeIngredient {
  amount: string;
  unit: string;
  name: string;
  notes?: string;
}

interface RecipeIngredientGroup {
  name?: string;
  ingredients: RecipeIngredient[];
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
  url: string;
  meta: RecipeMeta;
  details: RecipeDetails;
  ingredientGroups: RecipeIngredientGroup[];
  instructions: string[];
  notes?: string[];

  // for mustache
  formatIngredient?: () => string;
}

export {
  Recipe,
  RecipeMeta,
  RecipeDetails,
  RecipeIngredient,
  RecipeIngredientGroup,
};
