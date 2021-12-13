import { Router } from 'itty-router'
import { handler as ParseRecipeHandler } from './src/handlers/parse_recipe'
import { handler as ReturnRecipeHandler } from './src/handlers/return_recipe'
import { handler as KVLoaderHandler } from './src/handlers/kv_loader'

const router = Router()

router.get('/parse_recipe', ParseRecipeHandler)
router.get('/recipe/:code', ReturnRecipeHandler)
router.all('*', KVLoaderHandler)

// attach the router "handle" to the event handler
addEventListener('fetch', (event: FetchEvent) =>
  event.respondWith(router.handle(event.request, event)),
)
