import { client, cfg, clearTokens, saveTokens, imgSrc } from "../wix-client.mjs";

const guestView = document.getElementById("guestView");
const memberView = document.getElementById("memberView");
const loadErr = document.getElementById("loadErr");

async function startLogin() {
  const redirectUri = `${window.location.origin}/callback.html`;
  const originalUri = window.location.href;
  const oAuthData = client.auth.generateOAuthData(redirectUri, originalUri);
  localStorage.setItem("wixOAuthData", JSON.stringify(oAuthData));
  const { authUrl } = await client.auth.getAuthUrl(oAuthData);
  window.location.href = authUrl;
}

async function logout() {
  const { logoutUrl } = await client.auth.logout(window.location.href);
  clearTokens();
  window.location.href = logoutUrl;
}

function daysSince(iso) {
  if (!iso) return 0;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

async function loadRaces() {
  const col = cfg.cms.collections.memberRaces;
  if (!col) return [];
  try {
    const { items: rows } = await client.items.query(col).descending("departedAt").limit(20).find();
    return rows || [];
  } catch {
    return [];
  }
}

function renderRaces(rows) {
  const body = document.getElementById("raceBody");
  const empty = document.getElementById("raceEmpty");
  body.innerHTML = "";
  if (!rows.length) {
    empty.hidden = false;
    document.getElementById("statTransit").textContent = "0";
    document.getElementById("statBest").textContent = "0";
    return;
  }
  empty.hidden = true;
  let best = 0;
  let inTransit = 0;
  rows.forEach((r) => {
    const days = r.daysInTransit ?? daysSince(r.departedAt);
    if (r.status === "In Transit") inTransit++;
    if (days > best) best = days;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.origin || "—"} → ${r.destination || "—"}</td>
      <td>${r.season || "—"}</td>
      <td class="days">${Number(days).toLocaleString()} <small>days</small></td>
      <td><span class="badge badge--${(r.status || "transit").toLowerCase().includes("arriv") ? "arrived" : "transit"}">${r.status || "In Transit"}</span></td>`;
    body.appendChild(tr);
  });
  document.getElementById("statTransit").textContent = String(inTransit);
  document.getElementById("statBest").textContent = String(best);
  document.getElementById("statSeasons").textContent = String(new Set(rows.map((r) => r.season).filter(Boolean)).size || 0);
}

async function showMember() {
  const { member } = await client.members.getCurrentMember({ fieldsets: ["FULL"] });
  const profile = member?.profile || {};
  const name = profile.nickname || member?.loginEmail?.split("@")[0] || "Member";
  document.getElementById("displayName").textContent = name;
  document.getElementById("memberEmail").textContent = member?.loginEmail || "";
  const created = member?._createdDate ? new Date(member._createdDate).toLocaleDateString("en-GB", { year: "numeric", month: "long" }) : "";
  document.getElementById("memberSince").textContent = created ? `Member since ${created}` : "";

  const photo = profile.photo?.url || profile.photo;
  const src = imgSrc(photo, 176, 176);
  const av = document.getElementById("avatar");
  if (src) { av.src = src; av.hidden = false; av.alt = `${name} profile photo`; }

  const races = await loadRaces();
  renderRaces(races);

  guestView.hidden = true;
  memberView.hidden = false;
}

async function init() {
  document.getElementById("loginBtn")?.addEventListener("click", () => startLogin().catch(showErr));
  document.getElementById("logoutBtn")?.addEventListener("click", () => logout().catch(showErr));

  if (client.auth.loggedIn()) {
    try {
      await showMember();
    } catch (e) {
      showErr(e);
      guestView.hidden = false;
    }
  } else {
    guestView.hidden = false;
    memberView.hidden = true;
  }
}

function showErr(e) {
  loadErr.style.display = "block";
  loadErr.textContent = e?.message || String(e);
}

init();
