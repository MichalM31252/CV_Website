import SiteNav from "./SiteNav.js";
import HeroSection from "./HeroSection.js";
import AboutSection from "./AboutSection.js";
import ExperienceSection from "./ExperienceSection.js";
import ProjectsSection from "./ProjectsSection.js";
import ActivitySection from "./ActivitySection.js";
import SkillsSection from "./SkillsSection.js";
import EducationSection from "./EducationSection.js";
import ContactSection from "./ContactSection.js";
import SiteFooter from "./SiteFooter.js";

export default {
  name: "App",
  components: {
    SiteNav,
    HeroSection,
    AboutSection,
    ExperienceSection,
    ProjectsSection,
    ActivitySection,
    SkillsSection,
    EducationSection,
    ContactSection,
    SiteFooter,
  },
  props: {
    portfolio: { type: Object, required: true },
  },
  template: `
    <SiteNav :handle="portfolio.name.handle" :links="portfolio.nav" />
    <HeroSection
      :name="portfolio.name"
      :job-title="portfolio.jobTitle"
      :location="portfolio.location"
      :hero="portfolio.hero"
      :contact="portfolio.contact"
      :card="portfolio.queryCard"
    />
    <main>
      <AboutSection :about="portfolio.about" />
      <ExperienceSection :experience="portfolio.experience" />
      <ProjectsSection :projects="portfolio.projects" />
      <ActivitySection :activity="portfolio.activity" :github-url="portfolio.contact.github" />
      <SkillsSection :skills="portfolio.skills" />
      <EducationSection :education="portfolio.education" />
      <ContactSection :section="portfolio.contactSection" :contact="portfolio.contact" />
    </main>
    <SiteFooter :name="portfolio.name" :location="portfolio.location" :note="portfolio.footer.rightNote" />
  `,
};
