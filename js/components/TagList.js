export default {
  name: "TagList",
  props: {
    tags: { type: Array, required: true },
  },
  template: `
    <div class="tags"><span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span></div>
  `,
};
