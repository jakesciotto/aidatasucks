<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for aidatasucks.com — a static Next.js App Router site. Since the project uses `output: "export"` (no server-side runtime), all tracking is client-side only. PostHog is initialized via `instrumentation-client.js` using the Next.js 15.3+ pattern, with API keys loaded from environment variables. Four events were added across two components covering the core user interactions: vendor exploration, table filtering/sorting, and contribution intent.

| Event name | Description | File |
|---|---|---|
| `vendor_link_clicked` | User clicks a vendor name link to visit the vendor's website. Captures vendor name, slug, grade, and destination URL. | `src/components/vendor-table.jsx` |
| `vendor_searched` | User types in the vendor filter input. Captures the search query. Fires on every keystroke when the query is non-empty. | `src/components/vendor-table.jsx` |
| `vendor_sorted` | User clicks a sortable column header (Vendor or Grade). Captures sort field and direction. | `src/components/vendor-table.jsx` |
| `github_pr_link_clicked` | User clicks the "Open a PR" link in the footer. Captures intent to contribute to the project. | `src/components/site-footer.jsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics](https://us.posthog.com/project/313269/dashboard/1309753)
- Insight: [All user events over time](https://us.posthog.com/project/313269/insights/ClYdYp5o)
- Insight: [Vendor engagement funnel: search to click](https://us.posthog.com/project/313269/insights/55PdmE60)
- Insight: [Top vendors by click volume](https://us.posthog.com/project/313269/insights/GIHjDEFW)
- Insight: [Vendor searches over time](https://us.posthog.com/project/313269/insights/mQdSRz3R)
- Insight: [GitHub PR contribution clicks](https://us.posthog.com/project/313269/insights/uKrPzgpT)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
