import crypto from "crypto";

export let CACHE = {} as {
  [code: string]: { markdown: string; markdownHTML: string };
};

let URL_CACHE = {} as { [hash: string]: string };

function getSHA256Hash(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function generateCode(url: string) {
  const hash = getSHA256Hash(url);

  const existingCode = URL_CACHE[hash];
  if (existingCode) {
    return existingCode;
  }

  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  URL_CACHE[hash] = result;
  return result;
}
