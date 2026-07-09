#!/usr/bin/env node
/**
 * Expand Season 13 recap post body to full Gazette copy (100+ words).
 */
import { spawnSync } from "node:child_process";

const SITE_ID = "56d7087c-434a-45a1-a38b-277ff14c6016";
const SLUG = "season-13-in-review-the-year-of-the-mislabelled-sack";

const EXCERPT =
  "A single clerical error in Panama rerouted eleven entries and reshaped the standings.";

const BODY = [
  "Season 13 began with the quiet conviction that paperwork would behave. It did not. On 4 April, a bonded warehouse clerk in Colón mislabelled a canvas sack bound for Lima as perishable fruit. Eleven league postcards were inside, each stamped and sealed according to regulation. The sack toured three Panamanian depots, sat in a humid holding room for seven months, and resurfaced in Veracruz with mildew and a fresh stack of routing stickers.",
  "The error reshaped the standings in ways no deliberate strategy could rival. Cards that had left Auckland and Reykjavík weeks apart arrived on the same Tuesday, separated only by postmark ink. @slowpost_nz, who had engineered a respectable crawl through the South Atlantic, found their entry leapfrogged by a misrouted novice from Winnipeg. The discipline committee ruled the delay legitimate: the league measures postal fate, not intent.",
  "By December, Season 13 had delivered the lowest average transit speed in five years. Racers called it quiet. Historians, we suspect, will call it glorious.",
];

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

function richContent(paragraphs) {
  const para = (text) => ({
    type: "PARAGRAPH",
    id: lc(),
    nodes: [{ type: "TEXT", id: lc(), textData: { text, decorations: [] } }],
  });
  return { nodes: paragraphs.map(para) };
}

const { posts } = await api("POST", "/blog/v3/posts/query", {
  query: { filter: { slug: SLUG }, paging: { limit: 1 } },
});
const post = posts?.[0];
if (!post) throw new Error(`Post not found: ${SLUG}`);

const draftPostId = post.id;
await api("PATCH", `/blog/v3/draft-posts/${draftPostId}`, {
  draftPost: {
    excerpt: EXCERPT,
    richContent: richContent(BODY),
  },
});
await api("POST", `/blog/v3/draft-posts/${draftPostId}/publish`, {});

const words = BODY.join(" ").split(/\s+/).length;
console.log(`Updated "${post.title}" (${words} words) and re-published.`);
