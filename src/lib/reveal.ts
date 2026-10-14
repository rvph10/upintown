import { duration, gsap, ScrollTrigger, stagger, withMotion, wordStagger } from "./motion";

// Scroll reveals, see docs/motion.md. Hidden starting states live in global.css; each reveal runs once.

const arrive = { opacity: 1, y: 0, scale: 1, ease: "out-expo" };

/** Opens an image frame from the bottom edge while the picture inside settles from a slight zoom. */
function unmask(frame: Element, delay = 0) {
  gsap.fromTo(
    frame,
    { clipPath: "inset(100% 0% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: duration.expressive, ease: "out-expo", delay },
  );
  const media = frame.querySelector("img, video");
  if (media) {
    gsap.fromTo(media, { scale: 1.15 }, { scale: 1, duration: duration.expressive * 1.4, ease: "out-expo", delay });
  }
}

/** Parts that land just after their block: gauge bars grow, checkmarks settle, image frames open. */
function details(item: Element, delay = 0) {
  const grow = item.querySelectorAll("[data-reveal-grow]");
  if (grow.length) {
    gsap.from(grow, {
      scaleY: 0,
      transformOrigin: "50% 100%",
      duration: duration.slow,
      ease: "out-expo",
      stagger,
      delay: delay + 0.3,
    });
  }
  const pop = item.querySelectorAll("[data-reveal-pop]");
  if (pop.length) {
    gsap.from(pop, {
      scale: 0.4,
      opacity: 0,
      transformOrigin: "50% 50%",
      duration: duration.base,
      ease: "out-expo",
      stagger: 0.06,
      delay: delay + 0.35,
    });
  }
  item.querySelectorAll("[data-reveal-image]").forEach((frame) => unmask(frame, delay));
}

/** Plays the parts of a sequence in page order: title words rise out of their lines, steps rise in. */
function playSequence(container: Element) {
  const timeline = gsap.timeline({ defaults: { ease: "out-expo" } });
  let at = 0;
  container.querySelectorAll("[data-reveal-step], [data-words]").forEach((part) => {
    if (part.hasAttribute("data-words")) {
      const words = part.querySelectorAll(".word-inner");
      timeline.to(words, { y: 0, duration: duration.expressive, stagger: wordStagger }, at);
      at += 0.2;
    } else {
      timeline.to(part, { opacity: 1, y: 0, duration: duration.slow }, at);
      at += 0.1;
    }
  });
  details(container, 0.2);
}

const onEnter = (trigger: Element, start: string, callback: () => void) =>
  ScrollTrigger.create({ trigger, start, once: true, onEnter: callback });

/** Children of a container reveal together when they enter together, staggered only among themselves. */
function batch(container: Element, settings: { duration: number; stagger: number }) {
  ScrollTrigger.batch(container.children, {
    start: "top 90%",
    once: true,
    onEnter: (items) => {
      gsap.to(items, { ...arrive, ...settings });
      items.forEach((item, index) => details(item, index * settings.stagger));
    },
  });
}

export function initReveals() {
  withMotion(() => {
    gsap.utils.toArray<Element>('[data-reveal=""], [data-reveal="fade"]').forEach((block) =>
      onEnter(block, "top 90%", () => {
        gsap.to(block, { ...arrive, duration: duration.slow });
        details(block);
      }),
    );

    gsap.utils
      .toArray<Element>('[data-reveal="sequence"]')
      .forEach((container) => onEnter(container, "top 85%", () => playSequence(container)));

    gsap.utils
      .toArray<Element>('[data-reveal="group"]')
      .forEach((container) => batch(container, { duration: duration.slow, stagger }));

    gsap.utils
      .toArray<Element>('[data-reveal="list"]')
      .forEach((container) => batch(container, { duration: duration.base, stagger: 0.05 }));

    // Image frames outside any reveal block open on their own.
    gsap.utils
      .toArray<Element>("[data-reveal-image]")
      .filter((frame) => !frame.parentElement?.closest("[data-reveal]"))
      .forEach((frame) => onEnter(frame, "top 85%", () => unmask(frame)));
  });
}
