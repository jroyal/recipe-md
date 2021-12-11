import Scraper from '../lib/scraper'

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

  const result = await scraper
    .querySelector('script[type="application/ld+json"]')
    .getText({})

  console.log(JSON.stringify(result))

  // const parser = new RecipeParserHandler()
  // const body = await new HTMLRewriter().on()

  return new Response(`heyo james ${JSON.stringify(result)}`)
}

export { handler }
