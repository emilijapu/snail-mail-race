(function(){
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- DATA ---------- */
  var leaders = [
    {rank:1, handle:"@island_hopper", route:"Nauru → Mongolia", days:1247},
    {rank:2, handle:"@slowpost_nz",  route:"Niue → Andorra",   days:1189},
    {rank:3, handle:"@deepsouth_mailer", route:"Kiribati → San Marino", days:1102}
  ];

  var standings = [
    {rank:1, handle:"@island_hopper", flag:"🇳🇷", origin:"Nauru", dest:"Mongolia", days:1247, status:"transit"},
    {rank:2, handle:"@slowpost_nz",  flag:"🇳🇺", origin:"Niue", dest:"Andorra", days:1189, status:"transit"},
    {rank:3, handle:"@deepsouth_mailer", flag:"🇰🇮", origin:"Kiribati", dest:"San Marino", days:1102, status:"transit"},
    {rank:4, handle:"@nordlys_sender", flag:"🇳🇴", origin:"Norway", dest:"Argentina", days:958, status:"transit"},
    {rank:5, handle:"@atoll_annie",   flag:"🇹🇻", origin:"Tuvalu", dest:"Liechtenstein", days:844, status:"transit"},
    {rank:6, handle:"@surface_only",  flag:"🇫🇴", origin:"Faroe Islands", dest:"Lesotho", days:611, status:"transit"},
    {rank:7, handle:"@lost_at_azores",flag:"🇵🇹", origin:"Azores", dest:"Vanuatu", days:0, status:"lost"},
    {rank:8, handle:"@vaduz_val",     flag:"🇱🇮", origin:"Liechtenstein", dest:"Tuvalu", days:492, status:"arrived"}
  ];

  var hof = [
    {title:"The Pitcairn Crawl", route:"Tuvalu → Liechtenstein · via Pitcairn, Ascension, St. Helena", days:4017, season:"Season 3", who:"@deepsouth_mailer",
     story:"Left Funafuti on 9 March 2014, cleared customs in six days, then vanished for fourteen months before surfacing on Pitcairn. It waited two years in Ascension for a northbound cargo route, then took eleven months by surface mail via Cape Town and Rotterdam. Arrived bearing seven customs stamps, two coffee stains, and a corner chewed by 'probably a rat, possibly a cat.'"},
    {title:"The Arctic Detour", route:"Tromsø → Ushuaia · via Svalbard, Greenland, Iceland, Azores", days:2341, season:"Season 5", who:"@nordlys_sender",
     story:"Took a voluntary northern detour through Longyearbyen, where winter darkness and a skeleton postal staff held it for nine months. It resurfaced in Nuuk, crossed to Reykjavik by fishing-vessel mail, then drifted through the Azores sorting system for over a year before a flight bag carried it south."},
    {title:"The Andean Wait", route:"La Rinconada → Reykjavík · via Lima, Panama, Ponta Delgada", days:1988, season:"Season 7", who:"@altitude_post",
     story:"Descended from the world's highest post office by mule, then spent nineteen months in a Panamanian bonded warehouse after a clerical typo listed it as 'perishable goods.' Eventually reclassified and released to the Azores, where it enjoyed the customary extended holiday."},
    {title:"The Chagos Loop", route:"Diego Garcia → Nuuk · via Mauritius, Réunion, Marseille", days:1774, season:"Season 8", who:"@indian_ocean_ivan",
     story:"Delayed indefinitely by the absence of any civilian postal route off the atoll, it hitched a ride with a supply vessel to Mauritius, looped through Réunion twice due to a manifest error, and reached Greenland just before the winter freeze closed the port."},
    {title:"The Sealed Sack", route:"Tristan da Cunha → Ulaanbaatar · via Cape Town, Rotterdam", days:1655, season:"Season 6", who:"@remotest_regina",
     story:"Mailed from the most remote inhabited island on earth, which receives post roughly nine times a year by ship. It waited four months for the next departure before even beginning its journey — a delay the committee ruled 'entirely legitimate.'"},
    {title:"The Frozen Ledger", route:"McMurdo → Valletta · via Christchurch, Singapore", days:1499, season:"Season 9", who:"@antarctic_archie",
     story:"Held over an entire austral winter when the last flight of the season departed six hours before the card reached the outgoing tray. Spent the dark months in a filing cabinet, emerging in spring with the postmaster's apology and a small drawing of a penguin."}
  ];

  var posts = [
    {cat:"Route Analysis", date:"14 Feb 2025", slug:"why-the-azores-sorting-facility-is-every-racer-s-best-friend", title:"Why the Azores sorting facility is every racer's best friend", excerpt:"The Ponta Delgada regional hub has delayed more league postcards than any other facility on earth. We investigate why."},
    {cat:"Season Recap", date:"02 Jan 2025", slug:"season-13-in-review-the-year-of-the-mislabelled-sack", title:"Season 13 in review: the year of the mislabelled sack", excerpt:"A single clerical error in Panama rerouted eleven entries and reshaped the standings. A quiet, glorious season."},
    {cat:"Interview", date:"09 Dec 2024", slug:"the-postmaster-of-pitcairn-on-patience-rats-and-rubber-stamps", title:"The postmaster of Pitcairn on patience, rats, and rubber stamps", excerpt:"The island's sole postal clerk has hand-cancelled more league legends than anyone alive. He is in no hurry to stop."}
  ];

  var faqs = [
    {q:"How does a race actually work?", a:"Every racer mails an identical league-stamped postcard from their chosen origin to a shared destination using the slowest available postal route. The last postcard to arrive wins the season. There is no tracking — only the postmark dates on departure and arrival count."},
    {q:"Can I choose any route?", a:"Routes must use at least one approved slow corridor from the official list. Direct airmail between major cities is not eligible. The goal is obscure, indirect, and surface-level transit."},
    {q:"What if my postcard never arrives?", a:"A postcard declared lost after 5 years earns an honorable mention in the Hall of Fame but does not count as a finish. Several Season 2 entries are still technically in transit."},
    {q:"Is there a membership fee?", a:"Season registration is free. Members cover their own postage, which depending on route can range from under a dollar to roughly twelve dollars for the most remote corridors."},
    {q:"How do you verify arrival dates?", a:"The destination address is a league-operated PO box. Our postmaster photographs each arriving card with its postmarks and timestamps. Results are posted to the standings page within 48 hours of receipt."},
    {q:"Can I compete from any country?", a:"Yes. We have members in 91 countries. As long as your national postal service accepts outbound international mail, you can race."}
  ];

  var pc = document.getElementById("postcard");
  if (pc && !reduce) pc.classList.add("animate");

  var hamb = document.getElementById("hamb");
  var menu = document.getElementById("mobileMenu");
  if (hamb && menu) {
    hamb.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      hamb.setAttribute("aria-expanded", open);
      hamb.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        hamb.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initBelowFold() {
  /* ---------- SECTION CORNER STICKERS ---------- */
  function stampSVG(label){
    var id = "wm"+Math.random().toString(36).slice(2,8);
    return '<svg viewBox="0 0 200 200" aria-hidden="true">'
      +'<circle cx="100" cy="100" r="94" fill="#FFCE3A" stroke="#141210" stroke-width="7"/>'
      +'<circle cx="100" cy="100" r="72" fill="none" stroke="#141210" stroke-width="3"/>'
      +'<path id="'+id+'" d="M100 100 m-83 0 a83 83 0 1 1 166 0 a83 83 0 1 1 -166 0" fill="none"/>'
      +'<text font-family="Space Mono, monospace" font-weight="700" font-size="14" letter-spacing="1.5" fill="#141210">'
      +'<textPath href="#'+id+'" startOffset="0%">'+label+' · SNAIL MAIL RACING LEAGUE · </textPath></text>'
      +'<text x="100" y="96" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="30" fill="#141210">SMRL</text>'
      +'<text x="100" y="120" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="11" letter-spacing="2" fill="#EE3B2F">ZURICH·CH</text>'
      +'</svg>';
  }
  var wmLabels = {transit:"IN TRANSIT",how:"PROCEDURE",
    "hall-of-fame":"THE ARCHIVE",gazette:"THE GAZETTE",register:"FORM 14-B"};
  document.querySelectorAll("[id]").forEach(function(sec){
    var wm = sec.querySelector(":scope > .stamp-wm");
    if(wm && wmLabels[sec.id] && !wm.querySelector("svg")) wm.innerHTML = stampSVG(wmLabels[sec.id]);
  });
  var ctaWm = document.querySelector(".cta-band .stamp-wm");
  if(ctaWm && !ctaWm.querySelector("svg")) ctaWm.innerHTML = stampSVG("SEASON 14");
  var seamSeal = document.querySelector(".seam-seal");
  if(seamSeal && !seamSeal.querySelector("svg")) seamSeal.innerHTML = stampSVG("OFFICIAL SEAL");

  /* ---------- LIVE TRANSIT COUNTERS (bonus) ---------- */
  var leadersEl = document.getElementById("leaders");
  if (leadersEl) {
  var leaderNodes = leadersEl.querySelectorAll(".leader");
  var wiredLeaders = [];
  if (leaderNodes.length) {
    leaderNodes.forEach(function(el, i){
      var days = +el.getAttribute("data-days") || (leaders[i] && leaders[i].days) || 0;
      wiredLeaders.push({days: days, depart: new Date(Date.now() - days*86400000), node: el});
    });
  } else {
  leaders.forEach(function(l){
    l.depart = new Date(Date.now() - l.days*86400000);
    var el = document.createElement("div");
    el.className = "leader";
    el.setAttribute("role","group");
    el.innerHTML =
      '<div class="lead-rank">Leader · No. '+l.rank+'</div>'
      +'<div class="lead-route">'+l.route+'</div>'
      +'<div class="lead-handle">'+l.handle+'</div>'
      +'<div class="bignum"><span class="dval">'+l.days+'</span><small>days in transit</small></div>'
      +'<div class="clock"><span>elapsed</span><b class="cval">—</b></div>';
    leadersEl.appendChild(el);
    wiredLeaders.push({days: l.days, depart: l.depart, node: el});
  });
  }
  function pad(n){return (n<10?"0":"")+n;}
  function tickLeaders(){
    var now = Date.now();
    wiredLeaders.forEach(function(l){
      var ms = now - l.depart.getTime();
      var totalSec = Math.floor(ms/1000);
      var d = Math.floor(totalSec/86400);
      var h = Math.floor((totalSec%86400)/3600);
      var m = Math.floor((totalSec%3600)/60);
      var s = totalSec%60;
      l.node.querySelector(".dval").textContent = d.toLocaleString();
      l.node.querySelector(".cval").textContent = h+"h "+pad(m)+"m "+pad(s)+"s";
    });
  }
  tickLeaders();
  if(!reduce) setInterval(tickLeaders,1000);
  }

  /* ---------- STANDINGS TABLE + count-up ---------- */
  var body = document.getElementById("standingsBody");
  if (body && !body.children.length) {
  var statusMap = {transit:["In Transit","transit"],arrived:["Arrived","arrived"],lost:["Lost","lost"]};
  standings.forEach(function(r){
    var tr = document.createElement("tr");
    var st = statusMap[r.status];
    var daysHtml = r.status==="lost"
      ? '<span class="days" style="font-size:15px;color:var(--muted)">— <small>presumed lost</small></span>'
      : '<span class="days"><span class="cu" data-target="'+r.days+'">0</span><small>days</small></span>';
    tr.innerHTML =
      '<td class="rk">'+r.rank+'</td>'
      +'<td><span class="handle">'+r.handle+'</span></td>'
      +'<td class="flagcell"><span class="fg" aria-hidden="true">'+r.flag+'</span>'+r.origin+'</td>'
      +'<td>'+r.dest+'</td>'
      +'<td>'+daysHtml+'</td>'
      +'<td><span class="badge badge--'+st[1]+'">'+st[0]+'</span></td>';
    body.appendChild(tr);
  });
  }
  function countUp(el){
    var target = +el.getAttribute("data-target");
    if(reduce){ el.textContent = target.toLocaleString(); return; }
    var start=null, dur=1400;
    function step(t){
      if(!start) start=t;
      var p=Math.min((t-start)/dur,1);
      var eased=1-Math.pow(1-p,3);
      el.textContent = Math.floor(eased*target).toLocaleString();
      if(p<1) requestAnimationFrame(step); else el.textContent=target.toLocaleString();
    }
    requestAnimationFrame(step);
  }
  var cuDone=false;
  function runCountUp(){
    document.querySelectorAll(".cu").forEach(countUp);
  }
  var cuObs=new IntersectionObserver(function(ents){
    ents.forEach(function(e){
      if(e.isIntersecting && !cuDone){
        cuDone=true;
        runCountUp();
      }
    });
  },{threshold:.3});
  var stTable=document.getElementById("standingsTable");
  if(stTable) cuObs.observe(stTable);
  window.addEventListener("wix:standings-rendered", function(){
    cuDone=false;
    runCountUp();
  });

  /* ---------- HALL OF FAME ---------- */
  var rail = document.getElementById("hofRail");
  if (rail) {
  hof.forEach(function(h){
    var card = document.createElement("li");
    card.className="hof-card";
    card.innerHTML =
      '<div class="pcwrap">'+miniPostcard(h)+'</div>'
      +'<div class="body">'
        +'<span class="season">'+h.season+'</span>'
        +'<h3>'+h.title+'</h3>'
        +'<p class="route">'+h.route+'</p>'
        +'<div class="hof-days">'+h.days.toLocaleString()+' <small>days in transit</small></div>'
        +'<p class="story">'+h.story+'</p>'
        +'<p class="whom">'+h.who+'</p>'
      +'</div>';
    rail.appendChild(card);
  });
  function miniPostcard(h){
    var r1 = (Math.random()*10-5).toFixed(1), r2=(Math.random()*16-8).toFixed(1);
    return '<svg viewBox="0 0 300 150" role="img" aria-label="Illustrated postcard from '+h.title+', '+h.days+' days in transit">'
      +'<rect x="4" y="4" width="292" height="142" rx="6" fill="#FFFEF9" stroke="#141210" stroke-width="4"/>'
      +'<rect x="9" y="9" width="282" height="9" fill="#EE3B2F"/><rect x="9" y="132" width="282" height="9" fill="#2F63FF"/>'
      +'<line x1="150" y1="26" x2="150" y2="124" stroke="#141210" stroke-dasharray="2 5" stroke-width="1.5"/>'
      +'<g stroke="#141210" stroke-width="1.6" opacity="0.4" stroke-linecap="round"><path d="M24 44 h84"/><path d="M24 62 h96"/><path d="M24 80 h68"/></g>'
      +'<g stroke="#141210" stroke-width="1.6" opacity="0.4" stroke-linecap="round"><path d="M172 88 h100"/><path d="M172 104 h78"/></g>'
      +'<g transform="translate(250 24) rotate(4)"><rect width="34" height="40" fill="#FFCE3A" stroke="#141210" stroke-width="3"/><circle cx="17" cy="18" r="8" fill="none" stroke="#141210" stroke-width="2"/></g>'
      +'<g transform="translate(206 80) rotate('+r2+')" opacity="0.85"><circle cx="0" cy="0" r="22" fill="none" stroke="#EE3B2F" stroke-width="2.4"/><circle cx="0" cy="0" r="14" fill="none" stroke="#EE3B2F" stroke-width="1.4"/><path d="M-11 0 h22 M-11 -3 h22 M-11 3 h22" stroke="#EE3B2F" stroke-width="1.4"/></g>'
      +'<g transform="translate(60 98) rotate('+r1+')"><rect x="0" y="0" width="72" height="20" fill="#2F63FF"/><text x="36" y="14" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="9" fill="#FFFEF9" letter-spacing="1">PAR AVION</text></g>'
      +'</svg>';
  }
  var railPrev=document.getElementById("hofPrev"), railNext=document.getElementById("hofNext");
  var railMq=window.matchMedia("(max-width:760px)");
  var railStep=railMq.matches?302:362;
  function updateRailStep(){ railStep=railMq.matches?302:362; }
  if(railMq.addEventListener) railMq.addEventListener("change",updateRailStep);
  else railMq.addListener(updateRailStep);
  function scrollRail(dir){
    rail.scrollBy({left:dir*railStep,behavior:reduce?"auto":"smooth"});
  }
  if(railPrev) railPrev.addEventListener("click",function(){scrollRail(-1);});
  if(railNext) railNext.addEventListener("click",function(){scrollRail(1);});
  }

  /* ---------- GAZETTE ---------- */
  var gaz=document.getElementById("gazGrid");
  if(gaz) posts.forEach(function(p){
    var a=document.createElement("a");
    a.href=p.slug?("/blog-post.html?slug="+encodeURIComponent(p.slug)):"/blog.html";
    a.className="post";
    a.innerHTML='<span class="cat">'+p.cat+'</span><div class="pdate">'+p.date+'</div>'
      +'<h3>'+p.title+'</h3><p>'+p.excerpt+'</p>'
      +'<span class="linkarrow">Read more <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M2 8h11M9 4l4 4-4 4"/></svg></span>';
    gaz.appendChild(a);
  });

  /* ---------- FAQ + JSON-LD ---------- */
  var faqList=document.getElementById("faqList");
  if (faqList) {
  faqs.forEach(function(f,idx){
    var item=document.createElement("div");
    item.className="faq-item";
    item.innerHTML=
      '<button class="faq-q" aria-expanded="false" aria-controls="fa'+idx+'"><span>'+f.q+'</span><span class="fic" aria-hidden="true">+</span></button>'
      +'<div class="faq-a" id="fa'+idx+'" role="region"><p>'+f.a+'</p></div>';
    faqList.appendChild(item);
    var btn=item.querySelector(".faq-q"), ans=item.querySelector(".faq-a");
    btn.addEventListener("click",function(){
      var open=item.classList.toggle("open");
      btn.setAttribute("aria-expanded",open);
      ans.style.maxHeight = open ? ans.scrollHeight+"px" : "0";
    });
  });
  var faqLd={"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(function(f){
    return {"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}};})};
  var s=document.createElement("script"); s.type="application/ld+json";
  s.textContent=JSON.stringify(faqLd); document.head.appendChild(s);
  }

  /* ---------- STICKY MOBILE JOIN ---------- */
  var sticky=document.getElementById("stickyJoin");
  var heroSec=document.querySelector(".hero");
  var sObs=new IntersectionObserver(function(ents){
    ents.forEach(function(e){ sticky.classList.toggle("show",!e.isIntersecting); });
  },{threshold:0});
  if(heroSec) sObs.observe(heroSec);

  /* ---------- REVEAL on scroll ---------- */
  if(!reduce){
    var rObs=new IntersectionObserver(function(ents){
      ents.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); rObs.unobserve(e.target);}});
    },{threshold:.15});
    document.querySelectorAll(".reveal").forEach(function(el){rObs.observe(el);});
  }
  }

  if ("requestIdleCallback" in window) {
    requestIdleCallback(initBelowFold, { timeout: 2000 });
  } else {
    setTimeout(initBelowFold, 1);
  }
})();

(function(){
  function loadWix(){
    import("./wix-app.mjs").then(function(m){ return m.init(); }).catch(function(){});
  }
  function schedule(){
    if ("requestIdleCallback" in window) requestIdleCallback(loadWix, { timeout: 5000 });
    else setTimeout(loadWix, 2000);
  }
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
})();
