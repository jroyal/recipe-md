/**
 * Should parse all blogs using https://www.wptasty.com/
 */
import {
  RecipeDetails,
  RecipeInstructionGroup,
  RecipeIngredientGroup,
  RecipeMeta,
  RecipeFetcher,
} from "../../models/recipe";
import cheerio from "cheerio";

export const selector = "div .tasty-recipes";

export class TastyFetcher implements RecipeFetcher {
  recipeContainer: Cheerio;

  constructor(container: Cheerio) {
    this.recipeContainer = container;
  }

  getName() {
    return this.recipeContainer.find(".tasty-recipes-header-content h2").text();
  }

  getSummary() {
    return this.recipeContainer.find(".tasty-recipes-description p").text();
  }

  getMeta(): RecipeMeta {
    return {
      author: this.recipeContainer.find(".tasty-recipes-author-name").text(),
      // todo: figure out if they ever put the date in the recipe container
      published: this.recipeContainer.find("time.entry-date.published").text(),
      image: this.recipeContainer.find(".tasty-recipes-image img").attr("src"),
    };
  }

  getDetails(): RecipeDetails {
    return {
      preptime: this.recipeContainer.find(".tasty-recipes-prep-time").text(),
      cooktime: this.recipeContainer.find(".tasty-recipes-cook-time").text(),
      totaltime: this.recipeContainer.find(".tasty-recipes-total-time").text(),
      servings: this.recipeContainer.find(".tasty-recipes-yield").text(),
    };
  }

  getIngredients(): RecipeIngredientGroup[] {
    const ingredients: RecipeIngredientGroup[] = [];
    this.recipeContainer
      .find(".tasty-recipes-ingredients ul")
      .each((_, groupElem) => {
        const group = cheerio(groupElem);
        const groupName = group.prev("h4, h3").text();
        const ingredientGroup: RecipeIngredientGroup = {
          name: groupName,
          ingredients: [],
        };
        group.find("li").each((_, elem) => {
          const li = cheerio(elem);
          // TODO: Figure out if its worth splitting these out
          // const span = li.children("span");
          // let amount = span.attr("data-amount");
          // let unit = span.attr("data-unit");
          // let name = li.text().replace(`${amount} ${unit}`, "");
          ingredientGroup.ingredients.push({
            amount: "",
            unit: "",
            name: li.text(),
          });
        });
        ingredients.push(ingredientGroup);
      });
    return ingredients;
  }

  getInstructions(): RecipeInstructionGroup[] {
    const instructions: RecipeInstructionGroup[] = [];

    this.recipeContainer
      .find(".tasty-recipes-instructions ol")
      .each((_, groupElem) => {
        const group = cheerio(groupElem);
        const groupName = group.prev("h4, h3").text();
        const instructionGroup: RecipeInstructionGroup = {
          name: groupName,
          instructions: [],
        };
        group.find("li").each((_, elem) => {
          const li = cheerio(elem);
          instructionGroup.instructions.push(li.text());
        });
        instructions.push(instructionGroup);
      });
    return instructions;
  }

  getNotes(): string[] {
    const notes: string[] = [];
    this.recipeContainer.find(".tasty-recipes-notes li").each((_, elem) => {
      notes.push(cheerio(elem).text());
    });
    return notes;
  }
}
