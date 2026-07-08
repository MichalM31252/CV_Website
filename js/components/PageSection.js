/* Shared section shell: anchor id, "-- label" header rule, and heading. */
export default {
  name: "PageSection",
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    heading: { type: String, required: true },
  },
  template: `
    <section :id="id">
      <div class="wrap">
        <div class="sec-head">
          <span class="sec-label">{{ label }}</span>
          <span class="sec-rule"></span>
        </div>
        <h2>{{ heading }}</h2>
        <slot></slot>
      </div>
    </section>
  `,
};
