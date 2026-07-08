import PageSection from "./PageSection.js";
import TagList from "./TagList.js";
import { ArrowIcon } from "../icons.js";

export default {
  name: "ProjectsSection",
  components: { PageSection, TagList, ArrowIcon },
  props: {
    projects: { type: Object, required: true },
  },
  template: `
    <PageSection id="projects" label="projects" :heading="projects.heading">
      <div class="proj-grid">
        <component
          v-for="project in projects.items"
          :key="project.name"
          :is="project.url ? 'a' : 'div'"
          class="proj"
          v-reveal
          :href="project.url || null"
          :target="project.url ? '_blank' : null"
          :rel="project.url ? 'noopener' : null"
        >
          <div class="proj-top">
            <h3>{{ project.name }}</h3>
            <ArrowIcon v-if="project.url" />
          </div>
          <p>{{ project.desc }}</p>
          <TagList :tags="project.tags" />
        </component>
      </div>
    </PageSection>
  `,
};
