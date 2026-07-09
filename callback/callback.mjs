import { client, saveTokens, clearTokens } from "../wix-client.mjs";

const status = document.getElementById("status");

async function finish() {
  try {
    const raw = localStorage.getItem("wixOAuthData");
    if (!raw) throw new Error("Missing OAuth state — please try logging in again.");
    const oAuthData = JSON.parse(raw);
    const returned = client.auth.parseFromUrl();
    if (returned?.error) {
      throw new Error(returned.errorDescription || returned.error);
    }
    const tokens = await client.auth.getMemberTokens(returned.code, returned.state, oAuthData);
    saveTokens(tokens);
    localStorage.removeItem("wixOAuthData");
    const dest = returned.originalUri || "/account.html";
    window.location.replace(dest);
  } catch (err) {
    clearTokens();
    status.textContent = err.message || "Sign-in failed. Return to My Account and try again.";
    setTimeout(() => window.location.replace("/account.html"), 4000);
  }
}

finish();
