// Pinned horizontal rail: a tall section, a sticky pin, and a track whose offset
// is driven by how far the page has scrolled through it. The service-page
// milestone strip used to share this; it is a vertical timeline now, so only the
// reasons strip is left -- the loop stays because the shape is worth keeping if a
// second rail ever returns.
const RAILS = [
  { track: ".whyTrackJS", section: ".sec-why", prefix: "why" },
];

export default function ScrollRailModule() {
  RAILS.forEach(({ track: trackSelector, section: sectionSelector, prefix }) => {
    const track = document.querySelector(trackSelector);
    if (!track) return;

    const section = track.closest(sectionSelector);
    const pin = track.parentElement;
    if (!section || !pin) return;

    const desktop = window.matchMedia("(min-width: 1441px)");
    let frame = 0;

    // Vertical scroll through the tall section maps onto the track's overhang,
    // so the last card lands exactly as the section releases.
    const update = () => {
      frame = 0;

      // Unpinned, the track scrolls itself, so progress comes from its own
      // offset and still drives the bar. RTL scrollLeft counts down from 0 to
      // -max in Chrome, hence the magnitude.
      if (!desktop.matches) {
        section.style.removeProperty(`--${prefix}-x`);

        const reach = track.scrollWidth - track.clientWidth;
        const ratio = reach > 0 ? Math.min(Math.abs(track.scrollLeft) / reach, 1) : 0;
        section.style.setProperty(`--${prefix}-progress`, ratio.toFixed(4));
        return;
      }

      section.style.setProperty(`--${prefix}-view`, `${pin.clientWidth}px`);

      const travel = track.scrollWidth - pin.clientWidth;
      const span = section.offsetHeight - window.innerHeight;
      if (travel <= 0 || span <= 0) {
        section.style.setProperty(`--${prefix}-x`, "0px");
        return;
      }

      const progress = Math.min(Math.max(-section.getBoundingClientRect().top / span, 0), 1);
      section.style.setProperty(`--${prefix}-progress`, progress.toFixed(4));
      section.style.setProperty(`--${prefix}-x`, `${Math.round(progress * travel)}px`);
    };

    const request = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    track.addEventListener("scroll", request, { passive: true });
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    desktop.addEventListener("change", request);

    update();
  });
}
