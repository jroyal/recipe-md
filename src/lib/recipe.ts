interface RecipeIngredient {
  amount: string
  unit: string
  name: string
  notes?: string
}

interface RecipeIngredientGroup {
  name?: string
  ingredients: RecipeIngredient[]
}

interface RecipeInstructionGroup {
  name?: string
  instructions: string[]
}

interface RecipeDetails {
  preptime: string
  cooktime: string
  totaltime: string
  servings: string
}

interface RecipeMeta {
  author: string
  published: string
  image: string
}

interface Recipe {
  name: string
  summary: string
  url: string
  meta: RecipeMeta
  details: RecipeDetails
  ingredientGroups: RecipeIngredientGroup[]
  instructionGroups: RecipeInstructionGroup[]
  notes?: string[]

  // for mustache
  formatIngredient?: () => string
}

interface RecipeParser {
  getInstructions(): RecipeInstructionGroup[]
  getIngredients(): RecipeIngredientGroup[]
  getDetails(): RecipeDetails
  getMeta(): RecipeMeta
  getSummary(): string
  getName(): string
  getNotes(): string[]

  getRecipe(): Recipe
}

export {
  Recipe,
  RecipeMeta,
  RecipeDetails,
  RecipeIngredient,
  RecipeIngredientGroup,
  RecipeInstructionGroup,
  RecipeParser,
}
