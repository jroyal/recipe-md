import { StoredMarkdown } from './markdown'
function generateCodeKey(urlHash: string) {
  return `recipe_code_${urlHash}`
}

function generateRecipeKey(code: string) {
  return `recipe_${code}`
}

async function generateCode(urlHash: string) {
  let code = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  await RECIPEMD.put(generateCodeKey(urlHash), code)
  return code
}

async function getExistingCode(urlHash: string) {
  return await RECIPEMD.get(generateCodeKey(urlHash))
}

async function storeRecipe(code: string, markdown: StoredMarkdown) {
  return await RECIPEMD.put(`recipe_${code}`, JSON.stringify(markdown))
}

async function getRecipe(code: string): Promise<StoredMarkdown | null> {
  return await RECIPEMD.get(generateRecipeKey(code), 'json')
}

export { generateCode, getExistingCode, getRecipe, storeRecipe }
