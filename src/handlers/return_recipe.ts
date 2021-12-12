import { Request } from 'itty-router'
import { getRecipe } from '../lib/storage'
async function handler(request: Request, event: FetchEvent): Promise<Response> {
  const { params } = request
  const code = params?.code

  if (!code) {
    return new Response('oops, we are missing the code we should fetch')
  }
  const recipe = (await getRecipe(code)) as any
  if (!recipe) {
    return new Response(`could not find recipe for ${code}`, { status: 404 })
  }

  return new Response(`looking up recipe ${code}\n${recipe.markdown}`)
}

export { handler }
