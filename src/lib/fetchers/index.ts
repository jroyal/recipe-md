import { WPRMFetcher, selector as WPRMSelector } from "./wp-recipe-maker";
import { TastyFetcher, selector as TastySelector } from "./wp-tasty";
import {
  FoodNetworkFetcher,
  selector as FoodNetworkSelector,
} from "./food-network";
import { RecipeFetcher } from "../../models/recipe";

const fetchers: {
  [selector: string]: { new (...args: any[]): RecipeFetcher };
} = {
  [TastySelector]: TastyFetcher,
  [WPRMSelector]: WPRMFetcher,
  [FoodNetworkSelector]: FoodNetworkFetcher,
};

function getFetcher($: CheerioStatic): RecipeFetcher {
  for (const selector in fetchers) {
    const recipeContainer = $(selector);
    if (recipeContainer.length) {
      return new fetchers[selector](recipeContainer);
    }
  }

  throw new Error("no fetcher found");
}

export { getFetcher };
