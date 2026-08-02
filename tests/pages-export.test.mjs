import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const outputRoot = new URL("../out/", import.meta.url);

test("exports the complete site directly under the GitHub Pages base path", async () => {
  const html = await readFile(new URL("index.html", outputRoot), "utf8");

  assert.match(html, /<title>種子星球｜世界奇趣種子圖鑑與手作工坊<\/title>/);
  assert.match(html, /href="\/seeds\/_next\/static\//);
  assert.match(html, /src="\/seeds\/generated\/hero\.png"/);
  assert.match(html, /世界圖鑑/);
  assert.match(html, /手作工坊/);
  assert.match(html, /闖關挑戰/);
  assert.doesNotMatch(html, /http-equiv=["']refresh/i);
  assert.doesNotMatch(html, /chatgpt\.site|Continue with ChatGPT/i);
});

test("includes every generated teaching image and social card", async () => {
  for (const file of [
    "hero.png",
    "seed-board-1.png",
    "seed-board-2.png",
    "seed-board-3.png",
    "craft-board-1.png",
    "craft-board-2.png",
    "dispersal-wind.jpg",
    "dispersal-water.jpg",
    "dispersal-animal.jpg",
    "dispersal-self.jpg",
  ]) {
    await access(new URL(`generated/${file}`, outputRoot));
  }

  await access(new URL("og.png", outputRoot));
});
