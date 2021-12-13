import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

async function handler(request: Request, event: FetchEvent): Promise<Response> {
  try {
    return await getAssetFromKV(event)
  } catch (e) {
    let pathname = new URL(event.request.url).pathname
    return new Response(`"${pathname}" not found`, {
      status: 404,
      statusText: 'not found',
    })
  }
}

export { handler }
