import Scraper from '../lib/scraper'
import { LDJsonParser } from '../lib/ldjson'
import { generateMarkdown } from '../lib/markdown'
import { Recipe } from '../lib/recipe'
class RecipeParserHandler {
  //@ts-ignore
  element(element) {}
}

async function handler(request: Request, event: FetchEvent): Promise<Response> {
  const url = new URL(request.url)
  const recipeURL = url.searchParams.get('recipe_url')
  if (!recipeURL) {
    return new Response('please include a url in recipe_url', { status: 400 })
  }

  let scraper: Scraper
  let resp: Response
  let input = ''
  if (recipeURL == 'test1') {
    // Get some preloaded test HTML from workers kv instead of fetching them off the internet
    input = (await RECIPEMD.get('test1', 'text')) || ''
    resp = new Response(input, {
      status: 200,
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    })
    scraper = await new Scraper(event, { resp })
  } else {
    scraper = await (await new Scraper(event, {})).fetch(recipeURL)
  }

  const selector = 'script[type="application/ld+json"]'
  const result = await scraper.querySelector(selector).getText({})

  if (!result[selector]) {
    return new Response('failed to parse the recipe')
  }

  let data = result[selector]

  let parser = new LDJsonParser(url.toString(), data)

  return new Response(`${await generateMarkdown(parser.getRecipe())}`)
}

export { handler }
