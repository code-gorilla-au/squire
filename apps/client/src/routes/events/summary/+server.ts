import { produce } from "sveltekit-sse";
import { SECOND, sleep } from "$lib";
import { logger } from "toolbox";
import { service } from "$lib/server/products";

export const POST = () => {
	return produce(async function start({ emit }) {
		let running = true;
		while (running) {
			logger.debug("emitting update");
			const data = await getSummary();
			const { error } = emit("update", JSON.stringify(data));
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
