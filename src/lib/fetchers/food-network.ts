/**
 * Should parse all things on foodnetwork.com
 */
import {
  RecipeDetails,
  RecipeInstructionGroup,
  RecipeIngredientGroup,
  RecipeMeta,
  RecipeFetcher,
} from "../../models/recipe";
import { humanizeTime } from "../time";

export const selector = "script[type=\"application/ld+json\"]";

export class FoodNetworkFetcher implements RecipeFetcher {
  recipeContainer: Cheerio;
  data: any;

  constructor(container: Cheerio) {
    this.recipeContainer = container;
    const data = JSON.parse(container.html());
    if (data.length > 1) {
      this.data = data[0];
    }
    delete this.data.review;
    console.log(JSON.stringify(this.data, null, 2));
  }

  getName() {
    return this.data.name.trim();
  }

  getSummary() {
    return this.data.description.trim();
  }

  getServings() {
    return this.data.recipeYield;
  }

  getTime(type: string) {
    return humanizeTime(this.data[type]);
  }

  getImage(): string {
    return this.data.image.url;
  }

  getMeta(): RecipeMeta {
    return {
      author: this.data.author[0].name,
      published: this.data.datePublished,
      image: this.getImage(),
    };
  }

  getDetails(): RecipeDetails {
    return {
      preptime: this.getTime("prepTime"),
      cooktime: this.getTime("cookTime"),
      totaltime: this.getTime("totalTime"),
      servings: this.getServings(),
    };
  }

  getIngredients(): RecipeIngredientGroup[] {
    const ingredients: RecipeIngredientGroup[] = [];

    const ingredeintGroup: RecipeIngredientGroup = { name: "", ingredients: [] };

    ingredeintGroup.ingredients = ingredeintGroup.ingredients.concat(
      this.data.recipeIngredient.map((ingredient: any) => {
        return { name: ingredient };
      })
    );
    ingredients.push(ingredeintGroup);
    return ingredients;
  }

  getInstructions(): RecipeInstructionGroup[] {
    const instructions: RecipeInstructionGroup[] = [];

    const instructionGroup: RecipeInstructionGroup = {
      name: "",
      instructions: [],
    };

    instructionGroup.instructions = instructionGroup.instructions.concat(
      this.data.recipeInstructions.map((instruction: any) => {
        return instruction.text;
      })
    );
    instructions.push(instructionGroup);
    return instructions;
  }

  getNotes(): string[] {
    //todo: figure out how to get this. Not sure if its actually included in the ld-json
    return [];
  }
}
