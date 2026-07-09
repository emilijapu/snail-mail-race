#!/usr/bin/env node
/**
 * Seed demo MemberRace rows + set read permission for all members.
 */
import { spawnSync } from "node:child_process";

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
  return text ? JSON.parse(text) : {};
}

const SAMPLES = [
  { origin: "Oslo, Norway", destination: "Ulaanbaatar, Mongolia", season: "Season 14", daysInTransit: 142, status: "In Transit", departedAt: new Date(Date.now() - 142 * 86400000).toISOString() },
  { origin: "Lisbon, Portugal", destination: "Bhutan", season: "Season 13", daysInTransit: 891, status: "Arrived", departedAt: new Date(Date.now() - 891 * 86400000).toISOString() },
  { origin: "Reykjavík, Iceland", destination: "Tuvalu", season: "Season 14", daysInTransit: 67, status: "In Transit", departedAt: new Date(Date.now() - 67 * 86400000).toISOString() },
];

try {
  await api("PATCH", "/wix-data/v2/collections/MemberRace", {
    collection: {
      id: "MemberRace",
      permissions: {
        read: "SITE_MEMBER_AUTHOR",
        insert: "SITE_MEMBER",
        update: "SITE_MEMBER_AUTHOR",
        remove: "SITE_MEMBER_AUTHOR",
      },
    },
    mask: { paths: ["permissions"] },
  });
  console.log("Updated MemberRace permissions (read: SITE_MEMBER)");
} catch (e) {
  console.warn("Permission patch skipped:", String(e).slice(0, 120));
}

const existing = await api("POST", "/wix-data/v2/items/query", {
  dataCollectionId: "MemberRace",
  query: { paging: { limit: 50 } },
});
const count = (existing.dataItems || []).length;
if (count >= SAMPLES.length) {
  console.log(`MemberRace already has ${count} rows — skipping insert`);
} else {
  await api("POST", "/wix-data/v2/bulk/items/insert", {
    dataCollectionId: "MemberRace",
    dataItems: SAMPLES.map((data) => ({ data })),
  });
  console.log(`Inserted ${SAMPLES.length} sample MemberRace rows`);
}

console.log("seed-member-races complete");
