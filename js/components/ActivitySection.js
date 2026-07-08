import PageSection from "./PageSection.js";
import GithubPanel from "./GithubPanel.js";
import LeetcodePanel from "./LeetcodePanel.js";

export default {
  name: "ActivitySection",
  components: { PageSection, GithubPanel, LeetcodePanel },
  props: {
    activity: { type: Object, required: true },
    githubUrl: { type: String, required: true },
  },
  template: `
    <PageSection id="activity" label="activity" :heading="activity.heading">
      <div class="activity-grid">
        <GithubPanel :username="activity.githubUsername" :profile-url="githubUrl" />
        <LeetcodePanel :username="activity.leetcodeUsername" />
      </div>
    </PageSection>
  `,
};
