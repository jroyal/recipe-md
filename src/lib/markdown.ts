import { Recipe } from "../models/recipe";
import { loadFile } from "./load";
import path from "path";
import Mustache from "mustache";

export async function generateMarkdown(recipe: Recipe): Promise<string> {
  const template = await loadFile(path.join(__dirname, "templates/recipe.md"));
  recipe.formatIngredient = function () {
    let result = this.name;
    result = this.unit ? `${this.unit} ${result}` : result;
    result = this.amount ? `${this.amount} ${result}` : result;
    result = this.notes ? `${result} ${this.notes}` : result;
    return result;
  };
  return Mustache.render(template, recipe);
}
