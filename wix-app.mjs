import {
  renderStandings,
  renderHofRail,
  renderGazette,
  renderTestimonials,
  renderEvents,
  fetchStandings,
  fetchHof,
  fetchTestimonials,
  fetchBlogPosts,
} from "./wix-render.mjs";
import { wireEventRsvp, wireSeasonRegistration } from "./wix-events.mjs";
import { client, ensureAuthReady } from "./wix-client.mjs";

async function loadEvents() {
  try {
    const result = await client.wixEventsV2.queryEvents({ limit: 6 });
    const evRows = result.events || result.items || [];
    if (evRows.length) {
      renderEvents(evRows);
      wireEventRsvp();
    }
  } catch (err) {
    console.warn("Wix events load failed", err);
  }
}

async function init() {
  await ensureAuthReady();
  wireSeasonRegistration();
  try {
    const [standings, hof, testimonials, posts] = await Promise.all([
      fetchStandings(8),
      fetchHof(6),
      fetchTestimonials(4),
      fetchBlogPosts(3),
    ]);
    renderStandings(standings);
    renderHofRail(hof);
    renderTestimonials(testimonials);
    renderGazette(posts);
    await loadEvents();
  } catch (err) {
    console.warn("Wix CMS/blog load — using static fallback", err);
  }
  window.__wixReady = true;
}

function scheduleInit() {
  const run = () => { init(); };
  if ("requestIdleCallback" in window) {
    requestIdleCallback(run, { timeout: 2500 });
  } else {
    setTimeout(run, 1);
  }
}

if (document.readyState === "complete") {
  scheduleInit();
} else {
  window.addEventListener("load", scheduleInit, { once: true });
}
