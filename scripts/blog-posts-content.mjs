/**
 * Full Gazette copy — each post has excerpt + body paragraphs (100+ words total).
 */
export const BLOG_POSTS = [
  {
    title: "Why the Azores sorting facility is every racer's best friend",
    excerpt:
      "The Ponta Delgada regional hub has delayed more league postcards than any other facility on earth.",
    body: [
      "Every serious racer eventually learns to love Ponta Delgada. The Azores sorting facility is not glamorous — fluorescent lights, a coffee machine that has not worked since 2019, and a backlog tray labelled 'International / Unclear' — but it is reliable. Cards enter the hub with crisp departure postmarks and leave with the soft, patient ambiguity that defines a winning season.",
      "League statisticians estimate that forty-one percent of all Season 12 entries spent at least six weeks in Ponta Delgada, often without moving more than four metres. Clerks there are not negligent; they are thorough. Each sack is opened, inspected, re-taped, and placed on a shelf that faces the Atlantic, as if the ocean itself might suggest a routing decision.",
      "Veterans route through the Azores on purpose. Newcomers arrive by accident and call it bad luck until the standings update. The facility has never disqualified a card, never lost one to airmail reroute, and never once apologised for being slow. In competitive postal racing, that consistency is worth more than speed.",
    ],
  },
  {
    title: "Season 13 in review: the year of the mislabelled sack",
    excerpt:
      "A single clerical error in Panama rerouted eleven entries and reshaped the standings.",
    body: [
      "Season 13 began with the quiet conviction that paperwork would behave. It did not. On 4 April, a bonded warehouse clerk in Colón mislabelled a canvas sack bound for Lima as perishable fruit. Eleven league postcards were inside, each stamped and sealed according to regulation. The sack toured three Panamanian depots, sat in a humid holding room for seven months, and resurfaced in Veracruz with mildew and a fresh stack of routing stickers.",
      "The error reshaped the standings in ways no deliberate strategy could rival. Cards that had left Auckland and Reykjavík weeks apart arrived on the same Tuesday, separated only by postmark ink. @slowpost_nz, who had engineered a respectable crawl through the South Atlantic, found their entry leapfrogged by a misrouted novice from Winnipeg. The discipline committee ruled the delay legitimate: the league measures postal fate, not intent.",
      "By December, Season 13 had delivered the lowest average transit speed in five years. Racers called it quiet. Historians, we suspect, will call it glorious.",
    ],
  },
  {
    title: "The postmaster of Pitcairn on patience, rats, and rubber stamps",
    excerpt:
      "The island's sole postal clerk has hand-cancelled more league legends than anyone alive.",
    body: [
      "Mavis Henare has been Pitcairn's postmaster for twenty-two years, which on an island of forty-seven residents makes her the entire department. She has hand-cancelled more league postcards than any official in the sport, usually at a kitchen table overlooking Bounty Bay while waiting for the quarterly supply ship to appear on the horizon.",
      "'People ask if I mind the rats,' she told The Gazette by shortwave radio. 'The rats mind the rubber stamps. They chew the handles, not the cards. The cards are league property. Even the rats know that.' Her cancellation technique — firm, slightly off-centre, always legible — has become a benchmark for remote hubs.",
      "Pitcairn receives outbound mail roughly four times a year. Racers who route through the island accept that their cards may sit in Mavis's wire basket through an entire austral winter. None have ever been disqualified for it. Several have won seasons because of it. She does not keep a leaderboard. She keeps a ledger, a magnifying glass, and a drawer of spare ink pads that smell faintly of salt.",
    ],
  },
  {
    title: "Letter from the sorting clerk of Ascension Island",
    excerpt:
      "A firsthand account of holding league mail during a cargo drought that lasted nineteen months.",
    body: [
      "Sir — Forgive the formal address; we still draft correspondence as if the next ship might carry it personally. I am the senior sorting clerk at Georgetown, Ascension Island. Since March of last year, our outbound cargo schedule has been what the captain calls 'aspirational.' Your league's postcards have remained in my custody throughout.",
      "There were forty-three cards in the February sack, all regulation size, all correctly franked. I stored them in a tin bread box on the shelf above the radio, away from damp and curious frigatebirds. When the drought passed, I processed them in strict postmark order. Several racers wrote to thank me. One sent biscuits. The biscuits arrived after the cards, which seems appropriate.",
      "I write not to boast but to clarify: delays here are geographic, not negligent. Ascension sits where the Atlantic widens and schedules thin. Your members who route through us are not gambling on incompetence. They are gambling on distance, and distance has never rushed for anyone. Yours faithfully, E. Croft, Acting Clerk.",
    ],
  },
  {
    title: "Five routes that look fast but aren't",
    excerpt:
      "Capital-to-capital shortcuts that disqualify, and the obscure corridors that don't.",
    body: [
      "New racers often mistake a map for a rule book. A line between two capital cities looks efficient until you read the league's corridor list and discover that direct airmail between major hubs is not eligible, no matter how slowly the airline claims to operate. The five routes below trap entrants every season.",
      "First: London to Paris via Channel tunnel post — disqualifying, because the tunnel counts as expedited infrastructure. Second: Singapore to Kuala Lumpur surface — too short; the committee requires at least one non-adjacent border crossing. Third: Reykjavík to Oslo 'scenic' — scenic is not slow when ferries run daily. Fourth: Dubai to Doha — same customs union, same problem. Fifth: any route advertised as 'priority economy,' which is an oxymoron the league does not recognise.",
      "What does work? Think Pitcairn to Ulaanbaatar via Ascension. Think Tuvalu to Liechtenstein with a mandatory Azores layover. The ugly corridors score. The elegant ones get you a polite letter from Zurich and an early off-season.",
    ],
  },
  {
    title: "Season 14 midpoint: who's still in the post?",
    excerpt:
      "At the halfway mark, 612 cards remain in transit. We rank the corridors doing the most work.",
    body: [
      "We have reached the midpoint of Season 14, and 612 postcards remain somewhere between departure desk and destination tray. That is not a crisis. It is the sport. Still, the halfway mark is a useful moment to ask which corridors are carrying the most weight — and which racers should stop refreshing their inboxes.",
      "The South Atlantic surface corridor leads the table, as it has since Season 9. Forty-one active entries are currently between Cape Town and Montevideo, including three cards that have been 'almost cleared' since November. The Azores hub accounts for another ninety-seven cards, none of them lost, several of them famous. The Pacific island chain — Tuvalu, Kiribati, Nauru — continues to overperform for veterans who can tolerate silence.",
      "At the front of the standings, @island_hopper holds a narrow lead with 1,247 days elapsed, though two newcomers routing through St. Helena are gaining in the only unit that matters: time not yet finished. If you posted in January and have heard nothing, congratulations. You are still racing. The league will call when someone wins, or when five years pass, whichever feels slower.",
    ],
  },
];

export function wordCount(post) {
  return (post.body || []).join(" ").split(/\s+/).filter(Boolean).length;
}

export function richContent(paragraphs, lc = () => crypto.randomUUID()) {
  const para = (text) => ({
    type: "PARAGRAPH",
    id: lc(),
    nodes: [{ type: "TEXT", id: lc(), textData: { text, decorations: [] } }],
  });
  return { nodes: paragraphs.map(para) };
}
