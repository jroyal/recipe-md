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
import { parseISO8601Duration } from './time'

export class LDJsonParser implements RecipeParser {
  data: any
  url: string

  constructor(url: string, scrapped: string) {
    this.url = url
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
    let image = this.data.image
    if (Array.isArray(image) && image.length > 0) {
      return image[0]
    }
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
      preptime: parseISO8601Duration(this.getTime('prepTime')),
      cooktime: parseISO8601Duration(this.getTime('cookTime')),
      totaltime: parseISO8601Duration(this.getTime('totalTime')),
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
    const nonStructuredSteps = []
    for (const elem of this.data.recipeInstructions) {
      if (elem['@type'] == 'HowToSection') {
        instructions.push(processHowToSection(elem))
      } else {
        nonStructuredSteps.push(...processHowToStep(elem))
      }
    }
    if (nonStructuredSteps) {
      instructions.push({ name: '', instructions: nonStructuredSteps })
    }

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

function processHowToSection(data: any): RecipeInstructionGroup {
  // for right now assume that there are no sub sections
  const instructions = data.itemListElement
    .map((elem: any) => processHowToStep(elem))
    .reduce((prev: string[], curr: string[]) => prev.push(...curr))
    .filter(Boolean)
  return {
    name: data.name,
    instructions,
  }
}

function processHowToStep(data: any): string[] {
  // check to see if everything is on the same line
  const multistep = data.text.split(/\d+\. /)
  if (multistep.length > 1) {
    return multistep.filter(Boolean)
  }
  return [data.text]
}
