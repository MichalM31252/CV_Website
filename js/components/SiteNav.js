export default {
  name: "SiteNav",
  props: {
    handle: { type: String, required: true },
    links: { type: Array, required: true },
  },
  data() {
    return { open: false };
  },
  template: `
    <nav class="nav" :class="{ open }" aria-label="Main navigation">
      <div class="wrap nav-inner">
        <a class="nav-brand" href="#top"><span class="tick">~/</span><b>{{ handle }}</b></a>
        <button
          class="nav-toggle"
          :aria-expanded="String(open)"
          aria-controls="navLinks"
          @click="open = !open"
        >
          menu
        </button>
        <ul class="nav-links" id="navLinks" @click="open = false">
          <li v-for="link in links" :key="link.id"><a :href="'#' + link.id">{{ link.label }}</a></li>
        </ul>
      </div>
    </nav>
  `,
};
