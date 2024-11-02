import { source } from "sveltekit-sse";
import { EVENT_DASHBOARD_SUMMARY_UPDATE } from "$lib/events.ts";
import type { DashboardSummary } from "$lib/dashboard/types.ts";

const eventSource = source("/events/dashboard-summary");
const channel = eventSource.select(EVENT_DASHBOARD_SUMMARY_UPDATE);
export const summaryStore = channel.transform((value: string) => {
	const d = JSON.parse(value) as DashboardSummary;
	return {
		pullRequests: d.pullRequests ?? [],
		securityAdvisories: d.securityAdvisories ?? [],
		products: d.products ?? [],
	};
});
