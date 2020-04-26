import fetch from "node-fetch";
import cheerio from "cheerio";
import { promises as fs } from "fs";

async function loadURLToCheerio(url: string) {
  const resp = await fetch(url);
  const body = await resp.text();
  return cheerio.load(Buffer.from(body));
}

async function loadFileToCheerio(path: string) {
  const data = await loadFile(path);
  return cheerio.load(Buffer.from(data));
}

async function loadFile(path: string) {
  return await fs.readFile(path, "binary");
}

export { loadURLToCheerio, loadFileToCheerio, loadFile };
