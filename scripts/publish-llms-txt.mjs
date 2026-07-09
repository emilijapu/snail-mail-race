#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SITE_ID = "56d7087c-434a-45a1-a38b-277ff14c6016";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

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
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 500)}`);
  return JSON.parse(text);
}

const content = readFileSync(join(ROOT, "llms.txt"), "utf8");

const result = await api("PUT", "/promote-seo-txt-file-server/v2/llms", {
  llmsTxt: {
    content,
    default: false,
    manuallyEdited: true,
    subdomain: "www",
  },
});

console.log("llms.txt updated:", result.llmsTxt?.manuallyEdited ? "manual" : "default");
