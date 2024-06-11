import { Env } from './_env'

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url)
  const recipeURL = url.searchParams.get('recipe_url')
  if (!recipeURL) {
    return new Response('please include a url in recipe_url', { status: 400 })
  }
  return new Response(`parsing recipe`)
}
