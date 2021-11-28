class RecipeParserHandler {
  //@ts-ignore
  element(element) {}
}

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const recipeURL = url.searchParams.get('recipe_url')
  if (!recipeURL) {
    return new Response('please include a url in recipe_url', { status: 400 })
  }

  // const resp = await fetch(recipeURL)
  // const parser = new RecipeParserHandler()
  // const body = await new HTMLRewriter().on()

  return new Response('heyo james')
}

export { handler }
