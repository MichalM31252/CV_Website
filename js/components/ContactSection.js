import { PhoneIcon } from "../icons.js";

export default {
  name: "ContactSection",
  components: { PhoneIcon },
  props: {
    section: { type: Object, required: true },
    contact: { type: Object, required: true },
  },
  template: `
    <section id="contact" class="contact">
      <div class="wrap" v-reveal>
        <span class="sec-label">contact</span>
        <h2>{{ section.heading }}</h2>
        <p>{{ section.blurb }}</p>
        <a class="contact-mail" :href="'mailto:' + contact.email">{{ contact.email }}</a>
        <div class="contact-links">
          <a class="btn" :href="'tel:' + contact.phone"><PhoneIcon /> {{ contact.phoneDisplay }}</a>
          <a class="btn" :href="contact.linkedin" target="_blank" rel="noopener">LinkedIn</a>
          <a class="btn" :href="contact.github" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </section>
  `,
};
