#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const SITE_ID = "56d7087c-434a-45a1-a38b-277ff14c6016";
const CLIENT_ID = "5b263943-273d-425f-b980-0eb2873c2864";

function token() {
  const r = spawnSync("npx", ["-y", "@wix/cli@latest", "token", "--site", SITE_ID], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(r.stderr || "token failed");
  return r.stdout.trim();
}

async function api(method, path, body) {
  const TOKEN = token();
  const res = await fetch(`https://www.wixapis.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "wix-site-id": SITE_ID,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 500)}`);
  return json;
}

function lc() {
  return crypto.randomUUID();
}

const PERMS = { insert: "ADMIN", update: "ADMIN", remove: "ADMIN", read: "ANYONE" };

async function createCollection(id, displayName, fields) {
  try {
    return await api("POST", "/wix-data/v2/collections", {
      collection: { id, displayName, fields, permissions: PERMS },
    });
  } catch (e) {
    if (String(e).includes("already exists") || String(e).includes("COLLECTION_ALREADY_EXISTS") || String(e).includes("409")) {
      return { exists: true };
    }
    await new Promise((r) => setTimeout(r, 2000));
    try {
      return await api("POST", "/wix-data/v2/collections", {
        collection: { id, displayName, fields, permissions: PERMS },
      });
    } catch (e2) {
      if (String(e2).includes("already exists") || String(e2).includes("409")) return { exists: true };
      throw e2;
    }
  }
}

async function bulkInsert(collectionId, items) {
  return api("POST", "/wix-data/v2/bulk/items/insert", {
    dataCollectionId: collectionId,
    dataItems: items.map((data) => ({ data })),
    returnEntity: true,
  });
}

async function seedCMS() {
  const text = (k, d) => ({ key: k, displayName: d, type: "TEXT" });
  const num = (k, d) => ({ key: k, displayName: d, type: "NUMBER" });

  await createCollection("StandingsRow", "Standings Row", [
    num("rank", "Rank"), text("memberHandle", "Member"), text("flag", "Flag"),
    text("originCountry", "Origin"), text("destination", "Destination"),
    num("daysInTransit", "Days in Transit"), text("status", "Status"),
  ]);

  await createCollection("LegendaryDelivery", "Legendary Delivery", [
    text("title", "Title"), text("origin", "Origin"), text("destination", "Destination"),
    text("routeVia", "Route Via"), num("transitDays", "Transit Days"),
    text("season", "Season"), text("memberHandle", "Member"), text("story", "Story"),
  ]);

  await createCollection("MemberTestimonial", "Member Testimonial", [
    text("name", "Name"), text("country", "Country"), text("flag", "Flag"),
    num("seasonsCompeted", "Seasons"), text("quote", "Quote"),
  ]);

  try {
    await api("POST", "/wix-data/v2/collections", {
      collection: {
        id: "MemberRace",
        displayName: "Member Race",
        fields: [
          text("origin", "Origin"), text("destination", "Destination"),
          text("season", "Season"), num("daysInTransit", "Days in Transit"),
          text("status", "Status"), text("departedAt", "Departed At"),
        ],
        permissions: {
          read: "SITE_MEMBER_AUTHOR",
          insert: "SITE_MEMBER",
          update: "SITE_MEMBER_AUTHOR",
          remove: "SITE_MEMBER_AUTHOR",
        },
      },
    });
  } catch (e) {
    if (!String(e).includes("already exists") && !String(e).includes("409")) throw e;
  }

  const standings = [
    { rank: 1, memberHandle: "@island_hopper", flag: "🇳🇷", originCountry: "Nauru", destination: "Mongolia", daysInTransit: 1247, status: "transit" },
    { rank: 2, memberHandle: "@slowpost_nz", flag: "🇳🇺", originCountry: "Niue", destination: "Andorra", daysInTransit: 1189, status: "transit" },
    { rank: 3, memberHandle: "@deepsouth_mailer", flag: "🇰🇮", originCountry: "Kiribati", destination: "San Marino", daysInTransit: 1102, status: "transit" },
    { rank: 4, memberHandle: "@nordlys_sender", flag: "🇳🇴", originCountry: "Norway", destination: "Argentina", daysInTransit: 958, status: "transit" },
    { rank: 5, memberHandle: "@atoll_annie", flag: "🇹🇻", originCountry: "Tuvalu", destination: "Liechtenstein", daysInTransit: 844, status: "transit" },
    { rank: 6, memberHandle: "@surface_only", flag: "🇫🇴", originCountry: "Faroe Islands", destination: "Lesotho", daysInTransit: 611, status: "transit" },
    { rank: 7, memberHandle: "@lost_at_azores", flag: "🇵🇹", originCountry: "Azores", destination: "Vanuatu", daysInTransit: 0, status: "lost" },
    { rank: 8, memberHandle: "@vaduz_val", flag: "🇱🇮", originCountry: "Liechtenstein", destination: "Tuvalu", daysInTransit: 492, status: "arrived" },
  ];

  const hof = [
    { title: "The Pitcairn Crawl", origin: "Tuvalu", destination: "Liechtenstein", routeVia: "via Pitcairn, Ascension, St. Helena", transitDays: 4017, season: "Season 3", memberHandle: "@deepsouth_mailer", story: "Left Funafuti on 9 March 2014, cleared customs in six days, then vanished for fourteen months before surfacing on Pitcairn." },
    { title: "The Arctic Detour", origin: "Tromsø", destination: "Ushuaia", routeVia: "via Svalbard, Greenland, Iceland, Azores", transitDays: 2341, season: "Season 5", memberHandle: "@nordlys_sender", story: "Took a voluntary northern detour through Longyearbyen, where winter darkness held it for nine months." },
    { title: "The Andean Wait", origin: "La Rinconada", destination: "Reykjavík", routeVia: "via Lima, Panama, Ponta Delgada", transitDays: 1988, season: "Season 7", memberHandle: "@altitude_post", story: "Descended from the world's highest post office by mule, then spent nineteen months in a Panamanian bonded warehouse." },
    { title: "The Chagos Loop", origin: "Diego Garcia", destination: "Nuuk", routeVia: "via Mauritius, Réunion, Marseille", transitDays: 1774, season: "Season 8", memberHandle: "@indian_ocean_ivan", story: "Delayed indefinitely by the absence of any civilian postal route off the atoll." },
    { title: "The Sealed Sack", origin: "Tristan da Cunha", destination: "Ulaanbaatar", routeVia: "via Cape Town, Rotterdam", transitDays: 1655, season: "Season 6", memberHandle: "@remotest_regina", story: "Mailed from the most remote inhabited island on earth." },
    { title: "The Frozen Ledger", origin: "McMurdo", destination: "Valletta", routeVia: "via Christchurch, Singapore", transitDays: 1499, season: "Season 9", memberHandle: "@antarctic_archie", story: "Held over an entire austral winter when the last flight departed six hours early." },
    { title: "The Baltic Braid", origin: "Riga", destination: "Hobart", routeVia: "via Kaliningrad, Åland, Murmansk", transitDays: 1388, season: "Season 10", memberHandle: "@baltic_bureau", story: "Diverted north through Murmansk during a Baltic ice event and sat in a heated depot for eleven months." },
    { title: "The Sahel Switchback", origin: "Bamako", destination: "Reykjavík", routeVia: "via Nouakchott, Canary Islands", transitDays: 1262, season: "Season 11", memberHandle: "@sahel_slow", story: "Crossed the Sahara by surface sack, then waited two seasons for a northbound fishing-vessel mail contract." },
    { title: "The Coral Triangle", origin: "Palau", destination: "Monaco", routeVia: "via Papua New Guinea, Timor-Leste", transitDays: 1155, season: "Season 12", memberHandle: "@reef_router", story: "Mis-sorted in Port Moresby and toured three island hubs before a Mediterranean feeder flight." },
    { title: "The Ross Dependency Run", origin: "Scott Base", destination: "Thimphu", routeVia: "via Christchurch, Mumbai", transitDays: 1089, season: "Season 13", memberHandle: "@ice_mail", story: "Wintered at McMurdo, then spent nine months in a Mumbai customs queue with ambiguous paperwork." },
  ];

  const testimonials = [
    { name: "Ingrid Haugen", country: "Norway", flag: "🇳🇴", seasonsCompeted: 6, quote: "I mailed a postcard to myself through four Pacific islands. It arrived three years later with a bite mark." },
    { name: "Tomás Ferreira", country: "Portugal", flag: "🇵🇹", seasonsCompeted: 4, quote: "My Season 9 entry is still in transit. I check the tracking page every morning like a meditation." },
  ];

  await bulkInsert("StandingsRow", standings);
  await bulkInsert("LegendaryDelivery", hof);
  await bulkInsert("MemberTestimonial", testimonials);

  return {
    collections: {
      standings: "StandingsRow",
      hallOfFame: "LegendaryDelivery",
      testimonials: "MemberTestimonial",
      memberRaces: "MemberRace",
    },
  };
}

async function seedForm() {
  const list = await api("GET", "/form-schema-service/v4/forms?namespace=wix.form_app.form");
  for (const f of list.forms || []) {
    await api("DELETE", `/form-schema-service/v4/forms/${f.id}`);
  }

  const F1 = lc(), F2 = lc(), F3 = lc(), F4 = lc(), F5 = lc(), SUB = lc(), STEP = lc();
  const field = (id, identifier, target, label, format, required = true) => ({
    id, hidden: false, identifier, fieldType: "INPUT",
    inputOptions: {
      target, pii: true, required, inputType: "STRING", readOnly: false,
      stringOptions: {
        validation: { format, enum: [] },
        componentType: "TEXT_INPUT",
        textInputOptions: { label, showLabel: true },
      },
    },
  });

  const created = await api("POST", "/form-schema-service/v4/forms", {
    form: {
      name: "League Registration",
      namespace: "wix.form_app.form",
      enabled: true,
      formFields: [
        { id: SUB, hidden: false, identifier: "SUBMIT_BUTTON", fieldType: "DISPLAY",
          displayOptions: { displayFieldType: "PAGE_NAVIGATION", pageNavigationOptions: { nextPageText: "Next", previousPageText: "Back", submitText: "Submit registration" } } },
        field(F1, "CONTACTS_FIRST_NAME", "full_name", "Full name", "UNKNOWN_FORMAT"),
        field(F2, "CONTACTS_EMAIL", "email", "Email", "EMAIL"),
        field(F3, "CONTACTS_COMPANY", "country", "Country", "UNKNOWN_FORMAT"),
        field(F4, "CONTACTS_LAST_NAME", "preferred_race_format", "Preferred race format", "UNKNOWN_FORMAT"),
        { ...field(F5, "CONTACTS_PHONE", "message", "Message (optional)", "UNKNOWN_FORMAT", false) },
      ],
      steps: [{ id: STEP, name: "Page 1", layout: { large: { items: [
        { fieldId: F1, row: 0, column: 0, width: 12, height: 1 },
        { fieldId: F2, row: 1, column: 0, width: 12, height: 1 },
        { fieldId: F3, row: 2, column: 0, width: 12, height: 1 },
        { fieldId: F4, row: 3, column: 0, width: 12, height: 1 },
        { fieldId: F5, row: 4, column: 0, width: 12, height: 1 },
        { fieldId: SUB, row: 5, column: 0, width: 12, height: 1 },
      ], sections: [] } } }],
    },
  });

  return {
    formId: created.form.id,
    targets: ["full_name", "email", "country", "preferred_race_format", "message"],
  };
}

async function seedBlog() {
  const members = await api("GET", "/members/v1/members?fieldsets=PUBLIC&paging.limit=1");
  const memberId = members.members?.[0]?.id;
  if (!memberId) throw new Error("No member for blog author");

  const para = (text) => ({ type: "PARAGRAPH", id: lc(), nodes: [{ type: "TEXT", id: lc(), textData: { text, decorations: [] } }] });
  const posts = [
    { title: "Why the Azores sorting facility is every racer's best friend", excerpt: "The Ponta Delgada regional hub has delayed more league postcards than any other facility on earth." },
    { title: "Season 13 in review: the year of the mislabelled sack", excerpt: "A single clerical error in Panama rerouted eleven entries and reshaped the standings." },
    { title: "The postmaster of Pitcairn on patience, rats, and rubber stamps", excerpt: "The island's sole postal clerk has hand-cancelled more league legends than anyone alive." },
    { title: "Letter from the sorting clerk of Ascension Island", excerpt: "A firsthand account of holding league mail during a cargo drought that lasted nineteen months." },
    { title: "Five routes that look fast but aren't", excerpt: "Capital-to-capital shortcuts that disqualify, and the obscure corridors that don't." },
    { title: "Season 14 midpoint: who's still in the post?", excerpt: "At the halfway mark, 612 cards remain in transit. We rank the corridors doing the most work." },
  ];

  await api("POST", "/blog/v3/bulk/draft-posts/create", {
    publish: true,
    draftPosts: posts.map((p) => ({
      title: p.title,
      memberId,
      excerpt: p.excerpt,
      richContent: { nodes: [para(p.excerpt)] },
    })),
  });
}

async function seedEvents() {
  const events = [
    { title: "Season 15 Mail-Off", desc: "Global / Remote · Open Corridor format", start: "2026-08-14T10:00:00.000Z", end: "2026-08-14T18:00:00.000Z" },
    { title: "Annual Slow Gala", desc: "Zurich, CH · In person", start: "2026-10-03T18:00:00.000Z", end: "2026-10-03T23:00:00.000Z" },
    { title: "Return-to-Sender Invitational", desc: "Global / Remote · Purists only", start: "2026-11-21T10:00:00.000Z", end: "2026-11-21T18:00:00.000Z" },
  ];

  for (const ev of events) {
    const draft = await api("POST", "/events/v3/events", {
      draft: true,
      event: {
        title: ev.title,
        shortDescription: ev.desc,
        location: { name: ev.desc.includes("Zurich") ? "Zurich, CH" : "Global / Remote", type: ev.desc.includes("Zurich") ? "VENUE" : "ONLINE" },
        dateAndTimeSettings: { startDate: ev.start, endDate: ev.end, timeZoneId: "Europe/Zurich", showTimeZone: true },
        registration: { initialType: "RSVP", rsvp: { responseType: "YES_ONLY" } },
      },
      fields: ["DETAILS", "TEXTS", "REGISTRATION", "URLS"],
    });
    const eventId = draft.event?.id || draft.id;
    await api("POST", `/events/v3/events/${eventId}/publish`, {});
  }
}

const cms = await seedCMS();
const form = await seedForm();
await seedBlog();
await seedEvents();

const handoff = { siteId: SITE_ID, clientId: CLIENT_ID, cms, form };
writeFileSync("wix-handoff.json", JSON.stringify(handoff, null, 2));
console.log(JSON.stringify(handoff, null, 2));
