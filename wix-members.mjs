import { createClient, OAuthStrategy } from "https://esm.sh/@wix/sdk@1.15.24";
import { members } from "https://esm.sh/@wix/members@1.0.102";
import { cfg, client } from "./wix-client.mjs";

const membersClient = createClient({
  modules: { members },
  auth: OAuthStrategy({ clientId: cfg.clientId }),
});

function syncAuth() {
  try {
    const tokens = client.auth.getTokens?.();
    if (tokens) membersClient.auth.setTokens(tokens);
  } catch {
    /* optional prefill */
  }
}

export async function getCurrentMember(options) {
  syncAuth();
  return membersClient.members.getCurrentMember(options);
}
