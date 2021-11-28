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
    return this.recipeContainer.find(".wprm-recipe-name").text().trim();
  }

  getSummary() {
    return this.recipeContainer.find(".wprm-recipe-summary").text().trim();
  }

  getServings() {
    const amount = this.recipeContainer.find(".wprm-recipe-servings").text();
    const unit = this.recipeContainer.find(".wprm-recipe-servings-unit").text();
    return `${amount} ${unit}`;
  }

  getTime(type: string) {
    return (
      this.recipeContainer
        .find(`.wprm-recipe-${type}-time-container .wprm-recipe-time`)
        .text() || humanizeTime(this.getMetaItem(`${type}Time`))
    );
  }

  getMetaItem(tag: string) {
    return this.recipeContainer.find(`meta[itemprop=${tag}]`).attr("content");
  }

  getImage(): string {
    let image = this.getMetaItem("image");
    if (!image) {
      image = this.recipeContainer
        .find(".wprm-recipe-image img")
        .attr("data-src");
    }
    return image;
  }

  getMeta(): RecipeMeta {
    return {
      author: this.getMetaItem("author"),
      published: this.getMetaItem("datePublished"),
      image: this.getImage(),
    };
  }

  getDetails(): RecipeDetails {
    return {
      preptime: this.getTime("prep"),
      cooktime: this.getTime("cook"),
      totaltime: this.getTime("total"),
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
          const li = cheerio(elem);
          const findInstructions = (selector: string) => {
            li.find(selector).each((_, elem) => {
              let text = cheerio(elem).text();
              text = text.replace(/^\W*\d+\./gm, "").trim();
              instructionGroup.instructions.push(text);
            });
          };
          findInstructions(".wprm-recipe-instruction-text");
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
