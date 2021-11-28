import { Request, Response } from "express";
import { parseRecipe } from "../lib/recipe";
import { generateMarkdown } from "../lib/markdown";
import { generateCode, CACHE } from "../lib/cache";
import MarkdownIt from "markdown-it";

export const index = (req: Request, res: Response) => {
  res.render("index", {
    title: "Markdown MD",
  });
};

export const returnRecipe = async (req: Request, res: Response) => {
  const code = req.params.short_code;

  const data = CACHE[code];
  if (data) {
    res.render("markdown", data);
    return;
  }
  return res.status(404).send("unknown url");
};

export const parseRecipeHandler = async (req: Request, res: Response) => {
  try {
    const url = req.query.recipe_url;
    if (!url) {
      return res.status(400).send("please enter a url");
    }
    const recipe = await parseRecipe(url as string);
    const markdown = await generateMarkdown(recipe);

    const md = new MarkdownIt({
      html: true,
    });

    const markdownHTML = md.render(markdown);
    const code = generateCode(url as string);
    CACHE[code] = {
      markdown: markdown,
      markdownHTML: markdownHTML,
    };
    return res.redirect(`/${code}`);
  } catch (e) {
    console.log(e);
    return res.status(500).send("something went wrong");
  }
};
