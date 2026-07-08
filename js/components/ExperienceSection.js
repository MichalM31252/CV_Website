import PageSection from "./PageSection.js";
import TimelineItem from "./TimelineItem.js";

export default {
  name: "ExperienceSection",
  components: { PageSection, TimelineItem },
  props: {
    experience: { type: Object, required: true },
  },
  template: `
    <PageSection id="experience" label="experience" :heading="experience.heading">
      <div class="timeline" v-reveal>
        <TimelineItem
          v-for="job in experience.jobs"
          :key="job.role + job.date"
          :date="job.date"
          :title="job.role"
          :org="job.company"
          :org-url="job.companyUrl"
          :place="job.location"
          :bullets="job.bullets"
          :tags="job.tags"
        />
      </div>
    </PageSection>
  `,
};
