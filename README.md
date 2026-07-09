# Snail Mail Racing League

The world's only competitive league for slow postal delivery. Mail an identical postcard through the slowest route you can find. The last card to arrive wins the season.

**HEADLESS DAY** · spec-0324

## Live site

**https://snail-mail-b67e59f5-emilijap8.wix-site-host.com**

Dashboard: https://manage.wix.com/dashboard/

## Wix Headless

Connected Business Solutions:

- **Wix Data (CMS)** — standings, hall of fame, member testimonials
- **Wix Forms** — league registration
- **Wix Blog** — The Gazette posts
- **Wix Events** — season mail-offs and galas (RSVP)
- **Wix Members** — member area (app installed)

SDK wiring: `wix-app.mjs` · config: `wix-handoff.json` · seed: `node scripts/seed-wix.mjs`

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080

## What's included

- Standings table with live transit counters
- Race rules & formats
- Hall of Fame archive
- League registration form
- Mobile-first responsive layout
- FAQ with JSON-LD schema

## Files

| File | Purpose |
|---|---|
| `index.html` | Main page |
| `styles.css` | Styles |
| `script.js` | Data, interactions, live counters |
| `BRIEF.md` | Creative brief |
| `spec-0324-snail-mail-racing-league.md` | Full build spec |
