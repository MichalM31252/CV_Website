export default {
  name: "SiteFooter",
  props: {
    name: { type: Object, required: true },
    location: { type: String, required: true },
    note: { type: String, required: true },
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
    city() {
      return this.location.split(",")[0];
    },
  },
  template: `
    <footer>
      <div class="wrap footer-inner">
        <span>© {{ year }} {{ name.first }} {{ name.last }} · {{ city }}</span>
        <span>{{ note }}</span>
      </div>
    </footer>
  `,
};
