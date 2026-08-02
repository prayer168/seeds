import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the Seed Planet learning shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /<title>種子星球｜世界奇趣種子圖鑑與手作工坊<\/title>/);
  assert.match(html, /世界圖鑑/);
  assert.match(html, /手作工坊/);
  assert.match(html, /闖關挑戰/);
  assert.match(html, /\/generated\/hero\.png/);
  assert.match(html, /\/og-cover\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("ships generated imagery, quiz data, accessibility, and reduced motion support", async () => {
  const [page, css, quiz] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../data/quiz.json", import.meta.url), "utf8"),
  ]);
  const questions = JSON.parse(quiz);
  assert.equal(questions.length, 10);
  assert.match(page, /aria-label="教材頁籤"/);
  assert.match(page, /localStorage\.setItem\("seed-planet-progress"/);
  assert.match(page, /Image 2\.0 生成/);
  assert.match(page, /安全小約定/);
  assert.match(page, /風力傳播/);
  assert.match(page, /水力傳播/);
  assert.match(page, /動物傳播/);
  assert.match(page, /自力傳播/);
  assert.doesNotMatch(page, /simRunning|simMode|互動觀察站|傳播方式動畫/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  for (const file of ["hero.png", "seed-board-1.png", "seed-board-2.png", "seed-board-3.png", "craft-board-1.png", "craft-board-2.png", "dispersal-wind.jpg", "dispersal-water.jpg", "dispersal-animal.jpg", "dispersal-self.jpg"]) {
    await access(new URL(`../public/generated/${file}`, import.meta.url));
  }
  await access(new URL("../public/og-cover.png", import.meta.url));
});
