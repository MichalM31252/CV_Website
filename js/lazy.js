/* Run `cb` once, the first time `el` scrolls near the viewport. Keeps below-the-fold
   API calls off the initial critical path. Falls back to running immediately where
   IntersectionObserver isn't available. The rootMargin starts the work a little before
   the element is actually visible, so the data is usually ready on arrival. */
export function onVisible(el, cb, rootMargin = "300px") {
  if (!("IntersectionObserver" in window)) return cb();
  const io = new IntersectionObserver(
    (entries, obs) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        obs.disconnect();
        cb();
      }
    },
    { rootMargin },
  );
  io.observe(el);
}
