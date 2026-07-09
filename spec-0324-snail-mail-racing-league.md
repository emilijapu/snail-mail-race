# Snail Mail Racing League

> Competitive postal racing: slowest delivery wins

**HEADLESS DAY brief spec-0324** · Category: **Wild Card** · Difficulty: **medium**

A global league where members mail identical postcards through the world's slowest routes, and the last to arrive wins. Standings are tracked obsessively, and the record is a postcard that took 11 years via three islands.

---

## Requirements

Your build is judged against these. All of them.

- [ ] Current season standings table
- [ ] Rules page explaining race formats
- [ ] Hall of fame page with legendary slow deliveries
- [ ] League registration form
- [ ] Mobile-first responsive design

## Art direction

| | |
|---|---|
| Mood | unhurried · postal · absurd · international |
| Primary color | `#9B2226` |
| Accent color | `#E9D8A6` |

Treat the palette as a starting point — interpret the mood, don't paint by numbers.

## Bonus challenge

Add a 'days in transit' live counter for the current race leaders

---

# Creative brief

A richer brief to build from — structure, content, design, SEO, and performance. Hit the requirements above; let this guide how.

## Audience & voice

**Audience.** Mail-art hobbyists, geography nerds, and irony-loving adults 25-55 who collect stamps, follow obscure postal routes, and find competitive slowness genuinely thrilling. They are globally distributed, internet-literate, and share screenshots of transit updates in Discord servers.

**Voice.** deadpan · bureaucratic-absurd · patient · internationally formal · dry-witted

**Avoid.** corporate buzzwords, motivational speaker energy, exclamation-point hype, urgency language, speed metaphors

## Hero

**Headline.** “The Slowest Mail Wins”

**Layout.** Statement hero with a single oversized postcard as the focal object

**Focal / LCP element.** A weathered postcard photographed at a slight angle on a scuffed wooden surface, covered in foreign postmarks and customs stamps, functioning as the LCP image

**Treatment.** Headline set in Playfair Display 800 at 64px desktop / 36px mobile, deep red (#9B2226) on cream background, letterspaced +0.02em. Below: a stat line in Outfit 400 small caps — '4,200 members · 91 countries · avg. winning transit: 847 days'

**On load.** Postcard image fades in from 0.95 scale to 1.0 over 600ms with a subtle rotate from -1deg to 0deg, as if being placed on a desk. Headline types in letter-by-letter at 40ms intervals. Stat line fades up 200ms after headline completes. Reduced-motion: all elements visible at final state immediately, no animation

**Atmosphere.** Warm cream (#F5F0E8) with a faint paper grain texture overlay at 4% opacity. No gradient, no parallax

**Primary CTA.** Join the league

**Mobile.** Postcard image stacks above headline at 85vw width. Stat line wraps to two lines. CTA becomes full-width at 44px height. Kicker remains above headline in 13px Outfit uppercase

**The one thing they'll remember.** The battered, stamp-covered postcard that looks like it has genuinely traveled the world — visitors will remember the tactile reality of competitive slowness

## Sitemap (7 pages)

| Page | Route | Purpose | CTA |
|---|---|---|---|
| Home | `/` | Explain what competitive postal racing is in five seconds and push to league registration | Join the league |
| Current Season | `/standings` | Live standings table for the active race season showing postcards still in transit and confirmed arrivals | Register for this season |
| Hall of Fame | `/hall-of-fame` | CMS-driven archive of legendary slow deliveries with route maps, transit times, and postcard photos | Join the league |
| Race Rules | `/rules` | Official rule book covering race formats, eligible routes, postcard specs, and disqualification criteria | Register for this season |
| The Gazette | `/blog` | Race reports, route analysis, and member spotlights via @wix/blog | Join the league |
| My Account | `/account` | Member login, race history, active postcards in transit, and season stats via @wix/members | View my races |
| Contact | `/contact` | League HQ address, inquiry form, and social links | Send an inquiry |

## Homepage flow

1. **Hero** — Full-bleed hero with a weathered postcard mid-stamp, headline declaring the league's premise, single CTA to join, and a stat line: '4,200 members · 91 countries · average winning transit: 847 days'
2. **How it works** — Three numbered cards — (1) Choose a route from approved slow corridors, (2) Mail an identical league-stamped postcard, (3) The last postcard to arrive wins the season. Each card has a small icon: envelope, globe, trophy
3. **Season 14 standings** — Condensed standings table showing top 8 entries: member handle, origin country, destination, days in transit, status (In Transit / Arrived / Lost). A 'View full standings' link below the table
4. **Hall of Fame highlights** — Three featured cards from the Hall of Fame collection — each showing postcard photo, route (e.g. 'Tuvalu to Liechtenstein via Pitcairn'), transit time, and season. Carousel or horizontal scroll on mobile
5. **Member spotlight** — Two member testimonials with name, country flag, seasons competed, and a one-line quote about their most memorable race. Card layout with subtle red left border
6. **Latest from The Gazette** — Two or three blog post cards showing title, date, excerpt, and a 'Read more' link. Posts cover topics like route analysis, season recaps, and postmaster interviews
7. **Upcoming events** — Event cards showing name (e.g. 'Season 15 Mail-Off', 'Annual Slow Gala'), date, location or 'Global / Remote', and a register button. Compact card grid
8. **Registration CTA band** — Dark-background band with the league crest, a one-line pitch ('The only sport where doing nothing is a strategy'), and the primary CTA button
9. **Footer** — Four-column footer: (1) League crest + tagline + 'Powered by Wix Headless' link, (2) Nav links: Home, Standings, Hall of Fame, Rules, The Gazette, Contact, (3) Contact block: league@snailmailracing.org · +41 44 301 7890 · Bahnhofstrasse 12, 8001 Zurich, Switzerland, (4) Social icons: Instagram (@snailmailracing), Facebook (@snailmailracingleague), X (@smrlofficial). Bottom bar: © 2025 Snail Mail Racing League · Privacy Policy · Terms of Service

## Content to create

Seed these into the CMS — counts and sample rows are the minimum bar.

- **10× LegendaryDelivery** (on Hall of Fame) — fields: title, origin, destination, routeVia, transitDays, season, memberHandle, postcardImage, story
  - e.g. The Pitcairn Crawl | Tuvalu | Liechtenstein | via Pitcairn Island, Ascension Island, St. Helena | 4,017 days | Season 3 | @deepsouth_mailer | A standard league postcard left Funafuti post office on March 9, 2014. It cleared Tuvaluan customs in six days, then vanished. Fourteen months later it surfaced in Pitcairn, stamped by hand by the island's sole postal clerk. It sat in Ascension for another two years awaiting a northbound cargo route. The final leg — St. Helena to Vaduz — took eleven months by surface mail via Cape Town and Rotterdam. It arrived on March 22, 2025, bearing seven customs stamps, two coffee stains, and a corner chewed by what the Pitcairn clerk described as 'probably a rat, possibly a cat.' It remains the longest confirmed transit in league history.
  - e.g. The Arctic Detour | Tromsø, Norway | Ushuaia, Argentina | via Svalbard, Greenland, Iceland, Azores | 2,341 days | Season 5 | @nordlys_sender | Mailed from the Tromsø University post room, this card took a voluntary northern detour through Longyearbyen, where winter darkness and a skeleton postal staff held it for nine months. It resurfaced in Nuuk, crossed to Reykjavik by fishing vessel mail, and then drifted through the Azores regional sorting system for over a year before a direct flight bag carried it to Buenos Aires and then overland to Ushuaia.
- **8× StandingsRow** (on Home) — fields: rank, memberHandle, originCountry, destination, daysInTransit, status
  - e.g. 1 | @island_hopper | Nauru | Mongolia | 1,247 days | In Transit
  - e.g. 2 | @slowpost_nz | Niue | Andorra | 1,189 days | In Transit
- **2× MemberTestimonial** (on Home) — fields: name, country, seasonsCompeted, quote
  - e.g. Ingrid Haugen | Norway | 6 seasons | 'I mailed a postcard to myself through four Pacific islands. It arrived three years later with a bite mark and a customs form in a language I still cannot identify.'
  - e.g. Tomás Ferreira | Portugal | 4 seasons | 'My Season 9 entry is still in transit. I check the tracking page every morning like a meditation.'
- **6× BlogPost** (on The Gazette) — fields: title, date, excerpt, category
  - e.g. Why the Azores Sorting Facility Is Every Racer's Best Friend | 2025-02-14 | The Ponta Delgada regional hub has delayed more league postcards than any other facility on earth. We investigate why. | Route Analysis

## Design system

**Aesthetic direction.** Bureaucratic-retro: the visual language of mid-century government postal systems — rubber stamps, airmail borders, form fields, official seals — rendered with modern typographic precision and generous white space. Think Swiss International Style meets a fictional postal authority's annual report. The absurdity is played completely straight, which makes it funnier.

**Spatial composition.** Rigid grid with deliberate stamp-sized modules — content blocks sized and spaced like stamps on a sheet, with thin red rule borders echoing airmail envelope edges. Asymmetry introduced through oversized transit-day numerals that break the grid baseline and bleed into adjacent columns.

**Typography.** Display: `Playfair Display` · Body: `Outfit` · Playfair Display 700-800 for headlines and section titles against Outfit 400/500 for body text and UI elements. Transit-day numerals use Playfair Display 900 at oversized scale
_Source:_ Both via Google Fonts (fonts.google.com)
_Why:_ Playfair Display's high-contrast serifs evoke official documents, gazette mastheads, and postal authority letterheads — formal enough to play the absurdity straight. Outfit is a clean geometric sans with excellent readability at small sizes and a neutral tone that lets the display font carry all the personality.

**Color system** — paste into your Tailwind v4 `@theme`:

```css
@theme {
  --color-background: #F5F0E8;
  --color-surface: #FDFBF7;
  --color-text: #1A1410;
  --color-text-muted: #6B5D52;
  --color-border: #D4C4B0;
  --color-primary: #9B2226;
  --color-accent: #E9D8A6;
  --color-dark: #1A1410;
  --color-on-dark: #F5F0E8;
}
```

**Signature device.** A rubber-stamp imprint motif — section transitions marked by a faint circular postal stamp watermark containing the section name, rotated 8-12 degrees, printed in the primary red at 15% opacity. The stamp appears once per section as a background element, reinforcing the postal-authority aesthetic across the entire site.

**Motion.** CSS-first and minimal: stamp watermarks rotate in on scroll via CSS scroll-driven animation (8deg to final rotation). Transit-day counters tick up with a CSS counter animation on intersection. No parallax, no autoplay video. Reduced-motion: all elements at final state, counters show final number without animation.

**Imagery.** Warm-toned documentary photography with a slight desaturated vintage grade. Images feel like they were taken in a post office in the 1970s but printed on modern paper. Subtle paper-texture overlay at 3% opacity on all image containers to unify the postal aesthetic.

**Avoid in imagery.** digital/tech imagery · speed or motion blur · clean minimalist product photography · stock business handshakes · neon or saturated color grading · anything suggesting urgency or fast delivery

## Conversion & forms

**Primary action.** Join the league — via @wix/events (season registration as ticketed events). Additional services: @wix/members (member profiles, race history, login), @wix/blog (The Gazette race reports and route analysis) → `/standings`

**Repeat at.** hero · upcoming events section · mobile sticky bar · footer

**Secondary (ghost).** View the rules

**Form fields.** name, email, country, preferredRaceFormat, message

**Success message.** “Inquiry received. Given our commitment to slowness, expect a reply within 3-5 business days — which by league standards is lightning fast.”

**Reassurance.** We only use your email to respond to this inquiry. No newsletters unless you opt in.

## FAQ

Real questions to answer on the site (and feed FAQPage JSON-LD).

**How does a race actually work?**

Every racer mails an identical league-stamped postcard from their chosen origin to a shared destination using the slowest available postal route. The last postcard to arrive wins the season. There is no tracking — only the postmark dates on departure and arrival count.

**Can I choose any route?**

Routes must use at least one approved slow corridor from the official list. Direct airmail between major cities is not eligible. The goal is obscure, indirect, and surface-level transit.

**What if my postcard never arrives?**

A postcard declared lost after 5 years earns an honorable mention in the Hall of Fame but does not count as a finish. Several Season 2 entries are still technically in transit.

**Is there a membership fee?**

Season registration is free. Members cover their own postage, which depending on route can range from under a dollar to roughly twelve dollars for the most remote corridors.

**How do you verify arrival dates?**

The destination address is a league-operated PO box. Our postmaster photographs each arriving card with its postmarks and timestamps. Results are posted to the standings page within 48 hours of receipt.

**Can I compete from any country?**

Yes. We have members in 91 countries. As long as your national postal service accepts outbound international mail, you can race.

## SEO

**Primary keyword.** snail mail racing league

**Secondary.** competitive postal racing · slow mail competition · international postcard race · mail racing league registration

**Schema.org type.** `SportsOrganization`

**JSON-LD per page.** SportsOrganization (Home) · SportsEvent (Current Season) · Blog (The Gazette) · Organization (Contact)

**Business facts.** Zurich, Switzerland · League HQ: Mon-Fri 9:00-17:00 CET · Free (members cover own postage) · est. 2012

**Differentiators.** Only organized competitive league for slow postal delivery; verified PO box receipt system; Hall of Fame archive dating back 13 seasons; 91-country membership

**Socials.** @snailmailracing · @smrlofficial

## Performance & accessibility

**LCP element.** Hero postcard photograph — weathered postcard on wooden desk with foreign postmarks

**Top moves.**
- Serve the hero postcard as responsive AVIF/WebP with explicit width/height and fetchpriority=high
- Preload Playfair Display 700 and Outfit 400 as woff2 subsets with font-display:swap
- Use CSS scroll-driven animations for stamp watermarks and counter ticks instead of JS scroll listeners

**Hydration plan.**
- `MobileStickyJoinBar` → `client:load` (Above-fold per-visitor conversion control that must be tappable immediately)
- `NavJoinButton` → `client:load` (Primary CTA in the header, needs interactivity on first paint)
- `StandingsTable` → `client:visible` (Data table below fold can hydrate when scrolled into view)
- `ContactForm` → `client:idle` (Below-fold form defers hydration until main thread is free)

**Defer as facades.** World route map loaded as a static image facade that swaps to interactive on click · Social media feed embeds loaded as screenshot facades until tapped

**Targets.** LCP < 2.5s · INP < 200ms · CLS < 0.1 · Lighthouse mobile ≥ 90

**Accessibility baseline.** Text contrast 4.5:1 · UI 3:1 · 44px tap targets · visible focus · honor reduced-motion · alt text required · semantic landmarks

---

# How to build this with Wix Headless

Internal Wix employees: run the setup skill first to configure npm registry and Wix login:
https://github.com/hanag-wix/Headless-setup-skill-internal/blob/main/SKILL.md

Then follow the build skill for project setup, business solution wiring, and deployment:
https://wix-headless.dev/skill.md
