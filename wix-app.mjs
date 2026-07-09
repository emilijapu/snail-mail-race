import { client, cfg } from "./wix-client.mjs";

const statusMap = {
  transit: ["In Transit", "transit"],
  arrived: ["Arrived", "arrived"],
  lost: ["Lost", "lost"],
};

function renderStandings(rows) {
  const body = document.getElementById("standingsBody");
  if (!body || !rows.length) return;
  body.innerHTML = "";
  rows.forEach((r) => {
    const st = statusMap[r.status] || statusMap.transit;
    const daysHtml = r.status === "lost"
      ? '<span class="days" style="font-size:15px;color:var(--muted)">— <small>presumed lost</small></span>'
      : `<span class="days"><span class="cu" data-target="${r.daysInTransit}">0</span><small>days</small></span>`;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="rk">${r.rank}</td>
      <td><span class="handle">${r.memberHandle}</span></td>
      <td class="flagcell"><span class="fg" aria-hidden="true">${r.flag || ""}</span>${r.originCountry}</td>
      <td>${r.destination}</td>
      <td>${daysHtml}</td>
      <td><span class="badge badge--${st[1]}">${st[0]}</span></td>`;
    body.appendChild(tr);
  });
  window.dispatchEvent(new CustomEvent("wix:standings-rendered"));
}

function miniPostcard(h) {
  return `<svg viewBox="0 0 300 150" role="img" aria-label="Postcard from ${h.title}"><rect x="4" y="4" width="292" height="142" rx="6" fill="#FFFEF9" stroke="#141210" stroke-width="4"/><rect x="9" y="9" width="282" height="9" fill="#EE3B2F"/><rect x="9" y="132" width="282" height="9" fill="#2F63FF"/><text x="150" y="80" text-anchor="middle" font-family="monospace" font-size="12" fill="#5F5A4E">${h.transitDays} days</text></svg>`;
}

function renderHof(rows) {
  const rail = document.getElementById("hofRail");
  if (!rail || !rows.length) return;
  rail.innerHTML = "";
  rows.forEach((h) => {
    const card = document.createElement("article");
    card.className = "hof-card";
    card.setAttribute("role", "listitem");
    const route = `${h.origin} → ${h.destination}${h.routeVia ? " · " + h.routeVia : ""}`;
    card.innerHTML = `
      <div class="pcwrap">${miniPostcard(h)}</div>
      <div class="body">
        <span class="season">${h.season}</span>
        <h3>${h.title}</h3>
        <p class="route">${route}</p>
        <div class="hof-days">${Number(h.transitDays).toLocaleString()} <small>days in transit</small></div>
        <p class="story">${h.story}</p>
        <p class="whom">${h.memberHandle}</p>
      </div>`;
    rail.appendChild(card);
  });
}

function renderGazette(blogPosts) {
  const gaz = document.getElementById("gazGrid");
  if (!gaz || !blogPosts.length) return;
  gaz.innerHTML = "";
  blogPosts.forEach((p) => {
    const a = document.createElement("a");
    a.href = p.url?.base + p.url?.path || "#";
    a.className = "post";
    const date = p.firstPublishedDate ? new Date(p.firstPublishedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";
    const excerpt = p.excerpt || "";
    a.innerHTML = `<span class="cat">The Gazette</span><div class="pdate">${date}</div><h3>${p.title}</h3><p>${excerpt}</p><span class="linkarrow">Read more <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M2 8h11M9 4l4 4-4 4"/></svg></span>`;
    gaz.appendChild(a);
  });
}

function renderEvents(evRows) {
  const grid = document.querySelector(".ev-grid");
  if (!grid || !evRows.length) return;
  grid.innerHTML = "";
  evRows.forEach((ev) => {
    const dt = ev.dateAndTimeSettings?.formatted?.dateAndTime || ev.dateAndTimeSettings?.startDate || "";
    const loc = ev.location?.name || "Global / Remote";
    const div = document.createElement("div");
    div.className = "event";
    div.innerHTML = `
      <span class="edate">${dt}</span>
      <h3>${ev.title}</h3>
      <span class="eloc">${loc}</span>
      <a href="#register" class="btn">Register</a>`;
    grid.appendChild(div);
  });
}

async function loadCMS() {
  const { standings, hallOfFame } = cfg.cms.collections;
  const [stRes, hofRes] = await Promise.all([
    client.items.query(standings).ascending("rank").limit(20).find(),
    client.items.query(hallOfFame).descending("transitDays").limit(10).find(),
  ]);
  renderStandings(stRes.items || []);
  renderHof(hofRes.items || []);
}

async function loadBlog() {
  const { items: blogPosts } = await client.posts
    .queryPosts({ fieldsets: ["URL"] })
    .descending("firstPublishedDate")
    .limit(6)
    .find();
  renderGazette(blogPosts || []);
}

async function loadEvents() {
  try {
    const result = await client.wixEventsV2.queryEvents({ limit: 6 });
    const evRows = result.events || result.items || [];
    if (evRows.length) renderEvents(evRows);
  } catch (err) {
    console.warn("Wix events load failed", err);
  }
}

function wireForm() {
  const form = document.getElementById("regForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    const ok = form.reportValidity?.() ?? true;
    if (!ok) return;
    const data = {
      full_name: document.getElementById("f-name").value.trim(),
      email: document.getElementById("f-email").value.trim(),
      country: document.getElementById("f-country").value.trim(),
      preferred_race_format: document.getElementById("f-format").value,
      message: document.getElementById("f-msg").value.trim(),
    };
    try {
      await client.submissions.createSubmission({
        formId: cfg.form.formId,
        submissions: data,
      });
      form.style.display = "none";
      document.getElementById("formSuccess")?.classList.add("show");
    } catch (err) {
      console.error("Wix form submit failed", err);
      alert("Submission failed. Please try again.");
    }
  }, true);
}

async function init() {
  wireForm();
  try {
    await Promise.all([loadCMS(), loadBlog(), loadEvents()]);
  } catch (err) {
    console.warn("Wix CMS/blog load — using static fallback", err);
  }
  window.__wixReady = true;
}

init();
