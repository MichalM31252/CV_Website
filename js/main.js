/* The Actuarial Ledger — behavior.
   Plain JS, no dependencies: theme toggle, scroll reveal,
   the fig. 01 trajectory chart, and the fig. 02 GitHub heatmap. */

(function () {
  "use strict";

  var root = document.documentElement;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme toggle ---------- */

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var toggle = document.getElementById("theme-toggle");
  toggle.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
    drawTrajectory(true); // repaint canvas with the new palette
  });

  /* ---------- scroll reveal ---------- */

  var revealed = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealed.forEach(function (el) {
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    revealed.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- fig. 01 — trajectory chart ---------- */

  var MILESTONES = [
    { t: 2019.7, y: 0.1, label: "ZSE Białystok", small: true },
    { t: 2021.5, y: 0.28, label: "first freelance client", small: true },
    { t: 2023.6, y: 0.52, label: "GUT · Data Engineering" },
    { t: 2024.7, y: 0.68, label: "NVIDIA deep learning cert", small: true },
    { t: 2025.45, y: 0.86, label: "Ergo Hestia" },
  ];
  var T_START = 2019.2;
  var T_NOW = 2026.55; // ~today
  var NOW_Y = 0.97;

  var canvas = document.getElementById("trajectory");
  var chartProgress = reducedMotion ? 1 : 0;
  var chartAnimated = false;

  function cssVar(name) {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }

  /* smooth monotone curve through the milestone points */
  function pathPoints() {
    var pts = [{ t: T_START, y: 0.04 }].concat(MILESTONES, [{ t: T_NOW, y: NOW_Y }]);
    return pts;
  }

  function drawTrajectory(instant) {
    if (!canvas) return;
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var W = rect.width;
    var H = rect.height;
    var narrow = W < 640;
    var padL = narrow ? 30 : 44;
    var padR = narrow ? 14 : 30;
    var padT = 26;
    var padB = 34;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;

    var ink = cssVar("--ink");
    var inkFaint = cssVar("--ink-faint");
    var rule = cssVar("--rule");
    var accent = cssVar("--accent");
    var red = cssVar("--red");
    var mono = "500 10px 'Spline Sans Mono', monospace";

    function X(t) {
      return padL + ((t - T_START) / (T_NOW - T_START)) * plotW;
    }
    function Y(y) {
      return padT + (1 - y) * plotH;
    }

    ctx.clearRect(0, 0, W, H);

    /* grid: vertical year lines + faint horizontal rules */
    ctx.strokeStyle = rule;
    ctx.lineWidth = 1;
    ctx.font = mono;
    ctx.fillStyle = inkFaint;
    ctx.textAlign = "center";
    for (var year = 2020; year <= 2026; year++) {
      var gx = X(year);
      ctx.beginPath();
      ctx.moveTo(gx, padT);
      ctx.lineTo(gx, padT + plotH);
      ctx.stroke();
      if (!narrow || year % 2 === 0) {
        ctx.fillText(String(year), gx, H - 12);
      }
    }
    for (var g = 0; g <= 4; g++) {
      var gy = padT + (plotH / 4) * g;
      ctx.beginPath();
      ctx.moveTo(padL, gy);
      ctx.lineTo(padL + plotW, gy);
      ctx.stroke();
    }

    /* y-axis label */
    ctx.save();
    ctx.translate(narrow ? 10 : 14, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = inkFaint;
    ctx.fillText(narrow ? "SCOPE" : "SCOPE OF WORK →", 0, 0);
    ctx.restore();

    /* the curve, clipped to animation progress */
    var pts = pathPoints();
    var tEnd = T_START + (T_NOW - T_START) * chartProgress;

    function curveTo(limitT) {
      ctx.beginPath();
      var started = false;
      var steps = 160;
      for (var i = 0; i <= steps; i++) {
        var t = T_START + ((T_NOW - T_START) * i) / steps;
        if (t > limitT) break;
        var y = sampleCurve(pts, t);
        var px = X(t);
        var py = Y(y);
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      return { x: X(Math.min(limitT, T_NOW)), y: Y(sampleCurve(pts, Math.min(limitT, T_NOW))) };
    }

    /* area fill */
    var tip = curveTo(tEnd);
    ctx.lineTo(tip.x, Y(0));
    ctx.lineTo(X(T_START), Y(0));
    ctx.closePath();
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.09;
    ctx.fill();
    ctx.globalAlpha = 1;

    /* line */
    tip = curveTo(tEnd);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.stroke();

    /* milestone markers + labels */
    MILESTONES.forEach(function (m) {
      if (m.t > tEnd) return;
      var mx = X(m.t);
      var my = Y(sampleCurve(pts, m.t));
      ctx.beginPath();
      ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
      if (narrow && m.small) return;
      ctx.font = mono;
      ctx.fillStyle = ink;
      ctx.textAlign = "left";
      ctx.fillText(m.label, mx - 4, my - 12);
    });

    /* the "now" endpoint, annotated in red ink */
    if (chartProgress >= 1) {
      var nx = X(T_NOW);
      var ny = Y(NOW_Y);
      ctx.beginPath();
      ctx.arc(nx, ny, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = red;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(nx, ny, 9, 0, Math.PI * 2);
      ctx.strokeStyle = red;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.font = mono;
      ctx.fillStyle = red;
      ctx.textAlign = "right";
      ctx.fillText("YOU ARE HERE", nx - 12, ny + (narrow ? -14 : 4));
    }
  }

  /* piecewise-linear sample with light smoothing between points */
  function sampleCurve(pts, t) {
    if (t <= pts[0].t) return pts[0].y;
    for (var i = 1; i < pts.length; i++) {
      if (t <= pts[i].t) {
        var a = pts[i - 1];
        var b = pts[i];
        var u = (t - a.t) / (b.t - a.t);
        u = u * u * (3 - 2 * u); // smoothstep easing between milestones
        return a.y + (b.y - a.y) * u;
      }
    }
    return pts[pts.length - 1].y;
  }

  function animateChart() {
    if (chartAnimated) return;
    chartAnimated = true;
    if (reducedMotion) {
      chartProgress = 1;
      drawTrajectory(true);
      return;
    }
    var startTs = null;
    var DURATION = 1600;
    function frame(ts) {
      if (!startTs) startTs = ts;
      var u = Math.min((ts - startTs) / DURATION, 1);
      chartProgress = 1 - Math.pow(1 - u, 3); // ease-out cubic
      drawTrajectory();
      if (u < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (canvas) {
    if ("IntersectionObserver" in window && !reducedMotion) {
      var chartIo = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            animateChart();
            chartIo.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      chartIo.observe(canvas);
    } else {
      animateChart();
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        drawTrajectory(true);
      }, 120);
    });
  }

  /* ---------- fig. 02 — GitHub contribution heatmap ---------- */

  var GITHUB_USER = "MichalM31252";
  var activitySection = document.getElementById("activity");
  var heatmap = document.getElementById("heatmap");

  fetch("https://github-contributions-api.jogruber.de/v4/" + GITHUB_USER + "?y=last")
    .then(function (res) {
      if (!res.ok) throw new Error("contributions API " + res.status);
      return res.json();
    })
    .then(function (data) {
      var days = data.contributions || [];
      if (!days.length) return;
      var frag = document.createDocumentFragment();
      /* pad the first column so weekdays line up (grid flows by column) */
      var firstDow = new Date(days[0].date + "T00:00:00").getDay();
      for (var p = 0; p < firstDow; p++) {
        var pad = document.createElement("span");
        pad.style.visibility = "hidden";
        frag.appendChild(pad);
      }
      var total = 0;
      days.forEach(function (d) {
        total += d.count;
        var cell = document.createElement("span");
        if (d.level > 0) cell.className = "l" + d.level;
        cell.title = d.date + " — " + d.count + " contribution" + (d.count === 1 ? "" : "s");
        frag.appendChild(cell);
      });
      heatmap.appendChild(frag);
      var cap = document.getElementById("heat-caption");
      if (cap) {
        cap.textContent =
          total.toLocaleString("en") +
          " GitHub contributions in the trailing 12 months — github.com/" +
          GITHUB_USER +
          ".";
      }
      activitySection.hidden = false;
      /* section was hidden while the observer ran; reveal it directly */
      activitySection.classList.add("in");
    })
    .catch(function () {
      /* no data, no section — the page stands on its own */
    });
})();
