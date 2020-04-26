import { Request, Response } from "express";
import { parseRecipe } from "../lib/recipe";
import { generateMarkdown } from "../lib/markdown";

export const index = (req: Request, res: Response) => {
  res.render("index", {
    title: "Home",
  });
};

export const parseRecipeHandler = async (req: Request, res: Response) => {
  const url = req.query.recipe_url;
  const recipe = await parseRecipe(url as string);
  const markdown = await generateMarkdown(recipe);
  res.render("markdown", {
    markdown: markdown,
  });
};
