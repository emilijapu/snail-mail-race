import { client, cfg } from "./wix-client.mjs";

export const statusMap = {
  transit: ["In Transit", "transit"],
  arrived: ["Arrived", "arrived"],
  lost: ["Lost", "lost"],
};

export function miniPostcard(h) {
  const days = h.transitDays ?? h.days ?? 0;
  return `<svg viewBox="0 0 300 150" role="img" aria-label="Postcard from ${h.title}"><rect x="4" y="4" width="292" height="142" rx="6" fill="#FFFEF9" stroke="#141210" stroke-width="4"/><rect x="9" y="9" width="282" height="9" fill="#EE3B2F"/><rect x="9" y="132" width="282" height="9" fill="#2F63FF"/><text x="150" y="80" text-anchor="middle" font-family="monospace" font-size="12" fill="#5F5A4E">${days} days</text></svg>`;
}

export function renderStandings(rows, bodyId = "standingsBody") {
  const body = document.getElementById(bodyId);
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

export function runStandingsCountUp() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function countUp(el) {
    const target = +el.getAttribute("data-target");
    if (reduce) { el.textContent = target.toLocaleString(); return; }
    let start = null;
    const dur = 1400;
    function step(t) {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - (1 - p) ** 3;
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }
  document.querySelectorAll(".cu").forEach(countUp);
}

export function hofCardHtml(h) {
  const route = `${h.origin} → ${h.destination}${h.routeVia ? " · " + h.routeVia : ""}`;
  return `
    <div class="pcwrap">${miniPostcard(h)}</div>
    <div class="body">
      <span class="season">${h.season}</span>
      <h3>${h.title}</h3>
      <p class="route">${route}</p>
      <div class="hof-days">${Number(h.transitDays).toLocaleString()} <small>days in transit</small></div>
      <p class="story">${h.story}</p>
      <p class="whom">${h.memberHandle}</p>
    </div>`;
}

export function renderHofRail(rows) {
  const rail = document.getElementById("hofRail");
  if (!rail || !rows.length) return;
  rail.innerHTML = "";
  rows.forEach((h) => {
    const card = document.createElement("article");
    card.className = "hof-card";
    card.setAttribute("role", "listitem");
    card.innerHTML = hofCardHtml(h);
    rail.appendChild(card);
  });
}

export function renderHofGrid(rows, gridId = "hofGrid") {
  const grid = document.getElementById(gridId);
  if (!grid || !rows.length) return;
  grid.innerHTML = "";
  rows.forEach((h) => {
    const card = document.createElement("article");
    card.className = "hof-card hof-card--grid";
    card.innerHTML = hofCardHtml(h);
    grid.appendChild(card);
  });
}

export function blogPostHref(post) {
  const slug = post.slug
    || (post.url?.path ? post.url.path.replace(/^\//, "").split("/").filter(Boolean).pop() : null);
  if (slug) return `/blog-post.html?slug=${encodeURIComponent(slug)}`;
  if (post._id) return `/blog-post.html?id=${encodeURIComponent(post._id)}`;
  const base = post.url?.base?.replace(/\/$/, "") || "";
  const path = post.url?.path || "";
  if (base && path && /^https?:\/\//i.test(base)) return `${base}${path}`;
  return "/blog.html";
}

export function applyPostLink(anchor, href) {
  anchor.href = href;
  try {
    const resolved = new URL(href, location.origin);
    if (resolved.origin !== location.origin) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
  } catch {
    /* relative URL */
  }
}

export function renderRichContent(richContent) {
  if (!richContent?.nodes?.length) return "";
  return richContent.nodes.map((node) => {
    if (node.type === "PARAGRAPH" && node.nodes) {
      const text = node.nodes.map((n) => n.textData?.text || "").join("");
      return text ? `<p>${text}</p>` : "";
    }
    if (node.type === "HEADING" && node.nodes) {
      const text = node.nodes.map((n) => n.textData?.text || "").join("");
      const level = node.headingData?.level || 2;
      return text ? `<h${level}>${text}</h${level}>` : "";
    }
    return "";
  }).join("");
}

export function renderGazette(blogPosts, containerId = "gazGrid") {
  const gaz = document.getElementById(containerId);
  if (!gaz || !blogPosts.length) return;
  gaz.innerHTML = "";
  blogPosts.forEach((p) => {
    const a = document.createElement("a");
    applyPostLink(a, blogPostHref(p));
    a.className = "post";
    const date = p.firstPublishedDate
      ? new Date(p.firstPublishedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "";
    a.innerHTML = `<span class="cat">The Gazette</span><div class="pdate">${date}</div><h3>${p.title}</h3><p>${p.excerpt || ""}</p><span class="linkarrow">Read more <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M2 8h11M9 4l4 4-4 4"/></svg></span>`;
    gaz.appendChild(a);
  });
}

export function renderTestimonials(rows) {
  const grid = document.getElementById("testimonialsGrid");
  if (!grid || !rows.length) return;
  grid.innerHTML = "";
  rows.forEach((t) => {
    const fig = document.createElement("figure");
    fig.className = "quote reveal";
    fig.innerHTML = `
      <span class="qmark" aria-hidden="true">&rdquo;</span>
      <p>${t.quote}</p>
      <figcaption class="who">
        <span class="fg" aria-hidden="true">${t.flag || ""}</span>
        <span><span class="nm">${t.name}</span><br><span class="mt">${t.country} · ${t.seasonsCompeted} seasons competed</span></span>
      </figcaption>`;
    grid.appendChild(fig);
  });
}

export function renderEvents(evRows) {
  const grid = document.querySelector(".ev-grid");
  if (!grid || !evRows.length) return;
  grid.innerHTML = "";
  evRows.forEach((ev) => {
    const dt = ev.dateAndTimeSettings?.formatted?.dateAndTime || ev.dateAndTimeSettings?.startDate || "";
    const loc = ev.location?.name || "Global / Remote";
    const eventId = ev._id || ev.id;
    const regStatus = ev.registration?.status || "";
    const regOpen = !regStatus || regStatus.startsWith("OPEN");
    const regType = ev.registration?.initialType || ev.registration?.type || "RSVP";
    const div = document.createElement("div");
    div.className = "event";
    if (regType === "RSVP" && regOpen && eventId) {
      div.innerHTML = `
        <span class="edate">${dt}</span>
        <h3>${ev.title}</h3>
        <span class="eloc">${loc}</span>
        <button type="button" class="btn btn-rsvp" data-event-id="${eventId}" data-event-title="${ev.title?.replace(/"/g, "&quot;") || ""}">RSVP</button>`;
    } else if (!regOpen) {
      div.innerHTML = `
        <span class="edate">${dt}</span>
        <h3>${ev.title}</h3>
        <span class="eloc">${loc}</span>
        <span class="ref">Registration closed</span>`;
    } else {
      div.innerHTML = `
        <span class="edate">${dt}</span>
        <h3>${ev.title}</h3>
        <span class="eloc">${loc}</span>
        <a href="/#register" class="btn">Register</a>`;
    }
    grid.appendChild(div);
  });
}

export async function fetchStandings(limit = 20) {
  const col = cfg.cms.collections.standings;
  const { items } = await client.items.query(col).ascending("rank").limit(limit).find();
  return items || [];
}

export async function fetchHof(limit = 10) {
  const col = cfg.cms.collections.hallOfFame;
  const { items } = await client.items.query(col).descending("transitDays").limit(limit).find();
  return items || [];
}

export async function fetchTestimonials(limit = 10) {
  const col = cfg.cms.collections.testimonials;
  if (!col) return [];
  const { items } = await client.items.query(col).limit(limit).find();
  return items || [];
}

export async function fetchBlogPost({ slug, id }) {
  const fieldsets = { fieldsets: ["RICH_CONTENT", "URL"] };
  if (slug) {
    const result = await client.posts.queryPosts(fieldsets).eq("slug", slug).limit(1).find();
    const items = result.items || result.posts || [];
    return items[0] || null;
  }
  if (id) {
    try {
      const res = await client.posts.getPost(id, fieldsets);
      return res?.post ?? res ?? null;
    } catch {
      const result = await client.posts.queryPosts(fieldsets).eq("_id", id).limit(1).find();
      const items = result.items || result.posts || [];
      return items[0] || null;
    }
  }
  return null;
}

export async function fetchBlogPosts(limit = 6) {
  const result = await client.posts
    .queryPosts({ fieldsets: ["URL"] })
    .descending("firstPublishedDate")
    .limit(limit)
    .find();
  return result.items || result.posts || [];
}

