import { fetchHof, renderHofGrid } from "../wix-render.mjs";

try {
  const rows = await fetchHof(20);
  renderHofGrid(rows);
} catch (err) {
  console.warn("Hall of Fame load failed", err);
}
