const CREST = `<svg viewBox="0 0 100 100" fill="none"><g stroke="#141210" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M34 62 c-8 0 -13 -6 -13 -14 c0 -10 9 -18 20 -18 c11 0 19 8 19 18 c0 6 -5 11 -11 11 c-5 0 -9 -4 -9 -9 c0 -4 3 -6 6 -6"/><path d="M34 62 h24"/><path d="M58 55 l8 -16 M64 39 l4 3 M60 40 l4 3"/></g></svg>`;

const NAV = [
  { id: "home", href: "/", label: "Home" },
  { id: "standings", href: "/standings.html", label: "Standings" },
  { id: "rules", href: "/rules.html", label: "Rules" },
  { id: "hall-of-fame", href: "/hall-of-fame.html", label: "Hall of Fame" },
  { id: "blog", href: "/blog.html", label: "The Gazette" },
  { id: "contact", href: "/contact.html", label: "Contact" },
  { id: "account", href: "/account.html", label: "My Account" },
];

function navLink(item, current) {
  const cur = item.id === current ? ' aria-current="page"' : "";
  return `<a href="${item.href}"${cur}>${item.label}</a>`;
}

export function mountHeader(current = "") {
  const el = document.getElementById("site-header");
  if (!el) return;
  const desktop = NAV.filter((n) => n.id !== "home").map((n) => navLink(n, current)).join("");
  const mobile = NAV.filter((n) => n.id !== "home").map((n) => navLink(n, current)).join("")
    + '<a href="/#register" class="btn btn--lg">Join the league</a>';
  el.innerHTML = `
    <div class="wrap nav">
      <a class="brand" href="/" aria-label="Snail Mail Racing League home">
        <span class="crest" aria-hidden="true">${CREST}</span>
        <span><span class="bt">Snail Mail Racing League</span><span class="bs">Intl. Postal Racing Authority · Est. 2012</span></span>
      </a>
      <nav class="navlinks" aria-label="Primary">${desktop}</nav>
      <a href="/#register" class="btn nav-join">Join the league</a>
      <button class="hamburger" id="hamb" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu"><span aria-hidden="true"></span></button>
    </div>
    <nav class="mobile-menu" id="mobileMenu" aria-label="Mobile">${mobile}</nav>`;
  wireMobileMenu();
}

export function mountFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML = `
    <div class="wrap">
      <div class="foot-grid">
        <div class="foot-brand">
          <span class="crest" aria-hidden="true">${CREST}</span>
          <div class="bt">Snail Mail Racing League</div>
          <p>Competitive postal racing since 2012. The last postcard to arrive wins.</p>
          <a class="powered" href="https://dev.wix.com/docs/go-headless" target="_blank" rel="noopener">Powered by Wix Headless ↗</a>
        </div>
        <div class="foot-col">
          <h4>Navigate</h4>
          <a href="/">Home</a>
          <a href="/standings.html">Standings</a>
          <a href="/hall-of-fame.html">Hall of Fame</a>
          <a href="/rules.html">Rules</a>
          <a href="/blog.html">The Gazette</a>
          <a href="/contact.html">Contact</a>
          <a href="/account.html">My Account</a>
        </div>
        <div class="foot-col">
          <h4>League HQ</h4>
          <p><a href="mailto:league@snailmailracing.org">league@snailmailracing.org</a></p>
          <p><a href="tel:+41443017890">+41 44 301 7890</a></p>
          <p>Bahnhofstrasse 12<br>8001 Zurich, Switzerland</p>
          <p class="ref" style="color:#9A9484">Mon–Fri 9:00–17:00 CET</p>
        </div>
        <div class="foot-col">
          <h4>Follow the crawl</h4>
          <div class="foot-social">
            <a href="https://instagram.com/snailmailracing" target="_blank" rel="noopener" aria-label="Instagram @snailmailracing">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://facebook.com/snailmailracingleague" target="_blank" rel="noopener" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1z"/></svg>
            </a>
            <a href="https://x.com/smrlofficial" target="_blank" rel="noopener" aria-label="X @smrlofficial">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h3l-7 8 8 12h-6l-5-7-6 7H2l8-9L2 2h6l4 6z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© 2025 Snail Mail Racing League · Zurich</span>
        <span><a href="/contact.html">Privacy &amp; inquiries</a></span>
      </div>
    </div>`;
}

function wireMobileMenu() {
  const hamb = document.getElementById("hamb");
  const menu = document.getElementById("mobileMenu");
  if (!hamb || !menu) return;
  hamb.addEventListener("click", () => {
    const open = hamb.getAttribute("aria-expanded") === "true";
    hamb.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("open", !open);
  });
}

const page = document.body.dataset.page || "";
mountHeader(page);
mountFooter();
