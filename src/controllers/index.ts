import { Request, Response } from "express";
import { parseRecipe } from "../parser/recipe";
/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response) => {
  res.render("index", {
    title: "Home",
  });
};

export const parseRecipeHandler = async (req: Request, res: Response) => {
  const url = req.query.recipe_url;
  const recipe = await parseRecipe(url as string);
  res.send(recipe);
};
