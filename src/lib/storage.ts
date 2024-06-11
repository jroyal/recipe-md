import { StoredMarkdown } from './markdown'
function generateCodeKey(urlHash: string) {
  return `recipe_code_${urlHash}`
}

function generateRecipeKey(code: string) {
  return `recipe_${code}`
}

async function generateCode(kv: KVNamespace, urlHash: string) {
  let code = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  await kv.put(generateCodeKey(urlHash), code)
  return code
}

async function getExistingCode(kv: KVNamespace, urlHash: string) {
  return await kv.get(generateCodeKey(urlHash))
}

async function storeRecipe(kv: KVNamespace, code: string, markdown: StoredMarkdown) {
  return await kv.put(`recipe_${code}`, JSON.stringify(markdown))
}

async function getRecipe(kv: KVNamespace, code: string): Promise<StoredMarkdown | null> {
  return await kv.get(generateRecipeKey(code), 'json')
}

export { generateCode, getExistingCode, getRecipe, storeRecipe }
