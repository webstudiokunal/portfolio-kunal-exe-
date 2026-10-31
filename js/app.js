/* Kunal.exe OS — application logic. All owner content comes from content/owner-profile.js. */
(function () {
  "use strict";
  var P = window.ownerProfile;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KEYS = { theme: "kunalexe-os-theme-v1", layout: "kunalexe-os-layout-v1", boot: "kunalexe-os-boot-v1" };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isDesktop = function () { return window.innerWidth > 980; };

  /* ---------- safe helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function load(k, fallback) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage may be blocked */ } }
  function drop(k) { try { localStorage.removeItem(k); } catch (e) {} }

  /* ---------- icons (original SVG, one grammar: 24px grid, 2px stroke) ---------- */
  var G = {
    projects: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path class="hl" d="M7 13h6"/>',
    services: '<rect x="3" y="4" width="18" height="12" rx="2"/><path class="hl" d="M8 20h8M12 16v4"/><path class="ac" d="M8 10l2 2 4-4"/>',
    results: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/><path class="ac" d="M3 7l5-3 5 4 7-5"/>',
    systems: '<circle cx="12" cy="12" r="3"/><path class="hl" d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
    proof: '<rect x="3" y="5" width="18" height="14" rx="2"/><path class="ac" d="M10 9.5v5l4.5-2.5z"/>',
    journey: '<path d="M5 4v16"/><circle class="hl" cx="5" cy="6" r="2"/><circle class="hl" cx="5" cy="14" r="2"/><path class="ac" d="M10 6h9M10 14h6M10 19h8"/>',
    socials: '<path d="M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path class="ac" d="M9 10c0 3 2 5 5 5l1.5-1.5-2-1-1 .8c-.8-.4-1.4-1-1.8-1.8l.8-1-1-2z"/>',
    founder: '<path d="M6 3h9l4 4v14H6z"/><path class="hl" d="M15 3v4h4"/><path class="ac" d="M9 12h7M9 16h7"/>',
    browser: '<circle cx="12" cy="12" r="9"/><path class="hl" d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    contact: '<rect x="3" y="5" width="18" height="14" rx="2"/><path class="ac" d="M3 7l9 6 9-6"/>',
    files: '<path d="M4 6h6l2 2h8v10a2 2 0 0 1-2 2H4z"/><path class="hl" d="M4 10h16"/>',
    notes: '<path d="M5 4h14v16H5z"/><path class="hl" d="M9 8h6M9 12h6"/><path class="ac" d="M9 16h3"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path class="hl" d="M3 10h18M8 3v4M16 3v4"/><circle class="ac" cx="12" cy="15" r="1.5"/>'
  };
  function svg(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (G[id] || "") + "</svg>"; }

  /* ---------- app registry ---------- */
  var APPS = [
    { id: "projects", name: "Projects", desc: "Selected work and case files", badge: "MAIN DRIVE", w: 780, h: 540 },
    { id: "services", name: "Services", desc: "Websites built to convert", w: 760, h: 540 },
    { id: "results", name: "Results", desc: "Verified client outcomes", w: 720, h: 480 },
    { id: "systems", name: "Systems", desc: "How the work gets done", w: 740, h: 560 },
    { id: "proof", name: "Proof", desc: "Testimonials and videos", badge: "VAULT", w: 720, h: 480 },
    { id: "journey", name: "Journey", desc: "The path so far", w: 700, h: 480 },
    { id: "socials", name: "Socials", desc: "Where to find Kunal", w: 640, h: 440 },
    { id: "founder", name: "Founder.txt", desc: "A note from Kunal", w: 640, h: 500 },
    { id: "browser", name: "KunalNet", desc: "Open my live websites", w: 760, h: 520 },
    { id: "contact", name: "Contact", desc: "Start a project", badge: "FAST", w: 720, h: 600 },
    { id: "files", name: "Case Files", desc: "Project stories in folders", w: 760, h: 500 },
    { id: "notes", name: "AI Field Notes", desc: "Articles and guides", w: 700, h: 460 },
    { id: "calendar", name: "Calendar", desc: "Dates and booking", hidden: true, w: 620, h: 560 }
  ];
  var APP = {}; APPS.forEach(function (a) { APP[a.id] = a; });
  var DOCK = ["projects", "services", "journey", "contact", "browser", "calendar"];

  /* ---------- clock, transmission, identity ---------- */
  function tick() {
    var tz = P.identity.timezone, now = new Date();
    $("#clockDate").textContent = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "2-digit", month: "short" }).format(now);
    $("#clockTime").textContent = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
    $("#clockTz").textContent = P.identity.timezoneLabel;
  }
  function initIdentity() {
    var id = P.identity;
    document.title = id.fullName + " — Web Developer in Lucknow | Kunal.exe";
    $(".boot-title").textContent = id.osName; $(".sys-name").textContent = id.osName;
    $("#idRoles").textContent = id.roles.join(" · ");
    $("#idName").textContent = id.fullName;
    $("#idIntro").textContent = id.intro;
    $("#idWhatsapp").href = P.conversion.whatsappUrl;
    $("#idWhatsapp").textContent = P.conversion.primaryLabel;
    $("#callTab").href = P.conversion.whatsappUrl;
    var d = new Date(), dayN = Math.floor(d.getTime() / 864e5);
    $("#txDate").textContent = new Intl.DateTimeFormat("en-GB", { timeZone: id.timezone, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);
    $("#txText").textContent = P.transmissions[dayN % P.transmissions.length];
    var i = 0, el = $("#idDescriptor");
    el.textContent = id.descriptors[0];
    if (!reduced) setInterval(function () {
      i = (i + 1) % id.descriptors.length;
      el.style.transition = "opacity .2s, letter-spacing .25s"; el.style.opacity = "0"; el.style.letterSpacing = "6px";
      setTimeout(function () { el.textContent = id.descriptors[i]; el.style.opacity = "1"; el.style.letterSpacing = "2px"; }, 220);
    }, 3200);
  }

  /* ---------- themes ---------- */
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    $$("[data-theme-set]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-set") === t)); });
    var m = { day: "#EAF1FF", night: "#1B1650", dark: "#0B1020" }; $('meta[name="theme-color"]').setAttribute("content", m[t]);
    save(KEYS.theme, t);
  }

  /* ---------- desktop icons ---------- */
  var layout = load(KEYS.layout, {});
  function renderIcons() {
    var box = $("#icons"); box.innerHTML = "";
    APPS.filter(function (a) { return !a.hidden; }).forEach(function (a) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "app-icon"; b.dataset.app = a.id;
      b.setAttribute("aria-label", "Open " + a.name + ". " + a.desc);
      b.innerHTML = (a.badge ? '<span class="badge">' + esc(a.badge) + "</span>" : "") + '<span class="glyph">' + svg(a.id) + '</span><span class="label">' + esc(a.name) + '</span><span class="desc">' + esc(a.desc) + '</span><span class="open-dot"></span>';
      var p = layout[a.id]; if (p && isDesktop()) b.style.transform = "translate(" + p.x + "px," + p.y + "px)";
      box.appendChild(b); enableIconDrag(b, a.id);
    });
    box.classList.toggle("free", isDesktop());
    refreshOpenMarks();
  }
  function enableIconDrag(el, id) {
    var sx, sy, ox, oy, moved, active = false;
    el.addEventListener("pointerdown", function (e) {
      if (!isDesktop() || (e.pointerType === "touch") || e.button !== 0) return;
      active = true; moved = false; sx = e.clientX; sy = e.clientY;
      var p = layout[id] || { x: 0, y: 0 }; ox = p.x; oy = p.y; el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", function (e) {
      if (!active) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 6) return;
      moved = true; el.classList.add("dragging");
      var r = el.getBoundingClientRect(), cur = layout[id] || { x: 0, y: 0 };
      var nx = ox + dx, ny = oy + dy;
      var baseL = r.left - cur.x, baseT = r.top - cur.y;
      var minX = 8 - baseL, maxX = window.innerWidth - r.width - 8 - baseL;
      var minY = 60 - baseT, maxY = window.innerHeight - r.height - 100 - baseT;
      nx = Math.max(minX, Math.min(maxX, nx)); ny = Math.max(minY, Math.min(maxY, ny));
      layout[id] = { x: Math.round(nx), y: Math.round(ny) };
      el.style.transform = "translate(" + nx + "px," + ny + "px)";
    });
    function end() { if (!active) return; active = false; el.classList.remove("dragging"); if (moved) save(KEYS.layout, layout); }
    el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
    el.addEventListener("click", function (e) { if (moved) { moved = false; e.preventDefault(); return; } openApp(id); });
  }
  function resetIcons() { layout = {}; drop(KEYS.layout); renderIcons(); }

  /* ---------- dock ---------- */
  function renderDock() {
    var d = $("#dock"); d.innerHTML = "";
    DOCK.forEach(function (id) {
      var a = APP[id], b = document.createElement("button");
      b.type = "button"; b.className = "dock-btn"; b.dataset.app = id; b.dataset.label = a.name;
      b.setAttribute("aria-label", "Open " + a.name); b.innerHTML = svg(id);
      b.addEventListener("click", function () { openApp(id); }); d.appendChild(b);
    });
  }
  function refreshOpenMarks() {
    $$("[data-app]").forEach(function (b) { b.classList.toggle("is-open", !!wins[b.dataset.app]); });
  }

  /* ---------- window manager ---------- */
  var wins = {}, zTop = 10, cascade = 0;
  function openApp(id) {
    if (!APP[id]) return;
    if (wins[id]) { var w0 = wins[id]; w0.el.style.display = ""; focusWin(id); return; }
    var a = APP[id], el = document.createElement("section");
    el.className = "win"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", a.name); el.tabIndex = -1;
    var W = Math.min(a.w, window.innerWidth - 24), H = Math.min(a.h, window.innerHeight - 140);
    var left = Math.max(12, Math.round((window.innerWidth - W) / 2) + (cascade % 5) * 26 - 52);
    var top = Math.max(60, Math.round((window.innerHeight - H) / 2) - 30 + (cascade % 5) * 24);
    cascade++;
    el.style.cssText = "left:" + left + "px;top:" + top + "px;width:" + W + "px;height:" + H + "px";
    el.innerHTML = '<div class="win-bar"><div class="win-ctl"><button type="button" class="c-close" aria-label="Close ' + esc(a.name) + '"></button><button type="button" class="c-min" aria-label="Minimize ' + esc(a.name) + '"></button><button type="button" class="c-max" aria-label="Maximize or restore ' + esc(a.name) + '"></button></div><span class="win-title">' + esc(a.name) + '</span><span class="win-state"></span><button type="button" class="win-x" aria-label="Close ' + esc(a.name) + '">✕ Close</button></div><div class="win-body"></div>';
    $("#windows").appendChild(el);
    var rec = { id: id, el: el, cleanup: null }; wins[id] = rec;
    var body = $(".win-body", el); var out = RENDER[id](body, el); if (out && out.cleanup) rec.cleanup = out.cleanup; if (out && out.state) $(".win-state", el).textContent = out.state;
    $(".c-close", el).addEventListener("click", function () { closeWin(id); });
    $(".win-x", el).addEventListener("click", function () { closeWin(id); });
    $(".c-min", el).addEventListener("click", function () { el.style.display = "none"; });
    $(".c-max", el).addEventListener("click", function () { el.classList.toggle("max"); });
    $(".win-bar", el).addEventListener("dblclick", function () { el.classList.toggle("max"); });
    el.addEventListener("pointerdown", function () { focusWin(id); });
    dragWindow(el);
    focusWin(id); refreshOpenMarks();
  }
  function focusWin(id) { var w = wins[id]; if (!w) return; w.el.style.zIndex = ++zTop; w.el.focus({ preventScroll: true }); }
  function closeWin(id) { var w = wins[id]; if (!w) return; if (w.cleanup) w.cleanup(); w.el.remove(); delete wins[id]; refreshOpenMarks(); }
  function topWin() { var best = null; Object.keys(wins).forEach(function (k) { var w = wins[k]; if (w.el.style.display !== "none" && (!best || +w.el.style.zIndex > +best.el.style.zIndex)) best = w; }); return best; }
  function dragWindow(el) {
    var bar = $(".win-bar", el), sx, sy, ol, ot, on = false;
    bar.addEventListener("pointerdown", function (e) {
      if (!isDesktop() || el.classList.contains("max") || e.target.closest("button")) return;
      on = true; sx = e.clientX; sy = e.clientY; ol = el.offsetLeft; ot = el.offsetTop; bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener("pointermove", function (e) {
      if (!on) return;
      var nl = ol + e.clientX - sx, nt = ot + e.clientY - sy;
      nl = Math.max(-el.offsetWidth + 120, Math.min(window.innerWidth - 120, nl)); nt = Math.max(52, Math.min(window.innerHeight - 90, nt));
      el.style.left = nl + "px"; el.style.top = nt + "px";
    });
    function end() { on = false; } bar.addEventListener("pointerup", end); bar.addEventListener("pointercancel", end);
  }

  /* ---------- shared fragments ---------- */
  function wa(text) { return P.conversion.whatsappUrl + (text ? "?text=" + encodeURIComponent(text) : ""); }
  function placeholderNote(title, text) { return '<div class="notice"><span class="pill">TBD</span><strong>' + esc(title) + "</strong>" + esc(text) + "</div>"; }
  function waButton(label, msg) { return '<a class="btn btn-accent" target="_blank" rel="noreferrer noopener" href="' + esc(wa(msg)) + '">' + esc(label) + "</a>"; }

  /* ---------- app renderers (all content comes from content/owner-profile.js) ---------- */
  var RENDER = {};
  var STATUS = { "verified": "Verified", "client-reported": "Client-reported", "founder-reported": "Reported by Kunal", "estimated": "Estimated", "illustrative": "Illustrative example" };
  function statusTag(s) { return s && STATUS[s] ? '<span class="pill">' + esc(STATUS[s]) + "</span>" : ""; }
  function safeUrl(u) { return /^https?:\/\//i.test(u || "") ? u : ""; }
  function linkBtn(url, label) { url = safeUrl(url); return url ? '<a class="btn btn-small" target="_blank" rel="noreferrer noopener" href="' + esc(url) + '">' + esc(label) + "</a>" : ""; }
  function line(label, text) { return text ? "<p><b>" + esc(label) + "</b> " + esc(text) + "</p>" : ""; }
  function projectImages(p) {
    var images = p.images && p.images.length ? p.images : (p.image ? [p.image] : []);
    return images.map(function (src, index) {
      return '<img src="' + esc(src) + '" alt="' + esc(p.name) + ' screenshot ' + (index + 1) + '" loading="lazy" style="width:100%;border-radius:10px;border:2px solid var(--ink);margin-bottom:10px">';
    }).join("");
  }

  RENDER.projects = function (b) {
    var list = (P.projects || []).slice().sort(function (a, c) { return (c.featured ? 1 : 0) - (a.featured ? 1 : 0); });
    if (!list.length) {
      b.innerHTML = "<h3>Selected case files</h3><p class=\"muted\">Real, deployed work goes here first: category, problem, what was built, and the outcome.</p>" +
        placeholderNote("Projects coming soon", "Nothing is invented here. Each project will show its problem, what was built, the outcome and a working link.") +
        '<h4>Want to see relevant work?</h4><p>Ask directly and Kunal will share examples that fit your project.</p><div class="row">' + waButton("Ask on WhatsApp", "Hi Kunal, I found your portfolio. Can you share examples of your work?") + "</div>";
      return { state: "0 projects" };
    }
    b.innerHTML = '<div class="cardgrid">' + list.map(function (p) {
      var img = projectImages(p);
      return '<article class="card">' + img + (p.featured ? '<span class="pill">FEATURED</span> ' : "") + "<h4>" + esc(p.name) + '</h4><p class="muted">' + esc([p.category, p.dates, p.client].filter(Boolean).join(" · ")) + "</p>" +
        line("Problem:", p.problem) + line("What I built:", p.intervention) +
        (p.outcome ? "<p><b>Outcome:</b> " + esc(p.outcome) + " " + statusTag(p.outcomeStatus) + "</p>" : "") +
        (p.stack && p.stack.length ? '<p class="muted">' + esc(p.stack.join(" · ")) + "</p>" : "") + linkBtn(p.url, "Open live project") + "</article>";
    }).join("") + "</div>";
    return { state: list.length + (list.length === 1 ? " project" : " projects") };
  };

  RENDER.services = function (b) {
    b.innerHTML = "<h3>What I build</h3><p class=\"muted\">Web development, built to save you time and bring you more customers.</p><div class=\"cardgrid\">" +
      P.services.map(function (s, i) { return '<article class="card"><span class="pill">0' + (i + 1) + "</span><h4>" + esc(s.name) + "</h4><p>" + esc(s.line) + "</p><ul>" + (s.points || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></article>"; }).join("") +
      '</div><div class="row">' + waButton("Discuss your project", "Hi Kunal, I am interested in your services.") + '<button type="button" class="btn" data-go="contact">Open Contact form</button></div>';
    $('[data-go="contact"]', b).addEventListener("click", function () { openApp("contact"); });
    return { state: P.services.length + " services" };
  };

  RENDER.results = function (b) {
    var list = P.clientCases || [];
    if (!list.length) {
      b.innerHTML = "<h3>Results</h3><p class=\"muted\">Client outcomes only. Every number is labelled as verified, client-reported, reported by Kunal, estimated or illustrative.</p>" + placeholderNote("No results published yet", P.legal.metricDisclaimer);
      return { state: "0 published" };
    }
    b.innerHTML = "<h3>Results</h3><p class=\"muted\">Every number below is labelled with where it comes from.</p><div class=\"cardgrid\">" + list.map(function (r) {
      return '<article class="card"><h4>' + esc(r.client) + "</h4>" +
        (r.metric ? '<p style="font-size:30px;font-weight:800;margin:2px 0;line-height:1.1">' + esc(r.metric) + "</p>" : "") +
        (r.metricLabel ? "<p>" + esc(r.metricLabel) + "</p>" : "") + statusTag(r.status) +
        (r.source ? '<p class="muted">Source: ' + esc(r.source) + "</p>" : "") + line("Challenge:", r.challenge) + line("Delivered:", r.delivered) + linkBtn(r.url, "View project") + "</article>";
    }).join("") + "</div>";
    return { state: list.length + " published" };
  };

  RENDER.systems = function (b) {
    var steps = [
      ["Find the leverage", "Understand the business and pick the one task or page that will matter most.", "A short written scope"],
      ["Lock the system", "Agree on what gets built, what tools it connects to, and what success looks like.", "Approved plan and checklist"],
      ["Build the sharp edge", "Build the smallest working version first so you can see and test it early.", "A working first version"],
      ["Integrate the workflow", "Connect it to your forms, WhatsApp, email or spreadsheets.", "A live, connected system"],
      ["Prove and hand off", "Test it with real cases, document it, and show your team how to use it.", "Tested system and handover notes"]
    ];
    b.innerHTML = '<span class="pill">DRAFT</span><h3>Working method</h3><p class="muted">A five-step loop. Draft wording: edit the steps in js/app.js (RENDER.systems) or ask Copilot to rewrite them.</p><ol class="steps">' +
      steps.map(function (s) { return "<li><b>" + esc(s[0]) + "</b><span>" + esc(s[1]) + " <em>Output: " + esc(s[2]) + ".</em></span></li>"; }).join("") + "</ol>";
    return { state: "5 steps" };
  };

  RENDER.proof = function (b) {
    var list = (P.testimonials || []).filter(function (t) { return t.approved === true; });
    if (!list.length) {
      b.innerHTML = "<h3>Proof vault</h3><p class=\"muted\">Approved client testimonials and videos live here. Nothing is shown without the client's permission.</p>" + placeholderNote("No testimonials added yet", "Add approved testimonials in content/owner-profile.js under testimonials.");
      return { state: "0 shown" };
    }
    b.innerHTML = "<h3>Proof vault</h3><div class=\"cardgrid\">" + list.map(function (t, i) {
      var vid = /^[\w-]{11}$/.test(t.youtubeId || "") ? '<div class="vslot" data-yt="' + esc(t.youtubeId) + '"><button type="button" class="btn btn-small">Play video</button></div>' : "";
      return '<article class="card"><h4>' + esc(t.name) + "</h4>" + (t.role ? '<p class="muted">' + esc(t.role) + "</p>" : "") + (t.quote ? "<p>“" + esc(t.quote) + "”</p>" : "") + vid + linkBtn(t.url, "Open original") + "</article>";
    }).join("") + "</div>";
    $$(".vslot", b).forEach(function (slot) {
      $("button", slot).addEventListener("click", function () {
        slot.innerHTML = '<iframe style="width:100%;aspect-ratio:16/9;border:2px solid var(--ink);border-radius:10px" src="https://www.youtube-nocookie.com/embed/' + esc(slot.dataset.yt) + '" title="Client testimonial video" allow="encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
      });
    });
    return { state: list.length + " shown" };
  };

  RENDER.journey = function (b) {
    var story = P.journeyStory || [], tl = P.journey || [];
    if (!story.length && !tl.length) {
      b.innerHTML = "<h3>Journey</h3>" + placeholderNote("Story not written yet", "Add journeyStory and journey in content/owner-profile.js.");
      return { state: "TBD" };
    }
    b.innerHTML = "<h3>My Journey</h3>" + story.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
      (tl.length ? "<h4>Timeline</h4><div class=\"cardgrid\">" + tl.map(function (m) { return '<article class="card"><span class="pill">' + esc(m.year) + "</span><h4>" + esc(m.title) + "</h4><p>" + esc(m.text) + "</p></article>"; }).join("") + "</div>" : "");
    return { state: tl.length ? tl.length + " milestones" : "story" };
  };

  RENDER.socials = function (b) {
    b.innerHTML = "<h3>Find Kunal</h3><div class=\"cardgrid\">" + P.socials.map(function (s) { return '<article class="card"><h4>' + esc(s.name) + "</h4><p>" + esc(s.handle) + '</p><p class="muted">' + esc(s.purpose) + '</p><a class="btn btn-small" target="_blank" rel="noreferrer noopener" href="' + esc(s.url) + '">Open</a></article>'; }).join("") + "</div>" +
      placeholderNote("More networks coming", "GitHub, YouTube, Instagram and others will appear once Kunal adds the links.");
    return { state: P.socials.length + " active" };
  };

  RENDER.founder = function (f) {
    return function (b) {
      var F = P.founder;
      b.innerHTML = "<h3>" + esc(F.heading) + "</h3>" + F.intro.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
        "<h4>" + esc(F.whatIDoTitle) + "</h4><ul>" + F.whatIDo.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        "<h4>" + esc(F.visionTitle) + "</h4><p>" + esc(F.vision) + "</p>" +
        '<p class="muted">Contact: WhatsApp ' + esc(P.conversion.whatsappDisplay) + " · " + esc(P.conversion.email) + "</p>";
      return { state: "founder.txt" };
    };
  }();

  /* KunalNet: a small browser that lists the live sites from Projects */
  RENDER.browser = function (b) {
    var hist = ["about:start"], pos = 0;
    b.innerHTML = '<div class="addr"><button type="button" id="bBack" aria-label="Back">←</button><button type="button" id="bFwd" aria-label="Forward">→</button><button type="button" id="bRef" aria-label="Refresh">↻</button><button type="button" id="bHome" aria-label="Home">⌂</button><input id="bUrl" type="text" aria-label="Address" placeholder="Enter a project URL"><button type="button" id="bGo" aria-label="Go">Go</button></div><div id="bView"></div>';
    var url = $("#bUrl", b), view = $("#bView", b);
    function show() {
      var u = hist[pos]; url.value = u === "about:start" ? "" : u;
      if (u === "about:start") {
        var marks = (P.projects || []).filter(function (p) { return safeUrl(p.url); });
        view.innerHTML = "<h3>KunalNet</h3><p class=\"muted\">My live websites, in one place.</p>" +
          (marks.length ? '<div class="cardgrid">' + marks.map(function (p, i) { return '<article class="card"><h4>' + esc(p.name) + '</h4><p class="muted">' + esc(p.url) + '</p><button type="button" class="btn btn-small" data-mark="' + i + '">Open</button></article>'; }).join("") + "</div>" : placeholderNote("No live sites yet", "Websites you add in Projects (with a url) appear here automatically.")) +
          "<p class=\"muted\">Many websites block being shown inside other pages. When that happens, use Open in new tab.</p>";
        $$("[data-mark]", view).forEach(function (btn) { btn.addEventListener("click", function () { go(marks[+btn.dataset.mark].url); }); });
      } else {
        view.innerHTML = '<div class="card"><h4>' + esc(u) + '</h4><p class="muted">This page is opened in a new tab because most sites do not allow embedding.</p><a class="btn btn-primary" target="_blank" rel="noreferrer noopener" href="' + esc(u) + '">Open in new tab</a></div>';
      }
    }
    function go(raw) {
      raw = (raw || "").trim(); if (!raw) return;
      if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
      try { raw = new URL(raw).href; } catch (e) { view.innerHTML = '<div class="notice"><strong>That does not look like a valid address.</strong></div>'; return; }
      hist = hist.slice(0, pos + 1); hist.push(raw); pos = hist.length - 1; show();
    }
    $("#bGo", b).addEventListener("click", function () { go(url.value); });
    url.addEventListener("keydown", function (e) { if (e.key === "Enter") go(url.value); });
    $("#bBack", b).addEventListener("click", function () { if (pos > 0) { pos--; show(); } });
    $("#bFwd", b).addEventListener("click", function () { if (pos < hist.length - 1) { pos++; show(); } });
    $("#bRef", b).addEventListener("click", show);
    $("#bHome", b).addEventListener("click", function () { hist = hist.slice(0, pos + 1); hist.push("about:start"); pos = hist.length - 1; show(); });
    show(); return { state: "start page" };
  };

  /* Contact */
  RENDER.contact = function (b) {
    b.innerHTML = "<div class=\"contact-head\"><button type=\"button\" id=\"cAv\" class=\"avatar avatar--inline\" aria-label=\"Kunal's cartoon avatar. Press to see a new reaction.\"></button><div><h3 style=\"margin:0\">Start a project</h3><span class=\"avatar-cap\" id=\"cCap\" aria-live=\"polite\">Tap me!</span></div></div><div class=\"row\">" + waButton("WhatsApp " + P.conversion.whatsappDisplay, "Hi Kunal, I would like to discuss a project.") + '</div>' +
      '<div class="row"><a class="btn" href="mailto:' + esc(P.conversion.email) + '">Email ' + esc(P.conversion.email) + '</a></div><p class="muted">WhatsApp is fastest, email is fine for longer briefs.</p><h4>Or send a short brief</h4><p class="muted">The form opens WhatsApp or your email app with your message ready to send. Nothing is stored on a server.</p>' +
      '<form id="cForm" novalidate><div class="hp"><label>Leave empty<input name="company" tabindex="-1" autocomplete="off"></label></div>' +
      '<label class="field"><span>Your name</span><input name="name" required autocomplete="name"></label>' +
      '<label class="field"><span>What do you want built?</span><select name="build"><option>A business website</option><option>A landing page</option><option>A website redesign</option><option>A web app or custom tool</option><option>Not sure yet</option></select></label>' +
      '<label class="field"><span>Timeline</span><input name="timeline" placeholder="For example: within 2 weeks"></label>' +
      '<label class="field"><span>Current tools or context</span><textarea name="context"></textarea></label>' +
      '<label class="field"><span>What does success look like?</span><textarea name="success"></textarea></label>' +
      '<div class="row"><button type="submit" class="btn btn-primary">Send via WhatsApp</button><button type="button" class="btn" id="cMail">Send via Email</button></div></form><p id="cOk" class="notice" hidden role="status"></p>';
    makeAvatar($("#cAv", b), $("#cCap", b), "3");
    function brief(f) { return "Hi Kunal, I'm " + f.name.value.trim() + ".\nI want: " + f.build.value + "\nTimeline: " + (f.timeline.value || "not set") + "\nContext: " + (f.context.value || "-") + "\nSuccess looks like: " + (f.success.value || "-"); }
    $("#cForm", b).addEventListener("submit", function (e) {
      e.preventDefault(); var f = e.target;
      if (f.company.value) return;
      if (!f.name.value.trim()) { f.name.focus(); return; }
      window.open(wa(brief(f)), "_blank", "noopener,noreferrer");
      var ok = $("#cOk", b); ok.hidden = false; ok.textContent = "Thanks, " + f.name.value.trim() + ". WhatsApp should now be open with your message. If it did not open, message " + P.conversion.whatsappDisplay + " directly.";
    });
    $("#cMail", b).addEventListener("click", function () {
      var f = $("#cForm", b);
      if (!f.name.value.trim()) { f.name.focus(); return; }
      window.location.href = "mailto:" + P.conversion.email + "?subject=" + encodeURIComponent("Project enquiry from " + f.name.value.trim()) + "&body=" + encodeURIComponent(brief(f));
    });
    return { state: "WhatsApp + Email" };
  };

  /* Case Files: folders built automatically from Projects (grouped by category) */
  RENDER.files = function (b) {
    var tree = { "Start Here": [{ n: "README.txt", readme: true }] };
    (P.projects || []).forEach(function (p) { var k = p.category || "Websites"; (tree[k] = tree[k] || []).push({ n: p.name + ".case", p: p }); });
    var cur = null, hist = [null], pos = 0, q = "";
    b.innerHTML = '<div class="addr"><button type="button" id="fBack" aria-label="Back">←</button><button type="button" id="fFwd" aria-label="Forward">→</button><input id="fSearch" type="search" placeholder="Search files" aria-label="Search files"></div><div class="crumbs" id="fCrumb"></div><ul class="filelist" id="fList"></ul><div id="fPrev" class="notice" style="margin-top:14px" aria-live="polite">Select a file to preview it.</div>';
    function preview(it) {
      var el = $("#fPrev", b);
      if (it.readme) { el.innerHTML = "<strong>What is this?</strong>Case Files is an archive of my projects in folders. Each .case file tells one story: the problem, what I built and the result." + ((P.projects || []).length ? "" : " No projects have been added yet."); return; }
      var p = it.p;
      el.innerHTML = "<strong>" + esc(p.name) + "</strong>" + esc([p.category, p.dates, p.client].filter(Boolean).join(" · ")) + projectImages(p) + line("Problem:", p.problem) + line("What I built:", p.intervention) + (p.outcome ? "<p><b>Outcome:</b> " + esc(p.outcome) + " " + statusTag(p.outcomeStatus) + "</p>" : "") + linkBtn(p.url, "Open live project");
    }
    function draw() {
      $("#fCrumb", b).textContent = "Case Files" + (cur ? " / " + cur : "");
      var ul = $("#fList", b); ul.innerHTML = "";
      var items = cur ? tree[cur].map(function (f) { return { t: "file", n: f.n, f: f }; }) : Object.keys(tree).map(function (k) { return { t: "dir", n: k }; });
      if (q) { items = []; Object.keys(tree).forEach(function (k) { if (k.toLowerCase().indexOf(q) > -1) items.push({ t: "dir", n: k }); tree[k].forEach(function (f) { if (f.n.toLowerCase().indexOf(q) > -1) items.push({ t: "file", n: f.n, f: f }); }); }); }
      if (!items.length) ul.innerHTML = '<li class="muted" style="padding:10px">No matches.</li>';
      items.forEach(function (it) {
        var li = document.createElement("li"), bt = document.createElement("button"); bt.type = "button"; bt.textContent = (it.t === "dir" ? "[Folder]  " : "[File]  ") + it.n; li.appendChild(bt); ul.appendChild(li);
        bt.addEventListener("click", function () {
          if (it.t === "dir") { cur = it.n; q = ""; $("#fSearch", b).value = ""; hist = hist.slice(0, pos + 1); hist.push(cur); pos = hist.length - 1; draw(); }
          else preview(it.f);
        });
      });
    }
    $("#fBack", b).addEventListener("click", function () { if (pos > 0) { pos--; cur = hist[pos]; draw(); } });
    $("#fFwd", b).addEventListener("click", function () { if (pos < hist.length - 1) { pos++; cur = hist[pos]; draw(); } });
    $("#fSearch", b).addEventListener("input", function (e) { q = e.target.value.trim().toLowerCase(); draw(); });
    draw(); return { state: Object.keys(tree).length + " folders" };
  };

  RENDER.notes = function (b) {
    var list = P.articles || [];
    if (!list.length) {
      b.innerHTML = "<h3>AI Field Notes</h3><p class=\"muted\">Short guides and articles about websites for small businesses.</p>" + placeholderNote("No articles published yet", "Articles you add in content/owner-profile.js (articles) will appear here.");
      return { state: "0 articles" };
    }
    b.innerHTML = "<h3>AI Field Notes</h3><div class=\"cardgrid\">" + list.map(function (a) { return '<article class="card"><h4>' + esc(a.title) + "</h4>" + (a.date ? '<p class="muted">' + esc(a.date) + "</p>" : "") + "<p>" + esc(a.summary) + "</p>" + linkBtn(a.url, "Read article") + "</article>"; }).join("") + "</div>";
    return { state: list.length + " articles" };
  };

  /* Calendar */
  RENDER.calendar = function (b) {
    var tz = P.identity.timezone, now = new Date();
    var parts = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(now).split("-");
    var Y = +parts[0], M = +parts[1] - 1, D = +parts[2];
    var first = new Date(Y, M, 1).getDay(), days = new Date(Y, M + 1, 0).getDate();
    var cells = ""; for (var i = 0; i < first; i++) cells += "<span></span>";
    for (var d = 1; d <= days; d++) cells += '<span style="padding:10px 0;border-radius:10px;text-align:center;font-weight:700;' + (d === D ? "background:var(--primary);color:#fff" : "") + '">' + d + "</span>";
    var booking = safeUrl(P.conversion.bookingUrl);
    b.innerHTML = "<h3>" + new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(Y, M, 1)) + '</h3><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:16px"><b class="muted" style="text-align:center">S</b><b class="muted" style="text-align:center">M</b><b class="muted" style="text-align:center">T</b><b class="muted" style="text-align:center">W</b><b class="muted" style="text-align:center">T</b><b class="muted" style="text-align:center">F</b><b class="muted" style="text-align:center">S</b>' + cells + "</div>" +
      (booking ? '<div class="row"><a class="btn btn-primary" target="_blank" rel="noreferrer noopener" href="' + esc(booking) + '">Book a call</a></div>' : placeholderNote("Booking link not added yet", "Add bookingUrl in content/owner-profile.js to show a Book a call button here.")) +
      '<p>Time zone: ' + esc(P.identity.timezoneLabel) + " (" + esc(tz) + ")</p><div class=\"row\">" + waButton("Ask for a time on WhatsApp", "Hi Kunal, I would like to book a call.") + "</div>";
    return { state: P.identity.timezoneLabel };
  };

  /* ---------- command palette ---------- */
  var pal = { open: false, idx: 0, items: [] };
  function cmdItems() {
    var it = APPS.map(function (a) { return { label: a.name, type: "App", run: function () { openApp(a.id); } }; });
    P.services.forEach(function (s) { it.push({ label: s.name, type: "Service", run: function () { openApp("services"); } }); });
    it.push({ label: "Message on WhatsApp", type: "Contact", run: function () { window.open(P.conversion.whatsappUrl, "_blank", "noopener,noreferrer"); } });
    it.push({ label: "Email " + P.conversion.email, type: "Contact", run: function () { window.location.href = "mailto:" + P.conversion.email; } });
    ["day", "night", "dark"].forEach(function (t) { it.push({ label: "Theme: " + t[0].toUpperCase() + t.slice(1), type: "Theme", run: function () { setTheme(t); } }); });
    (P.projects || []).forEach(function (p) { it.push({ label: p.name, type: "Project", run: function () { openApp("projects"); } }); });
    it.push({ label: "Reset desktop icons", type: "Command", run: resetIcons });
    return it;
  }
  function fuzzy(q, s) { q = q.toLowerCase(); s = s.toLowerCase(); if (!q) return 1; var qi = 0, score = 0, last = -2; for (var i = 0; i < s.length && qi < q.length; i++) { if (s[i] === q[qi]) { score += (i === last + 1 ? 3 : 1); last = i; qi++; } } return qi === q.length ? score : 0; }
  function drawPalette() {
    var q = $("#paletteInput").value, all = cmdItems();
    pal.items = all.map(function (x) { return { x: x, s: fuzzy(q, x.label) }; }).filter(function (r) { return r.s > 0; }).sort(function (a, b) { return b.s - a.s; }).map(function (r) { return r.x; }).slice(0, 9);
    pal.idx = Math.min(pal.idx, Math.max(0, pal.items.length - 1));
    var ul = $("#paletteList"); ul.innerHTML = "";
    pal.items.forEach(function (x, i) {
      var li = document.createElement("li"); li.setAttribute("role", "option"); li.setAttribute("aria-selected", String(i === pal.idx));
      li.innerHTML = "<span>" + esc(x.label) + "</span><small>" + esc(x.type) + "</small>";
      li.addEventListener("click", function () { runPal(i); }); ul.appendChild(li);
    });
    if (!pal.items.length) ul.innerHTML = '<li class="muted">No results</li>';
  }
  function openPalette() { pal.open = true; pal.idx = 0; $("#palette").hidden = false; $("#paletteInput").value = ""; drawPalette(); $("#paletteInput").focus(); }
  function closePalette() { pal.open = false; $("#palette").hidden = true; }
  function runPal(i) { var x = pal.items[i]; closePalette(); if (x) x.run(); }


  /* ---------- cartoon avatar (original full-body SVG, drawn in code from the owner's approved photo notes) ---------- */
  var AV = { skin: "#C4885C", skinShade: "#A9724A", hair: "#14101A", jacket: "#5E636B", jacketHi: "#7D838D", tee: "#1B1D24", jeans: "#3E4C6B", ink: "#0B1020" };
  function avatarSVG(state, u) {
    var c = AV, ink = c.ink, sw = ' stroke="' + ink + '" stroke-width="4" stroke-linejoin="round"', mouth, fx = "";
    if (state === "happy") mouth = '<path d="M82 134 Q100 160 118 134 Z" fill="#fff"' + sw + '/><ellipse cx="68" cy="132" rx="8" ry="5" fill="#FF6B4A" opacity=".35"/><ellipse cx="132" cy="132" rx="8" ry="5" fill="#FF6B4A" opacity=".35"/>';
    else if (state === "excited") { mouth = '<path d="M83 134 Q100 168 117 134 Z" fill="#5A1E22"' + sw + '/><path d="M92 152 Q100 146 108 152 Q100 160 92 152Z" fill="#FF6B4A"/>'; fx = '<path d="M14 40 v16 M6 48 h16" stroke="#FF6B4A" stroke-width="4" stroke-linecap="round"/><path d="M184 30 v14 M177 37 h14" stroke="#2F6BFF" stroke-width="4" stroke-linecap="round"/><path d="M190 96 v10 M185 101 h10" stroke="#FF6B4A" stroke-width="3" stroke-linecap="round"/>'; }
    else if (state === "surprise") { mouth = '<ellipse cx="100" cy="144" rx="9" ry="12" fill="#5A1E22"' + sw + '/>'; fx = '<path d="M16 34 v18 M16 60 v3 M184 34 v18 M184 60 v3" stroke="#FF6B4A" stroke-width="5" stroke-linecap="round"/>'; }
    else if (state === "sad") mouth = '<path d="M87 148 Q100 136 113 148" fill="none" stroke="' + ink + '" stroke-width="4" stroke-linecap="round"/>';
    else if (state === "cool") mouth = '<path d="M85 140 Q102 150 118 132" fill="none" stroke="' + ink + '" stroke-width="4" stroke-linecap="round"/>';
    else mouth = '<path d="M85 138 Q100 148 115 138" fill="none" stroke="' + ink + '" stroke-width="4" stroke-linecap="round"/>';
    var jeansLines = '<path d="M68 318 L90 324 M70 346 L92 350 M110 322 L132 316 M108 350 L130 344" stroke="#6B7DA3" stroke-width="3" stroke-linecap="round" opacity=".6"/>';
    return '<svg viewBox="0 0 200 420" role="img" aria-label="Full-body cartoon avatar of Kunal with wavy dark hair, black square sunglasses, a grey leather jacket and jeans (' + state + ' expression)" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><g id="hc' + u + '"><circle cx="58" cy="56" r="17"/><circle cx="80" cy="38" r="18"/><circle cx="106" cy="30" r="18"/><circle cx="132" cy="37" r="18"/><circle cx="151" cy="56" r="16"/><circle cx="156" cy="82" r="12"/><circle cx="45" cy="82" r="12"/><circle cx="100" cy="52" r="26"/></g></defs>' +
      '<ellipse cx="100" cy="413" rx="62" ry="7" fill="#0B1020" opacity=".18"/>' + fx +
      '<g class="av-all">' +
        /* legs + shoes */
        '<g class="legL"><path d="M62 290 H98 L96 396 H60 Z" fill="' + c.jeans + '"' + sw + '/><path d="M54 396 H100 Q104 414 92 414 H60 Q50 414 54 396Z" fill="#F4F4F7"' + sw + '/><path d="M56 406 H98" stroke="' + ink + '" stroke-width="3"/></g>' +
        '<g class="legR"><path d="M102 290 H138 L140 396 H104 Z" fill="' + c.jeans + '"' + sw + '/><path d="M100 396 H146 Q150 414 140 414 H108 Q96 414 100 396Z" fill="#F4F4F7"' + sw + '/><path d="M102 406 H144" stroke="' + ink + '" stroke-width="3"/></g>' +
        jeansLines +
        /* tee, belt, jacket */
        '<path d="M76 186 Q100 204 124 186 L128 288 L72 288 Z" fill="' + c.tee + '"' + sw + '/>' +
        '<rect x="54" y="282" width="92" height="14" rx="3" fill="#1d1d22"' + sw + '/><rect x="92" y="284" width="16" height="10" rx="2" fill="#C9CDD4" stroke="' + ink + '" stroke-width="2"/>' +
        '<path d="M44 196 Q58 184 76 186 L72 298 L48 298 Z" fill="' + c.jacket + '"' + sw + '/><path d="M156 196 Q142 184 124 186 L128 298 L152 298 Z" fill="' + c.jacket + '"' + sw + '/>' +
        '<path d="M66 182 L92 198 L76 214 L54 194 Z" fill="' + c.jacketHi + '"' + sw + '/><path d="M134 182 L108 198 L124 214 L146 194 Z" fill="' + c.jacketHi + '"' + sw + '/>' +
        '<path d="M74 220 V296 M126 220 V296" stroke="#D5D9E0" stroke-width="3" stroke-dasharray="4 4"/>' +
        /* arms */
        '<g class="armL"><path d="M42 194 C30 204 26 244 28 286 L52 288 C52 250 56 216 58 198 Z" fill="' + c.jacket + '"' + sw + '/><path d="M28 276 L52 278" stroke="' + ink + '" stroke-width="3"/><circle cx="40" cy="299" r="11" fill="' + c.skin + '"' + sw + '/></g>' +
        '<g class="armR"><path d="M158 194 C170 204 174 244 172 286 L148 288 C148 250 144 216 142 198 Z" fill="' + c.jacket + '"' + sw + '/><path d="M148 278 L172 276" stroke="' + ink + '" stroke-width="3"/><circle cx="160" cy="299" r="11" fill="' + c.skin + '"' + sw + '/><ellipse class="thumb" cx="170" cy="290" rx="4.5" ry="9" fill="' + c.skin + '" stroke="' + ink + '" stroke-width="3"/></g>' +
        /* head */
        '<g class="head">' +
          '<path d="M86 148 V190 Q100 200 114 190 V148 Z" fill="' + c.skinShade + '"' + sw + '/>' +
          '<circle cx="47" cy="110" r="11" fill="' + c.skin + '"' + sw + '/><circle cx="153" cy="110" r="11" fill="' + c.skin + '"' + sw + '/>' +
          '<ellipse cx="100" cy="108" rx="53" ry="58" fill="' + c.skin + '"' + sw + '/>' +
          '<use href="#hc' + u + '" fill="' + c.hair + '" stroke="' + ink + '" stroke-width="9"/><use href="#hc' + u + '" fill="' + c.hair + '"/>' +
          '<path d="M50 92 C52 68 76 60 100 62 C124 60 148 68 150 92 C142 78 128 74 114 78 C102 72 90 78 78 76 C64 78 56 84 50 92 Z" fill="' + c.hair + '"/>' +
          '<path d="M70 44 q8 -8 18 -6 M112 36 q10 -4 18 4" fill="none" stroke="#3A3350" stroke-width="3" stroke-linecap="round"/>' +
          '<rect x="58" y="92" width="38" height="28" rx="7" fill="' + ink + '"' + sw + '/><rect x="104" y="92" width="38" height="28" rx="7" fill="' + ink + '"' + sw + '/>' +
          '<rect x="92" y="98" width="16" height="6" rx="3" fill="' + ink + '"/><path d="M58 100 L46 98 M142 100 L154 98" stroke="' + ink + '" stroke-width="5" stroke-linecap="round"/>' +
          '<path d="M65 100 L75 100 M111 100 L121 100" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".4"/>' +
          '<path class="glint" d="M62 114 L72 98" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0"/>' +
          '<path d="M101 114 Q95 128 102 130" fill="none" stroke="' + c.skinShade + '" stroke-width="4" stroke-linecap="round"/>' + mouth +
        "</g>" +
      "</g></svg>";
  }
  var REACTIONS = [
    { k: "wave",  say: "Hi! I'm Kunal.",              s: "happy",    ms: 2600 },
    { k: "jump",  say: "Let's build something!",      s: "excited",  ms: 1400 },
    { k: "dance", say: "Build mode: ON.",        s: "happy",    ms: 3000 },
    { k: "spin",  say: "Websites that convert.",      s: "excited",  ms: 1300 },
    { k: "thumb", say: "Fast sites. Smart agents.",   s: "happy",    ms: 2200 },
    { k: "shock", say: "You tapped me again?!",       s: "surprise", ms: 1200 },
    { k: "sad",   say: "Don't leave without a message...", s: "sad", ms: 2400 },
    { k: "cool",  say: "Cool? Always.",               s: "cool",     ms: 2200 },
    { k: "walk",  say: "Just taking a walk.",         s: "idle",     ms: 3000 }
  ];
  function makeAvatar(btn, cap, uid) {
    var bag = [], last = "", timer = null, cls = "";
    function draw(state) { btn.innerHTML = avatarSVG(state, uid); }
    function idle() { if (cls) btn.classList.remove(cls); cls = ""; draw("idle"); cap.textContent = "Tap me!"; }
    function next() {
      if (!bag.length) { bag = REACTIONS.slice().sort(function () { return Math.random() - 0.5; }); if (bag[0].k === last && bag.length > 1) bag.push(bag.shift()); }
      var r = bag.shift(); last = r.k; return r;
    }
    draw("idle");
    btn.addEventListener("click", function () {
      var r = next(); clearTimeout(timer);
      if (cls) btn.classList.remove(cls);
      draw(r.s); cls = "r-" + r.k; void btn.offsetWidth; btn.classList.add(cls);
      cap.textContent = r.say;
      timer = setTimeout(idle, r.ms);
    });
  }
  function initAvatar() {
    makeAvatar($("#avatarBtn"), $("#avatarCap"), "1");
    makeAvatar($("#avatarBtn2"), $("#avatarCap2"), "2");
  }

  /* ---------- global events ---------- */
  document.addEventListener("click", function (e) {
    var o = e.target.closest("[data-open]"); if (o) { openApp(o.getAttribute("data-open")); return; }
    var t = e.target.closest("[data-theme-set]"); if (t) setTheme(t.getAttribute("data-theme-set"));
  });
  $("#searchBtn").addEventListener("click", openPalette);
  $("#clockBtn").addEventListener("click", function () { openApp("calendar"); });
  $("#palette").addEventListener("click", function (e) { if (e.target.id === "palette") closePalette(); });
  $("#paletteInput").addEventListener("input", function () { pal.idx = 0; drawPalette(); });
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.open ? closePalette() : openPalette(); return; }
    if (pal.open) {
      if (e.key === "Escape") { e.preventDefault(); closePalette(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); pal.idx = Math.min(pal.idx + 1, pal.items.length - 1); drawPalette(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); pal.idx = Math.max(pal.idx - 1, 0); drawPalette(); }
      else if (e.key === "Enter") { e.preventDefault(); runPal(pal.idx); }
      return;
    }
    if (e.key === "Escape") { var w = topWin(); if (w) closeWin(w.id); }
  });
  window.addEventListener("resize", function () { renderIcons(); });

  /* ---------- boot ---------- */
  function boot() {
    var el = $("#boot"), done = false, seen = false;
    try { seen = sessionStorage.getItem(KEYS.boot) === "1"; } catch (e) {}
    function finish() { if (done) return; done = true; el.classList.add("done"); try { sessionStorage.setItem(KEYS.boot, "1"); } catch (e) {} setTimeout(function () { el.remove(); }, 600); }
    $("#skipBoot").addEventListener("click", finish);
    setTimeout(finish, reduced ? 500 : seen ? 800 : 2300);
    $("#skipBoot").focus();
  }

  /* ---------- init ---------- */
  setTheme(load(KEYS.theme, "day"));
  initIdentity(); initAvatar(); renderIcons(); renderDock(); tick(); setInterval(tick, 15000); boot();
})();
