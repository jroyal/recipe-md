import { loadURLToCheerio } from "./load";
import { Recipe, RecipeFetcher } from "../models/recipe";
import { getFetcher } from "./fetchers";

export async function parseRecipe(url: string): Promise<Recipe> {
  const $ = await loadURLToCheerio(url);

  let fetcher: RecipeFetcher = getFetcher($);

  return {
    name: fetcher.getName(),
    summary: fetcher.getSummary(),
    url: url,
    meta: fetcher.getMeta(),
    details: fetcher.getDetails(),
    ingredientGroups: fetcher.getIngredients(),
    instructionGroups: fetcher.getInstructions(),
    notes: fetcher.getNotes(),
  };
}
