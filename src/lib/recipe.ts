import cheerio from "cheerio";
import { loadURLToCheerio } from "./load";
import {
  Recipe,
  RecipeDetails,
  RecipeIngredient,
  RecipeMeta,
} from "../models/recipe";
import moment from "moment";

function humanizeTime(dur: string) {
  return moment.duration(dur).humanize();
}
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
    preptime: humanizeTime(getMetaItem(recipeContainer, "prepTime")),
    cooktime: humanizeTime(getMetaItem(recipeContainer, "cookTime")),
    totaltime: humanizeTime(getMetaItem(recipeContainer, "totalTime")),
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
  const instructions: string[] = [];

  let findInstructions = (selector: string) => {
    recipeContainer.find(selector).each((_, elem) => {
      let text = cheerio(elem).text();
      text = text.replace(/^\W*\d+\./gm, "").trim();
      instructions.push(text);
    });
  };
  findInstructions("div[itemprop=recipeInstructions] p");
  findInstructions("div[itemprop=recipeInstructions]");
  return instructions;
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
    url: url,
    meta: getMeta(recipeContainer),
    details: getDetails(recipeContainer),
    ingredients: getIngredients(recipeContainer),
    instructions: getInstructions(recipeContainer),
    notes: getNotes(recipeContainer),
  };
}
