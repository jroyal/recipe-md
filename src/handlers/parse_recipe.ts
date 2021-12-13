import Scraper from '../lib/scraper'
import { LDJsonParser } from '../lib/ldjson'
import { generateMarkdown, generateMarkdownHTML } from '../lib/markdown'
import { hash } from '../lib/hash'
import { generateCode, getExistingCode, storeRecipe } from '../lib/storage'

async function handler(request: Request, event: FetchEvent): Promise<Response> {
  const url = new URL(request.url)
  const recipeURL = url.searchParams.get('recipe_url')
  if (!recipeURL) {
    return new Response('please include a url in recipe_url', { status: 400 })
  }

  const urlHash = await hash(recipeURL)
  const existingRecipeCode = await getExistingCode(urlHash)
  if (existingRecipeCode) {
    return new Response(`/${existingRecipeCode}`, {
      status: 302,
      headers: { location: `/recipe/${existingRecipeCode}` },
    })
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
  const recipeData = parser.getRecipe()
  const markdown = await generateMarkdown(recipeData)
  const markdownHTML = generateMarkdownHTML(markdown)

  const code = await generateCode(urlHash)
  await storeRecipe(code, { markdown, html: markdownHTML })

  return new Response(`/${code}`, {
    status: 302,
    headers: { location: `/recipe/${code}` },
  })
}

export { handler }
