import PageSection from "./PageSection.js";
import TimelineItem from "./TimelineItem.js";

export default {
  name: "EducationSection",
  components: { PageSection, TimelineItem },
  props: {
    education: { type: Object, required: true },
  },
  template: `
    <PageSection id="education" label="education" :heading="education.heading">
      <div class="edu-grid">
        <div v-reveal>
          <p class="col-label">Education</p>
          <div class="timeline">
            <TimelineItem
              v-for="school in education.schools"
              :key="school.degree"
              :date="school.date"
              :title="school.degree"
              :org="school.school"
              :bullets="school.bullets"
            />
          </div>
        </div>
        <div v-reveal>
          <p class="col-label">Certificates</p>
          <div v-for="cert in education.certificates" :key="cert.name" class="cert">
            <div>
              <p class="cert-name">{{ cert.name }}</p>
              <p class="cert-org">{{ cert.org }}</p>
            </div>
            <span class="cert-date">{{ cert.date }}</span>
          </div>
        </div>
      </div>
    </PageSection>
  `,
};
