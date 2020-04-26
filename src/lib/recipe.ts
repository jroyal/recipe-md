import cheerio from "cheerio";
import { loadURLToCheerio } from "./load";
import {
  Recipe,
  RecipeDetails,
  RecipeIngredient,
  RecipeMeta,
} from "../models/recipe";

function getName(recipeContainer: Cheerio) {
  return recipeContainer.find(".wprm-recipe-name").text();
}

function getSummary(recipeContainer: Cheerio) {
  return recipeContainer.find(".wprm-recipe-summary").text();
}

function getServings(recipeContainer: Cheerio) {
  const amount = recipeContainer.find(".wprm-recipe-servings").text();
  const unit = recipeContainer.find(".wprm-recipe-servings-unit").text();
  return `${amount} ${unit}`;
}

function getMetaItem(container: Cheerio, tag: string) {
  return container.find(`meta[itemprop=${tag}]`).attr("content");
}

function getMeta(recipeContainer: Cheerio): RecipeMeta {
  return {
    author: getMetaItem(recipeContainer, "author"),
    published: getMetaItem(recipeContainer, "datePublished"),
    image: getMetaItem(recipeContainer, "image"),
  };
}

function getDetails(recipeContainer: Cheerio): RecipeDetails {
  return {
    preptime: getMetaItem(recipeContainer, "prepTime"),
    cooktime: getMetaItem(recipeContainer, "cookTime"),
    totaltime: getMetaItem(recipeContainer, "totalTime"),
    servings: getServings(recipeContainer),
  };
}

function getIngredients(recipeContainer: Cheerio): RecipeIngredient[] {
  const ingredients: RecipeIngredient[] = [];
  recipeContainer.find("li[class=wprm-recipe-ingredient]").each((_, elem) => {
    const li = cheerio(elem);
    ingredients.push({
      amount: li.find(".wprm-recipe-ingredient-amount").text(),
      unit: li.find(".wprm-recipe-ingredient-unit").text(),
      name: li.find(".wprm-recipe-ingredient-name").text(),
      notes: li.find(".wprm-recipe-ingredient-notes").text(),
    });
  });
  return ingredients;
}

function getInstructions(recipeContainer: Cheerio): string[] {
  const ingredients: string[] = [];
  recipeContainer.find("div[itemprop=recipeInstructions] p").each((_, elem) => {
    let text = cheerio(elem).text();
    text = text.replace(/^\W*\d+\./gm, "").trim();
    ingredients.push(text);
  });
  return ingredients;
}

function getNotes(recipeContainer: Cheerio): string[] {
  const notes: string[] = [];
  recipeContainer
    .find("div[class=wprm-recipe-notes-container] p")
    .each((_, elem) => {
      notes.push(cheerio(elem).text());
    });
  return notes;
}

export async function parseRecipe(url: string): Promise<Recipe> {
  const $ = await loadURLToCheerio(url);
  const recipeContainer = $("div[class=wprm-recipe-container]");

  return {
    name: getName(recipeContainer),
    summary: getSummary(recipeContainer),
    meta: getMeta(recipeContainer),
    details: getDetails(recipeContainer),
    ingredients: getIngredients(recipeContainer),
    instructions: getInstructions(recipeContainer),
    notes: getNotes(recipeContainer),
  };
}
