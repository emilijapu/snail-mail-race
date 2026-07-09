#!/usr/bin/env node
/** Ensure MemberRace is member-scoped (each member sees only their own rows). */
import { spawnSync } from "node:child_process";

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
  if (!res.ok) {
    if (res.status === 400 && text.includes("WDE0075")) {
      console.log("MemberRace permissions already correct (SITE_MEMBER_AUTHOR read).");
      return {};
    }
    throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 400)}`);
  }
  return text ? JSON.parse(text) : {};
}

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

console.log("MemberRace permissions set to SITE_MEMBER_AUTHOR (read).");
