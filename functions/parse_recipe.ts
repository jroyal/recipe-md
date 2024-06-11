import { Env } from './_env'
import { hash } from '../src/lib/hash'
import Scraper from '../src/lib/scraper'
import { LDJsonParser } from '../src/lib/ldjson'
import { generateMarkdown, generateMarkdownHTML } from '../src/lib/markdown'
import { generateCode, getExistingCode, storeRecipe } from '../src/lib/storage'

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url)
  const recipeURL = url.searchParams.get('recipe_url')
  if (!recipeURL) {
    return new Response('please include a url in recipe_url', { status: 400 })
  }
  
  const urlHash = await hash(recipeURL)
  const existingRecipeCode = await getExistingCode(ctx.env.RECIPEMD, urlHash)
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
    input = (await ctx.env.RECIPEMD.get('test1', 'text')) || ''
    resp = new Response(input, {
      status: 200,
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    })
    scraper = await new Scraper({ resp })
  } else {
    scraper = await (await new Scraper({})).fetch(recipeURL)
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

  const code = await generateCode(ctx.env.RECIPEMD, urlHash)
  await storeRecipe(ctx.env.RECIPEMD, code, { markdown, html: markdownHTML })

  return new Response(`/${code}`, {
    status: 302,
    headers: { location: `/recipe/${code}` },
  })
}
