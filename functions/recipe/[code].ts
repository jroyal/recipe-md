import { Env } from '../_env'
import { getRecipe } from '../../src/lib/storage'
import { StoredMarkdown } from '../../src/lib/markdown'

const HTMLBody = `<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title></title>
    <meta name="description" content="" />
    <link rel="shortcut icon" href="/images/favicon.png" />
    <!-- Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>-->
    <link rel="stylesheet" href="/css/main.css" />
    <link rel="stylesheet" href="/css/github-markdown.css" />
  </head>
  <body>
    <div class="container">
      <div class="tabs">
        <input class="radioInput" type="radio" id="radio-1" name="tabs" /><label
          class="tab"
          for="radio-1"
          >Rendered</label
        ><input
          class="radioInput"
          type="radio"
          id="radio-2"
          name="tabs"
        /><label class="tab" for="radio-2">Raw</label
        ><span class="glider"></span>
      </div>
      <button class="clean" id="clickToCopyBtn" onclick="clickToCopy()" hidden>Click to Copy</button>
    </div>
    <div class="markdown-container">
      <div class="raw-markdown" id="raw-markdown" hidden>
        <pre id="markdown-raw">RAW</pre>
      </div>
      <div class="markdown markdown-body" id="markdown">
        <div id="markdown-html">HTML</div>
      </div>
    </div>
    <script>
      document.addEventListener('click', function (event) {
        if (event.target && event.target.matches("input[name='tabs']")) {
          if (event.target.id === 'radio-1') {
            document.getElementById('markdown').removeAttribute('hidden')
            document.getElementById('raw-markdown').setAttribute('hidden', true)
            document.getElementById('clickToCopyBtn').setAttribute('hidden', true)
          } else if (event.target.id === 'radio-2') {
            document.getElementById('markdown').setAttribute('hidden', true)
            document.getElementById('raw-markdown').removeAttribute('hidden')
            document.getElementById('clickToCopyBtn').removeAttribute('hidden')
          }
        }
      })
      function clickToCopy() {
        var copyText = document.getElementById("markdown-raw");
        navigator.clipboard.writeText(copyText.textContent);
      }
    </script>
  </body>
</html>`
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

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const code = ctx.params.code as string
  const kv = ctx.env.RECIPEMD
  if (!code) {
    return new Response('oops, we are missing the code we should fetch')
  }
  const recipe = await getRecipe(kv, code)
  if (!recipe) {
    return new Response(`could not find recipe for ${code}`, { status: 404 })
  }

  // get the recipe html template from KV
  const resp = new Response(HTMLBody, {headers: {'content-type': 'text/html'}})

  // modify the HTML on the way out to include the recipe markdown that was saved
  const mdHandler = new MarkdownHandler(recipe)
  return new HTMLRewriter()
    .on(rawMarkdownSelector, mdHandler)
    .on(htmlMarkdownSelector, mdHandler)
    .transform(resp)
}
