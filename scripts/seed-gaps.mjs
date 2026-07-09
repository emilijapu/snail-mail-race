#!/usr/bin/env node
/**
 * Incremental seed — adds missing HoF + blog posts without duplicating full seed.
 */
import { spawnSync } from "node:child_process";
import { BLOG_POSTS, richContent } from "./blog-posts-content.mjs";

const SITE_ID = "56d7087c-434a-45a1-a38b-277ff14c6016";

function token() {
  const r = spawnSync("npx", ["-y", "@wix/cli@latest", "token", "--site", SITE_ID], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(r.stderr || "token failed");
  return r.stdout.trim();
}

async function api(method, path, body) {
  const TOKEN = token();
  const res = await fetch(`https://www.wixapis.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "wix-site-id": SITE_ID,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

const NEW_HOF = [
  { title: "The Baltic Braid", origin: "Riga", destination: "Hobart", routeVia: "via Kaliningrad, Åland, Murmansk", transitDays: 1388, season: "Season 10", memberHandle: "@baltic_bureau", story: "Diverted north through Murmansk during a Baltic ice event and sat in a heated depot for eleven months." },
  { title: "The Sahel Switchback", origin: "Bamako", destination: "Reykjavík", routeVia: "via Nouakchott, Canary Islands", transitDays: 1262, season: "Season 11", memberHandle: "@sahel_slow", story: "Crossed the Sahara by surface sack, then waited two seasons for a northbound fishing-vessel mail contract." },
  { title: "The Coral Triangle", origin: "Palau", destination: "Monaco", routeVia: "via Papua New Guinea, Timor-Leste", transitDays: 1155, season: "Season 12", memberHandle: "@reef_router", story: "Mis-sorted in Port Moresby and toured three island hubs before a Mediterranean feeder flight." },
  { title: "The Ross Dependency Run", origin: "Scott Base", destination: "Thimphu", routeVia: "via Christchurch, Mumbai", transitDays: 1089, season: "Season 13", memberHandle: "@ice_mail", story: "Wintered at McMurdo, then spent nine months in a Mumbai customs queue with ambiguous paperwork." },
];

const NEW_POSTS = BLOG_POSTS.filter((p) =>
  [
    "Letter from the sorting clerk of Ascension Island",
    "Five routes that look fast but aren't",
    "Season 14 midpoint: who's still in the post?",
  ].includes(p.title),
);

async function existingHofTitles() {
  const out = await api("POST", "/wix-data/v2/items/query", {
    dataCollectionId: "LegendaryDelivery",
    query: { paging: { limit: 50 } },
  });
  return new Set((out.dataItems || []).map((i) => i.data?.title));
}

async function existingPostTitles() {
  const out = await api("POST", "/blog/v3/posts/query", {
    query: { paging: { limit: 50 } },
  });
  return new Set((out.posts || []).map((p) => p.title));
}

async function insertHof(items) {
  if (!items.length) return;
  await api("POST", "/wix-data/v2/bulk/items/insert", {
    dataCollectionId: "LegendaryDelivery",
    dataItems: items.map((data) => ({ data })),
  });
  console.log(`Inserted ${items.length} Hall of Fame entries`);
}

async function insertPosts(posts) {
  if (!posts.length) return;
  const members = await api("GET", "/members/v1/members?fieldsets=PUBLIC&paging.limit=1");
  const memberId = members.members?.[0]?.id;
  if (!memberId) throw new Error("No member for blog author");
  const lc = () => crypto.randomUUID();
  await api("POST", "/blog/v3/bulk/draft-posts/create", {
    publish: true,
    draftPosts: posts.map((p) => ({
      title: p.title,
      memberId,
      excerpt: p.excerpt,
      richContent: richContent(p.body, lc),
    })),
  });
  console.log(`Inserted ${posts.length} blog posts`);
}

const hofTitles = await existingHofTitles();
const toHof = NEW_HOF.filter((h) => !hofTitles.has(h.title));
await insertHof(toHof);

const postTitles = await existingPostTitles();
const toPosts = NEW_POSTS.filter((p) => !postTitles.has(p.title));
await insertPosts(toPosts);

console.log("seed-gaps complete");
