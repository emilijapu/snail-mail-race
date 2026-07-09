#!/usr/bin/env node
/**
 * Expand all Gazette posts to full body copy and re-publish in Wix.
 */
import { spawnSync } from "node:child_process";
import { BLOG_POSTS, richContent, wordCount } from "./blog-posts-content.mjs";

const SITE_ID = "56d7087c-434a-45a1-a38b-277ff14c6016";

function token() {
  const r = spawnSync("npx", ["-y", "@wix/cli@latest", "token", "--site", SITE_ID], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(r.stderr || "token failed");
  return r.stdout.trim();
}

async function api(method, path, body) {
  const res = await fetch(`https://www.wixapis.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      "wix-site-id": SITE_ID,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

function lc() {
  return crypto.randomUUID();
}

const byTitle = new Map(BLOG_POSTS.map((p) => [p.title, p]));

const { posts } = await api("POST", "/blog/v3/posts/query", {
  query: { paging: { limit: 100 } },
});

let updated = 0;
for (const live of posts || []) {
  const content = byTitle.get(live.title);
  if (!content) {
    console.log(`Skip (no copy): ${live.title}`);
    continue;
  }
  const words = wordCount(content);
  if (words < 100) throw new Error(`"${content.title}" only has ${words} words`);

  await api("PATCH", `/blog/v3/draft-posts/${live.id}`, {
    draftPost: {
      excerpt: content.excerpt,
      richContent: richContent(content.body, lc),
    },
  });
  await api("POST", `/blog/v3/draft-posts/${live.id}/publish`, {});
  console.log(`Updated "${live.title}" (${words} words)`);
  updated += 1;
}

console.log(`\nDone — ${updated} post(s) patched.`);
