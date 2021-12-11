import { Router, Obj } from 'itty-router'
import { handler as ParseRecipeHandler } from './src/handlers/parse_recipe'
import { handler as HomePageHandler } from './src/handlers/home'

const router = Router()

router.get('/parse_recipe', ParseRecipeHandler)
router.get(
  '/recipe/:id',
  async ({ params }) => new Response(`get recipe #${(params as Obj).id}`),
)
router.all('*', HomePageHandler)

// attach the router "handle" to the event handler
addEventListener('fetch', (event: FetchEvent) =>
  event.respondWith(router.handle(event.request, event)),
)
