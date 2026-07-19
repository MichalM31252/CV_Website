/* THE PIPELINE — behavior. Plain JS, no dependencies.
   Flow-field hero canvas, decode name reveal, scroll-driven spine fill,
   staggered reveals, count-up stats, tilt cards, magnetic button,
   live GitHub data. Everything defers to prefers-reduced-motion. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- hero flow field ---------- */

  var flow = document.getElementById("flow");
  if (flow && !reduced) {
    var fctx = flow.getContext("2d");
    var DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    var FW = 0;
    var FH = 0;
    var particles = [];
    var COLORS = ["201,131,78", "169,189,211", "232,182,76"]; // bronze, silver, gold
    var mouse = { x: -9999, y: -9999 };

    var sizeFlow = function () {
      var r = flow.getBoundingClientRect();
      FW = r.width;
      FH = r.height;
      flow.width = Math.round(FW * DPR);
      flow.height = Math.round(FH * DPR);
      fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    sizeFlow();

    var COUNT = Math.min(140, Math.round((FW * FH) / 14000));
    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * FW,
        y: Math.random() * FH,
        c: COLORS[(Math.random() * 3) | 0],
        s: 0.6 + Math.random() * 1.6, // speed
        r: 0.8 + Math.random() * 1.4, // radius
      });
    }

    var t = 0;
    var heroVisible = true;

    function field(x, y) {
      /* gentle curl-ish field: drift right, waved by two sines */
      var a =
        Math.sin(y * 0.004 + t * 0.0006) * 1.1 +
        Math.sin(x * 0.003 - t * 0.0004) * 0.6;
      return a;
    }

    function tick(now) {
      t = now;
      fctx.clearRect(0, 0, FW, FH);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var a = field(p.x, p.y);
        p.x += Math.cos(a) * p.s;
        p.y += Math.sin(a) * p.s * 0.6 + 0.08;

        /* soft mouse repulsion */
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          var f = (16000 - d2) / 16000;
          p.x += (dx / Math.sqrt(d2 + 1)) * f * 2.2;
          p.y += (dy / Math.sqrt(d2 + 1)) * f * 2.2;
        }

        if (p.x > FW + 8) p.x = -8;
        if (p.x < -8) p.x = FW + 8;
        if (p.y > FH + 8) p.y = -8;
        if (p.y < -8) p.y = FH + 8;

        fctx.beginPath();
        fctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        fctx.fillStyle = "rgba(" + p.c + ",0.5)";
        fctx.fill();
      }
      if (heroVisible) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    /* stop drawing when the hero scrolls away */
    new IntersectionObserver(function (entries) {
      var vis = entries[0].isIntersecting;
      if (vis && !heroVisible) {
        heroVisible = true;
        requestAnimationFrame(tick);
      } else {
        heroVisible = vis;
      }
    }).observe(flow);

    flow.parentElement.addEventListener("pointermove", function (e) {
      var r = flow.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    flow.parentElement.addEventListener("pointerleave", function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    var flowResize;
    window.addEventListener("resize", function () {
      clearTimeout(flowResize);
      flowResize = setTimeout(sizeFlow, 150);
    });
  }

  /* ---------- decode name ---------- */

  var GLYPHS = "01<>/#$%&*+=?";
  document.querySelectorAll(".decode").forEach(function (el, idx) {
    var target = el.dataset.text;
    if (reduced || !target) return;
    var frame = 0;
    var start = null;
    var DURATION = 900;
    var DELAY = 150 + idx * 220;
    /* show scramble immediately, so the name is never blank even if
       rAF is throttled (background tab) */
    var scrambled = "";
    for (var g = 0; g < target.length; g++) {
      scrambled += target[g] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = scrambled;
    setTimeout(function () {
      function step(ts) {
        if (!start) start = ts;
        var u = Math.min((ts - start) / DURATION, 1);
        var settled = Math.floor(u * target.length);
        var out = target.slice(0, settled);
        for (var i = settled; i < target.length; i++) {
          var ch = target[i];
          out += ch === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        /* only every other frame, so the scramble reads as flicker not blur */
        if (frame++ % 2 === 0 || u >= 1) el.textContent = out;
        if (u < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }, DELAY);
  });

  /* ---------- reveals + stagger ---------- */

  var revealables = document.querySelectorAll(".reveal, [data-stagger]");
  document.querySelectorAll("[data-stagger]").forEach(function (parent) {
    Array.prototype.forEach.call(parent.children, function (child, i) {
      child.style.transitionDelay = Math.min(i * 70, 560) + "ms";
    });
  });

  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) {
      el.classList.add("in");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }
    );
    revealables.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- spine fill on scroll ---------- */

  var stages = document.querySelector(".stages");
  var fill = document.getElementById("spine-fill");
  if (stages && fill) {
    var ticking = false;
    var setFill = function () {
      ticking = false;
      var r = stages.getBoundingClientRect();
      var vh = window.innerHeight;
      /* how far the viewport's 70% line has traveled through .stages */
      var progress = (vh * 0.7 - r.top) / r.height;
      progress = Math.max(0, Math.min(1, progress));
      fill.style.height = (progress * 100).toFixed(2) + "%";
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(setFill);
        }
      },
      { passive: true }
    );
    setFill();
    if (reduced) fill.style.height = "100%";
  }

  /* ---------- count-up stats ---------- */

  function countUp(el) {
    var to = parseInt(el.dataset.to, 10) || 0;
    if (reduced) {
      el.textContent = to.toLocaleString("en");
      return;
    }
    var start = null;
    var DURATION = 1300;
    function step(ts) {
      if (!start) start = ts;
      var u = Math.min((ts - start) / DURATION, 1);
      u = 1 - Math.pow(1 - u, 3);
      el.textContent = Math.round(to * u).toLocaleString("en");
      if (u < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counted = false;
  function runCounters() {
    if (counted) return;
    counted = true;
    document.querySelectorAll(".count").forEach(countUp);
  }
  /* hero stats fade in at ~1.35s; start counting shortly after load */
  setTimeout(runCounters, reduced ? 0 : 1500);

  /* ---------- tilt cards ---------- */

  if (!reduced && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(700px) rotateY(" + (px * 6).toFixed(2) + "deg) rotateX(" +
          (-py * 6).toFixed(2) + "deg) translateY(-2px)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- magnetic button ---------- */

  var magnet = document.querySelector(".magnet");
  if (magnet && !reduced && window.matchMedia("(pointer: fine)").matches) {
    var inner = magnet.querySelector(".magnet__inner");
    magnet.addEventListener("pointermove", function (e) {
      var r = magnet.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      magnet.style.transform = "translate(" + dx * 0.18 + "px," + dy * 0.3 + "px)";
      if (inner) inner.style.transform = "translate(" + dx * 0.08 + "px," + dy * 0.12 + "px)";
    });
    magnet.addEventListener("pointerleave", function () {
      magnet.style.transform = "";
      if (inner) inner.style.transform = "";
    });
  }

  /* ---------- live GitHub data ---------- */

  var USER = "MichalM31252";

  /* public repo count for the hero stat */
  fetch("https://api.github.com/users/" + USER)
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (d && typeof d.public_repos === "number") {
        var el = document.getElementById("stat-repos");
        el.dataset.to = String(d.public_repos);
        if (counted) el.textContent = String(d.public_repos);
      }
    })
    .catch(function () {});

  /* contribution heatmap + stat */
  var activity = document.getElementById("activity");
  var heatmap = document.getElementById("heatmap");
  fetch("https://github-contributions-api.jogruber.de/v4/" + USER + "?y=last")
    .then(function (r) {
      if (!r.ok) throw new Error("api " + r.status);
      return r.json();
    })
    .then(function (data) {
      var days = data.contributions || [];
      if (!days.length) return;
      var frag = document.createDocumentFragment();
      var firstDow = new Date(days[0].date + "T00:00:00").getDay();
      for (var p = 0; p < firstDow; p++) {
        var pad = document.createElement("span");
        pad.style.visibility = "hidden";
        frag.appendChild(pad);
      }
      var total = 0;
      days.forEach(function (d, i) {
        total += d.count;
        var cell = document.createElement("span");
        if (d.level > 0) cell.className = "l" + d.level;
        cell.title = d.date + " — " + d.count + " contribution" + (d.count === 1 ? "" : "s");
        if (!reduced) cell.style.transitionDelay = ((i % 91) * 9) + "ms"; // wave, column by column
        frag.appendChild(cell);
      });
      heatmap.appendChild(frag);
      activity.hidden = false;

      var cap = document.getElementById("heat-caption");
      if (cap) {
        cap.textContent =
          total.toLocaleString("en") + " github contributions · trailing 12 months · github.com/" + USER;
      }

      /* hero stat */
      var wrap = document.getElementById("stat-contrib-wrap");
      var stat = document.getElementById("stat-contrib");
      if (wrap && stat) {
        stat.dataset.to = String(total);
        wrap.hidden = false;
        if (counted) countUp(stat);
      }

      /* wave the cells in when the section scrolls into view */
      if (reduced || !("IntersectionObserver" in window)) {
        heatmap.classList.add("lit");
      } else {
        var hio = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) {
            heatmap.classList.add("lit");
            hio.disconnect();
          }
        }, { threshold: 0.2 });
        hio.observe(heatmap);
      }
    })
    .catch(function () {
      /* API unreachable — the section simply stays hidden */
    });
})();
