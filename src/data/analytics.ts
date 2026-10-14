import { PUBLIC_UMAMI_SCRIPT_URL, PUBLIC_UMAMI_WEBSITE_ID } from "astro:env/client";

/** Umami statistics, only in production builds with both values set: local and preview builds send nothing. */
export const umami =
  import.meta.env.PROD && PUBLIC_UMAMI_SCRIPT_URL && PUBLIC_UMAMI_WEBSITE_ID
    ? { src: PUBLIC_UMAMI_SCRIPT_URL, websiteId: PUBLIC_UMAMI_WEBSITE_ID }
    : undefined;
