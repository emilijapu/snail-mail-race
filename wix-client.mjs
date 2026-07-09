import { createClient, OAuthStrategy, media } from "https://esm.sh/@wix/sdk@1.15.24";
import { items } from "https://esm.sh/@wix/data@1.0.285";
import { submissions } from "https://esm.sh/@wix/forms@1.0.150";
import { posts } from "https://esm.sh/@wix/blog@1.0.488";
import { wixEventsV2, rsvpV2 } from "https://esm.sh/@wix/events@1.0.502";
import { members } from "https://esm.sh/@wix/members@1.0.102";

const TOKEN_KEY = "smrl_wix_tokens";

export const cfg = window.WIX_CONFIG;

export const client = createClient({
  modules: { items, submissions, posts, wixEventsV2, rsvpV2, members },
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

loadTokens();
