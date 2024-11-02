import { produce } from "sveltekit-sse";
import { SECOND, sleep } from "$lib";
import { logger } from "toolbox";
import { service } from "$lib/server/products";
import { EVENT_DASHBOARD_SUMMARY_UPDATE } from "$lib/events";

export const POST = () => {
	return produce(async function start({ emit }) {
		logger.debug("starting dashboard summary update");
		let running = true;
		while (running) {
			logger.debug("emitting update");
			const data = await getSummary();
			const { error } = emit(
				EVENT_DASHBOARD_SUMMARY_UPDATE,
				JSON.stringify(data),
			);
			if (error) {
				running = false;
				break;
			}

			await sleep(30 * SECOND);
		}
	});
};

async function getSummary() {
	const products = await service.getAllProducts();
	const securityAdvisories = await service.getAllSecurityAdvisories();
	const pullRequests = await service.getAllOpenPullRequests();

	return {
		products,
		securityAdvisories,
		pullRequests,
	};
}
