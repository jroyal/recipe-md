import { Recipe } from './recipe'
import { recipeTemplate } from '../templates/recipe.md'
import Mustache from 'mustache'
import MarkdownIt from 'markdown-it'

interface StoredMarkdown {
  markdown: string
  html: string
}

async function generateMarkdown(recipe: Recipe): Promise<string> {
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

function generateMarkdownHTML(markdown: string) {
  const md = new MarkdownIt({
    html: true,
  })

  return md.render(markdown)
}

export { generateMarkdown, generateMarkdownHTML, StoredMarkdown }
