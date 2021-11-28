import { Router, Obj } from 'itty-router'
import { handler as ParseRecipeHandler } from './handlers/parse_recipe'

// now let's create a router (note the lack of "new")
const router = Router()

// GET collection index
router.get('/', async () => new Response('Home page'))

// POST to the collection (we'll use async here)
router.get('/parse_recipe', ParseRecipeHandler)

// GET item
router.get(
  '/:id',
  async ({ params }) => new Response(`get recipe #${(params as Obj).id}`),
)

// 404 for everything else
router.all('*', async () => new Response('Not Found.', { status: 404 }))

// attach the router "handle" to the event handler
addEventListener('fetch', (event) =>
  event.respondWith(router.handle(event.request)),
)
