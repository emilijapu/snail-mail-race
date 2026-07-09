import { fetchStandings, renderStandings, runStandingsCountUp } from "../wix-render.mjs";

try {
  const rows = await fetchStandings(50);
  renderStandings(rows);
  runStandingsCountUp();
  const meta = document.getElementById("standingsMeta");
  if (meta) meta.textContent = `${rows.length} entries shown · register updated within 48h of receipt`;
} catch (err) {
  console.warn("Standings load failed", err);
}
