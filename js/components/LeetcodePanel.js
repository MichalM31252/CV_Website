/* Live LeetCode panel: solved-problem stats from community APIs,
   tried in order, with a graceful fallback message. */
import { onVisible } from "../lazy.js";

const row = (label, cls, solved, total) => ({ label, cls, solved, total });

const sources = (user) => [
  {
    url: `https://leetcode-stats-api.herokuapp.com/${user}`,
    map: (d) =>
      d.status === "success" && {
        total: d.totalSolved,
        ranking: d.ranking,
        rows: [
          row("Easy", "lc-easy", d.easySolved, d.totalEasy),
          row("Medium", "lc-medium", d.mediumSolved, d.totalMedium),
          row("Hard", "lc-hard", d.hardSolved, d.totalHard),
        ],
      },
  },
  {
    url: `https://alfa-leetcode-api.onrender.com/${user}/solved`,
    map: (d) => ({
      total: d.solvedProblem,
      ranking: null,
      rows: [
        row("Easy", "lc-easy", d.easySolved, null),
        row("Medium", "lc-medium", d.mediumSolved, null),
        row("Hard", "lc-hard", d.hardSolved, null),
      ],
    }),
  },
];

export default {
  name: "LeetcodePanel",
  props: {
    username: { type: String, default: "" },
  },
  data() {
    return { stats: null, failed: false, filled: false };
  },
  computed: {
    user() {
      return this.username.trim();
    },
    profileUrl() {
      return `https://leetcode.com/u/${this.user}/`;
    },
    subline() {
      return this.stats.ranking
        ? "global rank #" + Number(this.stats.ranking).toLocaleString("en")
        : "problems solved on LeetCode";
    },
  },
  mounted() {
    if (!this.user) return;
    /* Defer the network calls until the panel nears the viewport — it sits well
       below the fold, so keeping its requests off the initial critical path. */
    onVisible(this.$refs.root, () => this.load());
  },
  methods: {
    async load() {
      for (const source of sources(this.user)) {
        try {
          const res = await fetch(source.url);
          if (!res.ok) continue;
          const stats = source.map(await res.json());
          if (!stats) continue;
          this.stats = stats;
          /* Let the bars render at width 0 first so the fill animates in. */
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              this.filled = true;
            }),
          );
          return;
        } catch {
          /* try the next source */
        }
      }
      this.failed = true;
    },
    percent(r) {
      const total = r.total || this.stats.total;
      return total ? Math.round((r.solved / total) * 100) : 0;
    },
  },
  template: `
    <div class="panel" v-reveal ref="root">
      <div class="panel-head">
        <span class="panel-title">leetcode</span>
        <a v-if="user" class="panel-link" :href="profileUrl" target="_blank" rel="noopener">@{{ user }} ↗</a>
      </div>
      <div v-if="stats">
        <p class="lc-total">{{ stats.total }}<small> solved</small></p>
        <p class="lc-sub">{{ subline }}</p>
        <div v-for="r in stats.rows" :key="r.label" class="lc-row" :class="r.cls">
          <div class="lc-meta">
            <span>{{ r.label }}</span>
            <span>{{ r.solved }}{{ r.total ? " / " + r.total : "" }}</span>
          </div>
          <div class="lc-bar"><div class="lc-fill" :style="{ width: (filled ? percent(r) : 0) + '%' }"></div></div>
        </div>
      </div>
      <p v-else-if="failed" class="panel-note">
        Couldn't load live stats right now — view my profile on
        <a :href="profileUrl" target="_blank" rel="noopener">LeetCode ↗</a>
      </p>
      <p v-else-if="!user" class="panel-note">
        Add a LeetCode username in js/data.js and solved-problem stats will appear here automatically.
      </p>
      <p v-else class="panel-note">Loading LeetCode stats…</p>
    </div>
  `,
};
