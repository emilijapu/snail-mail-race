import { fetchBlogPost, renderRichContent } from "../wix-render.mjs";

const params = new URLSearchParams(location.search);
const slug = params.get("slug");
const id = params.get("id");
const article = document.getElementById("blogArticle");
const titleEl = document.getElementById("blogTitle");
const dateEl = document.getElementById("blogDate");

try {
  const post = await fetchBlogPost({ slug, id });
  if (!post) throw new Error("Post not found");
  document.title = `${post.title} — The Gazette · Snail Mail Racing League`;
  if (titleEl) titleEl.textContent = post.title;
  if (dateEl && post.firstPublishedDate) {
    dateEl.textContent = new Date(post.firstPublishedDate).toLocaleDateString("en-GB", {
      day: "2-digit", month: "long", year: "numeric",
    });
  }
  if (article) {
    const body = renderRichContent(post.richContent)
      || (post.excerpt ? `<p>${post.excerpt}</p>` : "");
    article.innerHTML = body || "<p>This dispatch is still in transit. Check back shortly.</p>";
  }
} catch (err) {
  console.warn("Blog post load failed", err);
  if (article) {
    article.innerHTML = "<p>Post not found. <a href=\"/blog.html\">Return to The Gazette</a>.</p>";
  }
}
