import { fetchBlogPosts, renderGazette } from "../wix-render.mjs";

try {
  const posts = await fetchBlogPosts(20);
  renderGazette(posts);
} catch (err) {
  console.warn("Blog load failed", err);
}
