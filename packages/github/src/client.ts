import { post } from "./api";
import { queryReposByTopic } from "./query";
import type { ClientOptions, SearchOptions } from "./types";

export function initClient(defaultOptions: ClientOptions) {
	return {
		searchRepos(options?: SearchOptions) {
			const searchOpts = mergeOptions(defaultOptions, options);
			const query = queryReposByTopic(
				searchOpts.owner,
				searchOpts.topics.join(","),
			);
			return post(defaultOptions.ghToken, { query });
		},
	};
}

function mergeOptions(defaultOptions: ClientOptions, options?: SearchOptions) {
	const searchOpt: SearchOptions = {
		owner: defaultOptions.defaultOwner,
		topics: defaultOptions.defaultTopics ?? [],
	};

	if (!options) {
		return searchOpt;
	}

	return {
		...searchOpt,
		...options,
	};
}
