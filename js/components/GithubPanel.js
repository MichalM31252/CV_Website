/* Live GitHub panel: profile chips + a weekday-aligned contribution calendar. */
const CELL_PX = 10;
const GAP_PX = 3;
const WEEK_PX = CELL_PX + GAP_PX;

export default {
  name: "GithubPanel",
  props: {
    username: { type: String, required: true },
    profileUrl: { type: String, required: true },
  },
  data() {
    return {
      profile: null,
      cells: null,
      total: 0,
      weeks: 1,
      failed: false,
      observer: null,
    };
  },
  computed: {
    /* Only the newest week-columns that fit the panel width — no scrollbar. */
    visibleCells() {
      return this.cells ? this.cells.slice(-this.weeks * 7) : [];
    },
  },
  mounted() {
    /* ResizeObserver reads the width off the browser's own layout pass, so it
       avoids the forced reflow a synchronous clientWidth read would cause, and
       it re-fits when the async stylesheet finally lands (or the window resizes). */
    this.observer = new ResizeObserver(([entry]) => this.fit(entry.contentRect.width));
    this.observer.observe(this.$refs.scroller);
    this.loadProfile();
    this.loadCalendar();
  },
  beforeUnmount() {
    this.observer.disconnect();
  },
  methods: {
    async loadProfile() {
      try {
        const res = await fetch(`https://api.github.com/users/${this.username}`);
        if (res.ok) this.profile = await res.json();
      } catch {
        /* the chips simply stay hidden */
      }
    },
    async loadCalendar() {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${this.username}?y=last`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const days = (await res.json()).contributions;

        /* Weekday-align like GitHub: every group of 7 cells is one week
           (row 0 = Sunday … row 6 = Saturday). Pad the first week down to
           the first day's weekday and the last partial week up to a full
           column, so today lands in its true weekday row. */
        const cells = [];
        const lead = new Date(days[0].date + "T00:00:00").getDay();
        for (let i = 0; i < lead; i++) cells.push(null);
        cells.push(...days);
        while (cells.length % 7 !== 0) cells.push(null);

        this.cells = cells;
        this.total = days.reduce((sum, day) => sum + day.count, 0);
      } catch {
        this.failed = true;
      }
    },
    fit(available) {
      this.weeks = Math.max(1, Math.floor((available + GAP_PX) / WEEK_PX));
    },
    tooltip(cell) {
      return `${cell.date}: ${cell.count} contribution${cell.count === 1 ? "" : "s"}`;
    },
  },
  template: `
    <div class="panel" v-reveal>
      <div class="panel-head">
        <span class="panel-title">github contributions</span>
        <a class="panel-link" :href="profileUrl" target="_blank" rel="noopener">@{{ username }} ↗</a>
      </div>
      <div class="stat-chips">
        <template v-if="profile">
          <span class="chip"><b>{{ profile.public_repos }}</b> public repos</span>
          <span class="chip"><b>{{ profile.followers }}</b> followers</span>
        </template>
      </div>
      <div class="cal-scroll" ref="scroller">
        <div class="cal" role="img" aria-label="GitHub contribution calendar for the last twelve months">
          <i
            v-for="(cell, i) in visibleCells"
            :key="i"
            :class="cell ? (cell.level ? 'l' + cell.level : '') : 'cal-pad'"
            :title="cell ? tooltip(cell) : null"
            :aria-hidden="cell ? null : 'true'"
          ></i>
        </div>
      </div>
      <div class="cal-caption">
        <span v-if="failed">
          Couldn't load live data — see the full graph on
          <a :href="profileUrl" target="_blank" rel="noopener">GitHub ↗</a>
        </span>
        <template v-else-if="cells">
          <span><b>{{ total.toLocaleString("en") }}</b> contributions in the last year</span>
          <span class="cal-legend">less&nbsp;<i></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i>&nbsp;more</span>
        </template>
        <span v-else>Loading contribution data…</span>
      </div>
    </div>
  `,
};
