import TagList from "./TagList.js";

/* One dated entry on a timeline — used for both jobs and schools. */
export default {
  name: "TimelineItem",
  components: { TagList },
  props: {
    date: { type: String, required: true },
    title: { type: String, required: true },
    org: { type: String, required: true },
    orgUrl: { type: String, default: null },
    place: { type: String, default: "" },
    bullets: { type: Array, required: true },
    tags: { type: Array, default: () => [] },
  },
  template: `
    <article class="t-item">
      <p class="t-date">{{ date }}</p>
      <h3 class="t-role">{{ title }}</h3>
      <p class="t-org">
        <a v-if="orgUrl" :href="orgUrl" target="_blank" rel="noopener">{{ org }}</a>
        <template v-else>{{ org }}</template>{{ place ? " · " + place : "" }}
      </p>
      <ul class="t-list">
        <li v-for="(bullet, i) in bullets" :key="i">{{ bullet }}</li>
      </ul>
      <TagList v-if="tags.length" :tags="tags" />
    </article>
  `,
};
