import QueryCard from "./QueryCard.js";
import { GithubIcon, LinkedinIcon, MailIcon } from "../icons.js";

export default {
  name: "HeroSection",
  components: { QueryCard, GithubIcon, LinkedinIcon, MailIcon },
  props: {
    name: { type: Object, required: true },
    jobTitle: { type: String, required: true },
    location: { type: String, required: true },
    hero: { type: Object, required: true },
    contact: { type: Object, required: true },
    card: { type: Object, required: true },
  },
  template: `
    <header class="hero" id="top">
      <div class="wrap hero-grid">
        <div>
          <span class="eyebrow">{{ jobTitle }} · {{ location }}</span>
          <h1>{{ name.first }}<br /><span class="surname">{{ name.last }}</span></h1>
          <p class="hero-lede" v-html="hero.lede"></p>
          <div class="hero-actions">
            <a class="btn btn-primary" :href="'mailto:' + contact.email"><MailIcon /> {{ hero.primaryButton }}</a>
            <a class="btn" :href="contact.github" target="_blank" rel="noopener"><GithubIcon /> GitHub</a>
            <a class="btn" :href="contact.linkedin" target="_blank" rel="noopener"><LinkedinIcon /> LinkedIn</a>
          </div>
        </div>
        <QueryCard :card="card" />
      </div>
    </header>
  `,
};
