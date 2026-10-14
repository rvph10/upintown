import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(CustomEase, ScrollTrigger);

// Same curves and timings as the tokens in global.css, see docs/motion.md.
CustomEase.create("curtain", "0.65,0,0.35,1");
CustomEase.create("out-expo", "0.16,1,0.3,1");
CustomEase.create("in-quart", "0.5,0,0.75,0");

export const duration = { instant: 0.2, quick: 0.3, base: 0.5, slow: 0.9, expressive: 1.1 };
export const stagger = 0.09;
/** Between the words of a title rising out of their lines. */
export const wordStagger = 0.035;

export const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

/** Data saver on: decorative videos keep their poster. */
const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

/** Reads a colour token from global.css, e.g. cssColor("ink"). */
export function cssColor(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();
}

/** Runs `setup` only while motion is allowed. Everything it creates is reverted if the visitor turns reduced motion on. */
export function withMotion(setup: () => void | (() => void)) {
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", setup);
}

/** Smooths mouse wheel scrolling and in-page anchor jumps (touch stays native), on the GSAP ticker so scroll triggers stay in sync. */
export function smoothScroll() {
  withMotion(() => {
    const lenis = new Lenis({ anchors: true });
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  });
}

/** Plays a timeline only while `trigger` is on screen, resuming where it stopped. */
export function playWhileVisible(trigger: Element, timeline: gsap.core.Animation) {
  timeline.pause();
  ScrollTrigger.create({
    trigger,
    onToggle: (self) => (self.isActive ? timeline.play() : timeline.pause()),
  });
}

/** Decorative videos never play with reduced motion or data saver. */
export function canPlayVideo() {
  return !reducedMotion.matches && !saveData;
}

/** Plays a decorative video only when allowed, and never after the visitor paused it. */
export function playVideo(video: HTMLVideoElement, play: boolean) {
  if (play && canPlayVideo() && !video.hasAttribute("data-user-paused")) video.play().catch(() => {});
  else video.pause();
}

/** Plays a decorative video only while it is on screen. The poster stays otherwise. */
export function playVideoWhileVisible(video: HTMLVideoElement) {
  let visible = false;
  new IntersectionObserver(([entry]) => playVideo(video, (visible = entry.isIntersecting))).observe(video);
  reducedMotion.addEventListener("change", () => playVideo(video, visible));
}

export { gsap, ScrollTrigger };
