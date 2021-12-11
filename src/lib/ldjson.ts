/**
 * Should parse all things that use ld+json
 */
import {
  RecipeDetails,
  RecipeInstructionGroup,
  RecipeIngredientGroup,
  RecipeMeta,
  RecipeParser,
  Recipe,
} from './recipe'

export class LDJsonParser implements RecipeParser {
  data: any
  url: string

  constructor(url: string, scrapped: string) {
    this.url = url
    console.log('scrappedInput', scrapped)
    let data = JSON.parse(scrapped)
    if (Array.isArray(data) && data.length > 0) {
      data = data[0]
    }
    if (data['@graph']) {
      let recipeBlock = data['@graph'].find(
        (elem: any) => elem['@type'] === 'Recipe',
      )
      if (recipeBlock) {
        this.data = recipeBlock
      }
    } else {
      this.data = data
    }

    console.log(JSON.stringify(this.data, null, 2))
  }

  getName() {
    return this.data.name.trim()
  }

  getSummary() {
    return this.data.description.trim()
  }

  getServings() {
    return this.data.recipeYield
  }

  getTime(type: string) {
    return this.data[type]
  }

  getImage(): string {
    return this.data.image.url
  }

  getMeta(): RecipeMeta {
    let author = this.data.author
    if (Array.isArray(author)) {
      author = author[0]
    }
    return {
      author: author.name,
      published: this.data.datePublished,
      image: this.getImage(),
    }
  }

  getDetails(): RecipeDetails {
    return {
      preptime: this.getTime('prepTime'),
      cooktime: this.getTime('cookTime'),
      totaltime: this.getTime('totalTime'),
      servings: this.getServings(),
    }
  }

  getIngredients(): RecipeIngredientGroup[] {
    const ingredients: RecipeIngredientGroup[] = []

    const ingredeintGroup: RecipeIngredientGroup = { name: '', ingredients: [] }

    ingredeintGroup.ingredients = ingredeintGroup.ingredients.concat(
      this.data.recipeIngredient.map((ingredient: any) => {
        return { name: ingredient }
      }),
    )
    ingredients.push(ingredeintGroup)
    return ingredients
  }

  getInstructions(): RecipeInstructionGroup[] {
    const instructions: RecipeInstructionGroup[] = []

    const instructionGroup: RecipeInstructionGroup = {
      name: '',
      instructions: [],
    }

    instructionGroup.instructions = instructionGroup.instructions.concat(
      this.data.recipeInstructions.map((instruction: any) => {
        return instruction.text
      }),
    )
    instructions.push(instructionGroup)
    return instructions
  }

  getNotes(): string[] {
    //todo: figure out how to get this. Not sure if its actually included in the ld-json
    return []
  }

  getRecipe(): Recipe {
    return {
      name: this.getName(),
      summary: this.getSummary(),
      url: this.url,
      meta: this.getMeta(),
      details: this.getDetails(),
      ingredientGroups: this.getIngredients(),
      instructionGroups: this.getInstructions(),
      notes: this.getNotes(),
    }
  }
}
