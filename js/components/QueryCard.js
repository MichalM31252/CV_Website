const SQL_KEYWORDS =
  /^(SELECT|FROM|WHERE|AND|OR|NOT|ORDER|GROUP|BY|LIMIT|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|IN|LIKE|HAVING|UNION|INSERT|INTO|VALUES|UPDATE|SET|DELETE|DISTINCT|COUNT|SUM|AVG|MIN|MAX)$/i;

const TYPE_DELAY_MS = 34;
const START_DELAY_MS = 600;
const RESULT_DELAY_MS = 350;

export default {
  name: "QueryCard",
  props: {
    card: { type: Object, required: true },
  },
  data() {
    return { typedChars: 0, showResult: false, timer: null };
  },
  computed: {
    /* The query split into { text, cls } tokens for syntax highlighting. */
    tokens() {
      const parts = this.card.query.match(/('[^']*')|(\w+)|([^\w']+)/g) || [];
      return parts.map((text) => ({
        text,
        cls: text.startsWith("'") ? "str" : SQL_KEYWORDS.test(text) ? "kw" : "",
      }));
    },
    /* The tokens truncated to the number of characters typed so far. */
    visibleTokens() {
      const visible = [];
      let budget = this.typedChars;
      for (const token of this.tokens) {
        if (budget <= 0) break;
        visible.push({ cls: token.cls, text: token.text.slice(0, budget) });
        budget -= token.text.length;
      }
      return visible;
    },
  },
  mounted() {
    const total = this.card.query.length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.typedChars = total;
      this.showResult = true;
      return;
    }
    this.timer = setTimeout(() => {
      this.timer = setInterval(() => {
        this.typedChars += 1;
        if (this.typedChars >= total) {
          clearInterval(this.timer);
          this.timer = setTimeout(() => {
            this.showResult = true;
          }, RESULT_DELAY_MS);
        }
      }, TYPE_DELAY_MS);
    }, START_DELAY_MS);
  },
  beforeUnmount() {
    clearTimeout(this.timer);
    clearInterval(this.timer);
  },
  template: `
    <div
      class="query-card"
      role="img"
      aria-label="Stylized SQL console typing a query that returns the candidate's current role"
    >
      <div class="query-bar" aria-hidden="true">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        <span>{{ card.filename }}</span>
      </div>
      <div class="query-body" aria-hidden="true"><span v-for="(token, i) in visibleTokens" :key="i" :class="token.cls">{{ token.text }}</span><span class="caret"></span></div>
      <div class="query-result" :class="{ show: showResult }" aria-hidden="true">
        <table class="result-table">
          <thead>
            <tr><th v-for="column in card.resultColumns" :key="column">{{ column }}</th></tr>
          </thead>
          <tbody>
            <tr><td v-for="cell in card.resultRow" :key="cell">{{ cell }}</td></tr>
          </tbody>
        </table>
        <p class="result-meta" v-html="card.resultMeta"></p>
      </div>
    </div>
  `,
};
