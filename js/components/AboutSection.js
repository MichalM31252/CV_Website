import PageSection from "./PageSection.js";

export default {
  name: "AboutSection",
  components: { PageSection },
  props: {
    about: { type: Object, required: true },
  },
  template: `
    <PageSection id="about" label="about" :heading="about.heading">
      <div class="about-grid">
        <div v-reveal>
          <p v-for="(paragraph, i) in about.paragraphs" :key="i" v-html="paragraph"></p>
        </div>
        <div class="facts" v-reveal>
          <dl>
            <div class="fact" v-for="fact in about.facts" :key="fact.label">
              <dt>{{ fact.label }}</dt>
              <dd>{{ fact.value }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </PageSection>
  `,
};
