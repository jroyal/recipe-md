import { Recipe } from './recipe'
import { recipeTemplate } from '../templates/recipe.md'
import Mustache from 'mustache'

export async function generateMarkdown(recipe: Recipe): Promise<string> {
  recipe.formatIngredient = function () {
    let result = this.name
    //@ts-ignore
    result = this.unit ? `${this.unit} ${result}` : result
    // @ts-ignore
    result = this.amount ? `${this.amount} ${result}` : result
    result = this.notes ? `${result} ${this.notes}` : result
    return result
  }
  return Mustache.render(recipeTemplate, recipe)
}
