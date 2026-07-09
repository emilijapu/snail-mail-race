import { createClient, OAuthStrategy, media } from "https://esm.sh/@wix/sdk@1.15.24";
import { items } from "https://esm.sh/@wix/data@1.0.285";
import { posts } from "https://esm.sh/@wix/blog@1.0.488";
import { wixEventsV2, rsvpV2 } from "https://esm.sh/@wix/events@1.0.500";

const TOKEN_KEY = "smrl_wix_tokens";

export const cfg = window.WIX_CONFIG;

export const client = createClient({
  modules: { items, posts, wixEventsV2, rsvpV2 },
  auth: OAuthStrategy({ clientId: cfg.clientId }),
});

export function loadTokens() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const tokens = JSON.parse(raw);
    client.auth.setTokens(tokens);
    return tokens;
  } catch {
    return null;
  }
}

export function saveTokens(tokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  client.auth.setTokens(tokens);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("wixOAuthData");
}

export function imgSrc(v, w = 120, h = 120) {
  if (!v) return "";
  if (typeof v === "string" && v.startsWith("wix:image://")) {
    return media.getScaledToFillImageUrl(v, w, h, {});
  }
  return typeof v === "string" ? v : v?.url ?? "";
}

/** Prime visitor OAuth once so parallel CMS/blog calls don't each fetch a token. */
let authReadyPromise = null;

export function ensureAuthReady() {
  if (client.auth.loggedIn()) {
    return authReadyPromise || Promise.resolve();
  }
  if (!authReadyPromise) {
    authReadyPromise = warmVisitorAuth();
  }
  return authReadyPromise;
}

async function warmVisitorAuth() {
  try {
    if (typeof client.auth.generateVisitorTokens === "function") {
      await client.auth.generateVisitorTokens();
      return;
    }
  } catch {
    /* fall through */
  }
  const col = cfg.cms?.collections?.standings;
  if (!col) return;
  try {
    await client.items.query(col).limit(1).find();
  } catch {
    /* first API call still warms auth */
  }
}

loadTokens();
