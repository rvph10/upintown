// Umami custom events, listed in docs/analytics.md. Properties are fixed values only, never what visitors type.
// Every call is fire and forget: a blocked or failing tracker never affects the page.
import { routes } from "../data/routes";

type EventData = Record<string, string>;

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => Promise<void> };
  }
}

const language = document.documentElement.lang.slice(0, 2);

/** Plan, need and language ids from the site's own links and redirects. */
export const isId = (value: string | null): value is string => !!value && /^[a-z-]{1,20}$/.test(value);

export function track(name: string, data: EventData = {}): void {
  const send = () => {
    try {
      window.umami?.track(name, { language, ...data }).catch(() => {});
    } catch {}
  };
  // The tracker script is deferred: by the load event it has either run or failed.
  if (window.umami || document.readyState === "complete") send();
  else addEventListener("load", send, { once: true });
}

const contactPaths = new Set<string>(Object.values(routes.contact));

const placement = (link: Element) => (link.closest("header") ? "header" : link.closest("footer") ? "footer" : "page");

/** Clicks that lead to a contact: contact page links, email, phone, WhatsApp. Plus the language switch. */
export function trackContactClicks(): void {
  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element && event.target.closest<HTMLAnchorElement>("a[href]");
    if (!link) return;
    const url = new URL(link.href);
    const cta_location = placement(link);

    if (url.protocol === "mailto:") track("email_click", { cta_location });
    else if (url.protocol === "tel:") track("phone_click", { cta_location });
    else if (url.hostname === "wa.me") track("whatsapp_click", { cta_location });
    else if (link.hasAttribute("data-language-switch")) {
      if (isId(link.hreflang)) track("language_switch", { to: link.hreflang });
    } else if (url.origin === location.origin && contactPaths.has(url.pathname)) {
      const data: EventData = { cta_location };
      for (const key of ["plan", "need"]) {
        const value = url.searchParams.get(key);
        if (isId(value)) data[key] = value;
      }
      track("contact_cta_click", data);
    }
  });
}
