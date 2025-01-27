import cron from "node-cron";
import { logger } from "toolbox";
import { service } from "./products";

export function initWorkers() {
	logger.info("initializing workers");

	cron.schedule("*/3 * * * *", async () => {
		logger.info("fetching dashboard data");
		const errors = await service.syncProducts();
		if (errors.length) {
			logger.error({ errors }, "errors fetching dashboard data");
		}
		logger.info("dashboard data fetched");
	});
}
