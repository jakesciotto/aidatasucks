import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    ui_host: "https://us.posthog.com",
    defaults: "2026-05-30",
    person_profiles: "always",
    autocapture: { capture_copied_text: true },
    capture_pageview: "history_change",
    capture_pageleave: true,
    capture_exceptions: true,
    capture_dead_clicks: true,
    capture_performance: { web_vitals: true },
    enable_heatmaps: true,
    session_recording: { maskAllInputs: false },
    disable_surveys: true,
    debug: process.env.NODE_ENV === "development",
  });
} else if (process.env.NODE_ENV === "development") {
  console.warn("NEXT_PUBLIC_POSTHOG_KEY is not set; PostHog is disabled.");
}
