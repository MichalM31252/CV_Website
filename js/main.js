/* ═════════════════════════════════════════════════════════════════
   main.js — builds the page from the PORTFOLIO data in js/data.js,
   then wires up the nav, scroll reveals, and the typed SQL card.
   You should not need to edit this file to change content.
   ═════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  const D = PORTFOLIO;

  /* --- small helpers --- */
  const arrowIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const mailIcon  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>';
  const phoneIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>';
  const ghIcon    = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.27 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>';
  const liIcon    = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z"/></svg>';

  document.title = `${D.name.first} ${D.name.last} — ${D.jobTitle}`;

  const tagList = tags => `<div class="tags">${tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>`;

  /* turns "Michał" into "michal" for the terminal-style logo */
  const deburr = s => s.toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l");

  /* --- build the page --- */
  const html = `
  <nav class="nav" id="nav" aria-label="Main navigation">
    <div class="wrap nav-inner">
      <a class="nav-brand" href="#top"><span class="tick">~/</span><b>${deburr(D.name.first)}.${deburr(D.name.last)}</b></a>
      <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks">menu</button>
      <ul class="nav-links" id="navLinks">
        ${D.nav.map(n => `<li><a href="#${n.id}">${n.label}</a></li>`).join("")}
      </ul>
    </div>
  </nav>

  <header class="hero" id="top">
    <div class="wrap hero-grid">
      <div>
        <span class="eyebrow">${D.jobTitle} · ${D.location}</span>
        <h1>${D.name.first}<br><span class="surname">${D.name.last}</span></h1>
        <p class="hero-lede">${D.hero.lede}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="mailto:${D.contact.email}">${mailIcon} ${D.hero.primaryButton}</a>
          <a class="btn" href="${D.contact.github}" target="_blank" rel="noopener">${ghIcon} GitHub</a>
          <a class="btn" href="${D.contact.linkedin}" target="_blank" rel="noopener">${liIcon} LinkedIn</a>
        </div>
      </div>

      <div class="query-card" role="img" aria-label="Stylized SQL console typing a query that returns ${D.name.first}'s current role">
        <div class="query-bar" aria-hidden="true">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          <span>${D.queryCard.filename}</span>
        </div>
        <div class="query-body" id="queryBody" aria-hidden="true"><span class="caret" id="caret"></span></div>
        <div class="query-result" id="queryResult" aria-hidden="true">
          <table class="result-table">
            <thead><tr>${D.queryCard.resultColumns.map(c => `<th>${c}</th>`).join("")}</tr></thead>
            <tbody><tr>${D.queryCard.resultRow.map(c => `<td>${c}</td>`).join("")}</tr></tbody>
          </table>
          <p class="result-meta">${D.queryCard.resultMeta}</p>
        </div>
      </div>
    </div>
  </header>

  <main>
    <section id="about">
      <div class="wrap">
        <div class="sec-head"><span class="sec-label">about</span><span class="sec-rule"></span></div>
        <h2>${D.about.heading}</h2>
        <div class="about-grid">
          <div class="reveal">
            ${D.about.paragraphs.map(p => `<p>${p}</p>`).join("")}
          </div>
          <div class="facts reveal">
            <dl>
              ${D.about.facts.map(f => `<div class="fact"><dt>${f.label}</dt><dd>${f.value}</dd></div>`).join("")}
            </dl>
          </div>
        </div>
      </div>
    </section>

    <section id="experience">
      <div class="wrap">
        <div class="sec-head"><span class="sec-label">experience</span><span class="sec-rule"></span></div>
        <h2>${D.experience.heading}</h2>
        <div class="timeline reveal">
          ${D.experience.jobs.map(j => `
          <article class="t-item">
            <p class="t-date">${j.date}</p>
            <h3 class="t-role">${j.role}</h3>
            <p class="t-org">${j.companyUrl
              ? `<a href="${j.companyUrl}" target="_blank" rel="noopener">${j.company}</a>`
              : j.company}${j.location ? ` · ${j.location}` : ""}</p>
            <ul class="t-list">${j.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
            ${j.tags && j.tags.length ? tagList(j.tags) : ""}
          </article>`).join("")}
        </div>
      </div>
    </section>

    <section id="projects">
      <div class="wrap">
        <div class="sec-head"><span class="sec-label">projects</span><span class="sec-rule"></span></div>
        <h2>${D.projects.heading}</h2>
        <div class="proj-grid">
          ${D.projects.items.map(p => {
            const inner = `
              <div class="proj-top"><h3>${p.name}</h3>${p.url ? arrowIcon : ""}</div>
              <p>${p.desc}</p>
              ${tagList(p.tags)}`;
            return p.url
              ? `<a class="proj reveal" href="${p.url}" target="_blank" rel="noopener">${inner}</a>`
              : `<div class="proj reveal">${inner}</div>`;
          }).join("")}
        </div>
      </div>
    </section>

    <section id="activity">
      <div class="wrap">
        <div class="sec-head"><span class="sec-label">activity</span><span class="sec-rule"></span></div>
        <h2>${D.activity.heading}</h2>
        <div class="activity-grid">
          <div class="panel reveal">
            <div class="panel-head">
              <span class="panel-title">github contributions</span>
              <a class="panel-link" href="${D.contact.github}" target="_blank" rel="noopener">@${D.activity.githubUsername} ↗</a>
            </div>
            <div id="ghStats" class="stat-chips"></div>
            <div class="cal-scroll">
              <div class="cal" id="ghCal" role="img" aria-label="GitHub contribution calendar for the last twelve months"></div>
            </div>
            <div class="cal-caption" id="ghCaption"><span>Loading contribution data…</span></div>
          </div>
          <div class="panel reveal">
            <div class="panel-head">
              <span class="panel-title">leetcode</span>
              <span class="panel-link" id="lcLinkSlot"></span>
            </div>
            <div id="lcBody" class="panel-note">Loading LeetCode stats…</div>
          </div>
        </div>
      </div>
    </section>

    <section id="skills">
      <div class="wrap">
        <div class="sec-head"><span class="sec-label">skills</span><span class="sec-rule"></span></div>
        <h2>${D.skills.heading}</h2>
        <div class="skill-grid">
          ${D.skills.groups.map(g => `
          <div class="skill-col reveal">
            <h3>${g.title}</h3>
            <ul>${g.items.map(i => `<li>${i}</li>`).join("")}</ul>
          </div>`).join("")}
        </div>
      </div>
    </section>

    <section id="education">
      <div class="wrap">
        <div class="sec-head"><span class="sec-label">education</span><span class="sec-rule"></span></div>
        <h2>${D.education.heading}</h2>
        <div class="edu-grid">
          <div class="reveal">
            <p class="col-label">Education</p>
            <div class="timeline">
              ${D.education.schools.map(s => `
              <article class="t-item">
                <p class="t-date">${s.date}</p>
                <h3 class="t-role">${s.degree}</h3>
                <p class="t-org">${s.school}</p>
                <ul class="t-list">${s.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
              </article>`).join("")}
            </div>
          </div>
          <div class="reveal">
            <p class="col-label">Certificates</p>
            ${D.education.certificates.map(c => `
            <div class="cert">
              <div>
                <p class="cert-name">${c.name}</p>
                <p class="cert-org">${c.org}</p>
              </div>
              <span class="cert-date">${c.date}</span>
            </div>`).join("")}
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="contact">
      <div class="wrap reveal">
        <span class="sec-label">contact</span>
        <h2>${D.contactSection.heading}</h2>
        <p>${D.contactSection.blurb}</p>
        <a class="contact-mail" href="mailto:${D.contact.email}">${D.contact.email}</a>
        <div class="contact-links">
          <a class="btn" href="tel:${D.contact.phone}">${phoneIcon} ${D.contact.phoneDisplay}</a>
          <a class="btn" href="${D.contact.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          <a class="btn" href="${D.contact.github}" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="wrap footer-inner">
      <span>© ${new Date().getFullYear()} ${D.name.first} ${D.name.last} · ${D.location.split(",")[0]}</span>
      <span>${D.footer.rightNote}</span>
    </div>
  </footer>`;

  document.getElementById("app").innerHTML = html;

  /* --- mobile nav --- */
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.getElementById("navLinks").addEventListener("click", e => {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- scroll reveal --- */
  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(el => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  }

  /* --- typed SQL card: auto-highlights keywords and 'strings' --- */
  const KEYWORDS = /^(SELECT|FROM|WHERE|AND|OR|NOT|ORDER|GROUP|BY|LIMIT|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|IN|LIKE|HAVING|UNION|INSERT|INTO|VALUES|UPDATE|SET|DELETE|DISTINCT|COUNT|SUM|AVG|MIN|MAX)$/i;

  function tokenize(sql){
    // split into: quoted strings | words | everything else
    const parts = sql.match(/('[^']*')|(\w+)|([^\w']+)/g) || [];
    return parts.map(p => {
      if (p.startsWith("'")) return [p, "str"];
      if (KEYWORDS.test(p))  return [p, "kw"];
      return [p, null];
    });
  }

  const tokens = tokenize(D.queryCard.query);
  const body   = document.getElementById("queryBody");
  const caret  = document.getElementById("caret");
  const result = document.getElementById("queryResult");

  function addSpan(cls){
    const s = document.createElement("span");
    if (cls) s.className = cls;
    body.insertBefore(s, caret);
    return s;
  }

  if (reduceMotion) {
    tokens.forEach(t => { addSpan(t[1]).textContent = t[0]; });
    result.classList.add("show");
    return;
  }

  let ti = 0, ci = 0, current = null;
  function type(){
    if (ti >= tokens.length) {
      setTimeout(() => result.classList.add("show"), 350);
      return;
    }
    if (!current) { current = addSpan(tokens[ti][1]); ci = 0; }
    current.textContent += tokens[ti][0].charAt(ci++);
    if (ci >= tokens[ti][0].length) { ti++; current = null; }
    setTimeout(type, 34);
  }
  setTimeout(type, 600);
})();
