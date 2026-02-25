import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
  // api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  api_host: "https://analytics.aidatasucks.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
});
