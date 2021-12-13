import { Request } from 'itty-router'
import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'
import { getRecipe } from '../lib/storage'
import { StoredMarkdown } from '../lib/markdown'

const rawMarkdownSelector = 'pre#markdown-raw'
const htmlMarkdownSelector = 'div#markdown-html'

class MarkdownHandler {
  stored: StoredMarkdown
  constructor(markdown: StoredMarkdown) {
    console.log('setting up the element handler')
    this.stored = markdown
  }

  element(element: Element) {
    console.log('processing the element')
    if (element.tagName == 'pre') {
      element.setInnerContent(this.stored.markdown)
    } else if (element.tagName == 'div') {
      element.setInnerContent(this.stored.html, { html: true })
    }
  }
}

async function handler(request: Request, event: FetchEvent): Promise<Response> {
  const { params } = request
  const code = params?.code

  if (!code) {
    return new Response('oops, we are missing the code we should fetch')
  }
  const recipe = await getRecipe(code)
  if (!recipe) {
    return new Response(`could not find recipe for ${code}`, { status: 404 })
  }

  // get the recipe html template from KV
  const resp = await getAssetFromKV(event, {
    mapRequestToAsset: (request) => {
      let url = new URL(request.url)
      url.pathname = '/recipe.html'
      return mapRequestToAsset(new Request(url.toString(), request))
    },
  })

  // modify the HTML on the way out to include the recipe markdown that was saved
  const mdHandler = new MarkdownHandler(recipe)
  return new HTMLRewriter()
    .on(rawMarkdownSelector, mdHandler)
    .on(htmlMarkdownSelector, mdHandler)
    .transform(resp)
}

export { handler }
