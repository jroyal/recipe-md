import cheerio from "cheerio";
import { loadURLToCheerio } from "./load";
import {
  Recipe,
  RecipeDetails,
  RecipeIngredient,
  RecipeInstructionGroup,
  RecipeIngredientGroup,
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

function getIngredients(recipeContainer: Cheerio): RecipeIngredientGroup[] {
  const ingredients: RecipeIngredientGroup[] = [];
  recipeContainer.find(".wprm-recipe-ingredient-group").each((_, groupElem) => {
    const group = cheerio(groupElem);
    const groupName = group.find(".wprm-recipe-ingredient-group-name").text();
    const ingredientGroup: RecipeIngredientGroup = {
      name: groupName,
      ingredients: [],
    };
    group.find("li[class=wprm-recipe-ingredient]").each((_, elem) => {
      const li = cheerio(elem);
      ingredientGroup.ingredients.push({
        amount: li.find(".wprm-recipe-ingredient-amount").text(),
        unit: li.find(".wprm-recipe-ingredient-unit").text(),
        name: li.find(".wprm-recipe-ingredient-name").text(),
        notes: li.find(".wprm-recipe-ingredient-notes").text(),
      });
    });
    ingredients.push(ingredientGroup);
  });
  return ingredients;
}

function getInstructions(recipeContainer: Cheerio): RecipeInstructionGroup[] {
  const instructions: RecipeInstructionGroup[] = [];

  recipeContainer
    .find(".wprm-recipe-instruction-group")
    .each((_, groupElem) => {
      const group = cheerio(groupElem);
      const groupName = group
        .find(".wprm-recipe-instruction-group-name")
        .text();
      const instructionGroup: RecipeInstructionGroup = {
        name: groupName,
        instructions: [],
      };
      group.find("li[class=wprm-recipe-instruction]").each((_, elem) => {
        let findInstructions = (selector: string) => {
          group.find(selector).each((_, elem) => {
            let text = cheerio(elem).text();
            text = text.replace(/^\W*\d+\./gm, "").trim();
            instructionGroup.instructions.push(text);
          });
        };
        findInstructions("div[itemprop=recipeInstructions] p");
        findInstructions("div[itemprop=recipeInstructions]");
      });
      instructions.push(instructionGroup);
    });
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
    ingredientGroups: getIngredients(recipeContainer),
    instructionGroups: getInstructions(recipeContainer),
    notes: getNotes(recipeContainer),
  };
}
