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
import { wireEventRsvp, wireSeasonRegistration, fetchUpcomingEvents } from "./wix-events.mjs";
import { ensureAuthReady } from "./wix-client.mjs";

async function init() {
  await ensureAuthReady();

  const hasRegForm = !!document.getElementById("regForm");
  const hasEvGrid = !!document.querySelector(".ev-grid");
  const needsEvents = hasRegForm || hasEvGrid;

  const fetches = [
    fetchStandings(8),
    fetchHof(6),
    fetchTestimonials(4),
    fetchBlogPosts(3),
  ];
  if (needsEvents) fetches.push(fetchUpcomingEvents(20));

  try {
    const results = await Promise.all(fetches);
    const [standings, hof, testimonials, posts] = results;
    const events = needsEvents ? results[4] : [];

    renderStandings(standings);
    renderHofRail(hof);
    renderTestimonials(testimonials);
    renderGazette(posts);

    if (hasEvGrid && events.length) {
      renderEvents(events.slice(0, 6));
      wireEventRsvp();
    }

    if (hasRegForm) {
      await wireSeasonRegistration(events);
    }
  } catch (err) {
    console.warn("Wix CMS/blog load — using static fallback", err);
    if (hasRegForm) await wireSeasonRegistration();
  }

  window.__wixReady = true;
}

export { init };
