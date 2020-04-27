import crypto from "crypto";

export const CACHE = {} as {
  [code: string]: { markdown: string; markdownHTML: string };
};

const URL_CACHE = {} as { [hash: string]: string };

function getSHA256Hash(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function generateCode(url: string) {
  const hash = getSHA256Hash(url);

  const existingCode = URL_CACHE[hash];
  if (existingCode) {
    return existingCode;
  }

  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  URL_CACHE[hash] = result;
  return result;
}
