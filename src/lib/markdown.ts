import { Recipe } from "../models/recipe";
import { loadFile } from "./load";
import path from "path";
import Mustache from "mustache";

export async function generateMarkdown(recipe: Recipe): Promise<string> {
  const template = await loadFile(path.join(__dirname, "templates/recipe.md"));
  return Mustache.render(template, recipe);
}
