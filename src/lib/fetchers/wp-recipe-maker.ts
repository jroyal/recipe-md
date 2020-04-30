/**
 * Should parse all blogs using https://bootstrapped.ventures/wp-recipe-maker/
 */
import {
  RecipeDetails,
  RecipeInstructionGroup,
  RecipeIngredientGroup,
  RecipeMeta,
  RecipeFetcher,
} from "../../models/recipe";
import cheerio from "cheerio";
import { humanizeTime } from "../time";

export const selector = "div[class=wprm-recipe-container]";

export class WPRMFetcher implements RecipeFetcher {
  recipeContainer: Cheerio;

  constructor(container: Cheerio) {
    this.recipeContainer = container;
  }

  getName() {
    return this.recipeContainer.find(".wprm-recipe-name").text();
  }

  getSummary() {
    return this.recipeContainer.find(".wprm-recipe-summary").text();
  }

  getServings() {
    const amount = this.recipeContainer.find(".wprm-recipe-servings").text();
    const unit = this.recipeContainer.find(".wprm-recipe-servings-unit").text();
    return `${amount} ${unit}`;
  }

  getMetaItem(container: Cheerio, tag: string) {
    return container.find(`meta[itemprop=${tag}]`).attr("content");
  }

  getMeta(): RecipeMeta {
    return {
      author: this.getMetaItem(this.recipeContainer, "author"),
      published: this.getMetaItem(this.recipeContainer, "datePublished"),
      image: this.getMetaItem(this.recipeContainer, "image"),
    };
  }

  getDetails(): RecipeDetails {
    return {
      preptime: humanizeTime(
        this.getMetaItem(this.recipeContainer, "prepTime")
      ),
      cooktime: humanizeTime(
        this.getMetaItem(this.recipeContainer, "cookTime")
      ),
      totaltime: humanizeTime(
        this.getMetaItem(this.recipeContainer, "totalTime")
      ),
      servings: this.getServings(),
    };
  }

  getIngredients(): RecipeIngredientGroup[] {
    const ingredients: RecipeIngredientGroup[] = [];
    this.recipeContainer
      .find(".wprm-recipe-ingredient-group")
      .each((_, groupElem) => {
        const group = cheerio(groupElem);
        const groupName = group
          .find(".wprm-recipe-ingredient-group-name")
          .text();
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

  getInstructions(): RecipeInstructionGroup[] {
    const instructions: RecipeInstructionGroup[] = [];

    this.recipeContainer
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
          if (instructionGroup.instructions.length == 0) {
            findInstructions("div[itemprop=recipeInstructions]");
          }
        });
        instructions.push(instructionGroup);
      });
    return instructions;
  }

  getNotes(): string[] {
    const notes: string[] = [];
    this.recipeContainer
      .find("div[class=wprm-recipe-notes-container] p")
      .each((_, elem) => {
        notes.push(cheerio(elem).text());
      });
    return notes;
  }
}
