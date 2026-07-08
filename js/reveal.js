/* v-reveal — fades an element in the first time it scrolls into view. */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const observer =
  !reduceMotion && "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12 },
      )
    : null;

export default {
  mounted(el) {
    el.classList.add("reveal");
    if (observer) observer.observe(el);
    else el.classList.add("in");
  },
};
