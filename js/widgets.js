/* ═════════════════════════════════════════════════════════════════
   widgets.js — loads the live data panels in the Activity section:
   the GitHub contribution calendar + profile chips, and LeetCode
   solved-problem stats (two community APIs, tried in order, with
   graceful fallbacks). Runs after main.js has built the page.
   ═════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  const D = PORTFOLIO;

  /* --- live widgets: GitHub contribution graph + LeetCode --- */
  const gh = D.activity.githubUsername;

  /* profile chips (repos, followers) from the official GitHub API */
  fetch(`https://api.github.com/users/${gh}`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(u => {
      document.getElementById("ghStats").innerHTML =
        `<span class="chip"><b>${u.public_repos}</b> public repos</span>` +
        `<span class="chip"><b>${u.followers}</b> followers</span>`;
    })
    .catch(() => {});

  /* contribution calendar for the last 12 months */
  fetch(`https://github-contributions-api.jogruber.de/v4/${gh}?y=last`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      const days = data.contributions;
      const cal = document.getElementById("ghCal");

      /* Build a weekday-aligned cell list: every group of 7 is one week
         (row 0 = Sunday … row 6 = Saturday), matching GitHub. Pad the start
         so day 0 lands in its weekday row, and pad the end so the current
         (partial) week's future days render as blank cells — which places
         today in its true weekday row rather than at the column bottom. */
      const weekday = s => new Date(s + "T00:00:00").getDay();
      const cells = [];
      for (let i = 0, lead = weekday(days[0].date); i < lead; i++) cells.push(null);
      days.forEach(d => cells.push(d));
      while (cells.length % 7 !== 0) cells.push(null);

      /* Render only the newest week-columns that fit the panel — no scrollbar.
         Cells are 10px wide with a 3px gap (13px per week column). */
      function drawCal() {
        const avail = cal.parentElement.clientWidth;
        const cols = Math.max(1, Math.floor((avail + 3) / 13));
        cal.innerHTML = cells.slice(-cols * 7).map(d =>
          d
            ? `<i class="${d.level ? "l" + d.level : ""}" title="${d.date}: ${d.count} contribution${d.count === 1 ? "" : "s"}"></i>`
            : `<i class="cal-pad" aria-hidden="true"></i>`
        ).join("");
      }
      drawCal();
      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(drawCal, 150);
      });

      const total = days.reduce((s, d) => s + d.count, 0);
      document.getElementById("ghCaption").innerHTML =
        `<span><b>${total.toLocaleString("en")}</b> contributions in the last year</span>` +
        `<span class="cal-legend">less&nbsp;<i></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i>&nbsp;more</span>`;
    })
    .catch(() => {
      document.getElementById("ghCaption").innerHTML =
        `<span>Couldn't load live data — see the full graph on <a href="${D.contact.github}" target="_blank" rel="noopener">GitHub ↗</a></span>`;
    });

  /* LeetCode solved problems (two community APIs, tried in order) */
  const lcUser = (D.activity.leetcodeUsername || "").trim();
  const lcBody = document.getElementById("lcBody");

  function lcRender(s){
    const rows = [
      ["Easy",   s.easy,   s.easyTotal,   "lc-easy"],
      ["Medium", s.medium, s.mediumTotal, "lc-medium"],
      ["Hard",   s.hard,   s.hardTotal,   "lc-hard"],
    ];
    lcBody.className = "";
    lcBody.innerHTML =
      `<p class="lc-total">${s.total}<small> solved</small></p>` +
      `<p class="lc-sub">${s.ranking ? "global rank #" + Number(s.ranking).toLocaleString("en") : "problems solved on LeetCode"}</p>` +
      rows.map(([label, v, t, cls]) => {
        const pct = t ? Math.round(v / t * 100) : (s.total ? Math.round(v / s.total * 100) : 0);
        return `
        <div class="lc-row ${cls}">
          <div class="lc-meta"><span>${label}</span><span>${v}${t ? " / " + t : ""}</span></div>
          <div class="lc-bar"><div class="lc-fill" data-w="${pct}"></div></div>
        </div>`;
      }).join("");
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        lcBody.querySelectorAll(".lc-fill").forEach(el => { el.style.width = el.dataset.w + "%"; })
      )
    );
  }

  if (!lcUser) {
    lcBody.innerHTML = `Add your LeetCode username in js/data.js (the ✏️ content file), and your solved-problem stats will appear here automatically.`;
  } else {
    document.getElementById("lcLinkSlot").outerHTML =
      `<a class="panel-link" href="https://leetcode.com/u/${lcUser}/" target="_blank" rel="noopener">@${lcUser} ↗</a>`;
    fetch(`https://leetcode-stats-api.herokuapp.com/${lcUser}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        if (d.status !== "success") return Promise.reject();
        lcRender({
          total: d.totalSolved,
          easy: d.easySolved,   easyTotal: d.totalEasy,
          medium: d.mediumSolved, mediumTotal: d.totalMedium,
          hard: d.hardSolved,   hardTotal: d.totalHard,
          ranking: d.ranking,
        });
      })
      .catch(() =>
        fetch(`https://alfa-leetcode-api.onrender.com/${lcUser}/solved`)
          .then(r => r.ok ? r.json() : Promise.reject())
          .then(d => lcRender({
            total: d.solvedProblem,
            easy: d.easySolved,
            medium: d.mediumSolved,
            hard: d.hardSolved,
          }))
      )
      .catch(() => {
        lcBody.className = "panel-note";
        lcBody.innerHTML = `Couldn't load live stats right now — view my profile on <a href="https://leetcode.com/u/${lcUser}/" target="_blank" rel="noopener">LeetCode ↗</a>`;
      });
  }
})();
