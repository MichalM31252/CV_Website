import PageSection from "./PageSection.js";

export default {
  name: "SkillsSection",
  components: { PageSection },
  props: {
    skills: { type: Object, required: true },
  },
  template: `
    <PageSection id="skills" label="skills" :heading="skills.heading">
      <div class="skill-grid">
        <div v-for="group in skills.groups" :key="group.title" class="skill-col" v-reveal>
          <h3>{{ group.title }}</h3>
          <ul>
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </PageSection>
  `,
};
