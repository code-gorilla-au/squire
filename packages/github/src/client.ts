import { post } from "./api";
import { queryReposAndActiveSecByTopic } from "./query";
import type {
	ClientOptions,
	QuerySearch,
	RepositoryDto,
	SearchOptions,
	SearchParameters,
} from "./types";

export function initClient(defaultOptions: ClientOptions) {
	return {
		searchRepos(options?: SearchOptions) {
			const searchOpts = mergeOptions(defaultOptions, options);
			const query = queryReposAndActiveSecByTopic(
				searchOpts.owner,
				searchOpts.topics.join(","),
			);
			return post<QuerySearch<RepositoryDto>>(defaultOptions.ghToken, {
				query,
			});
		},
	};
}

function mergeOptions(
	defaultOptions: ClientOptions,
	options?: SearchOptions,
): SearchParameters {
	const searchOpt: SearchParameters = {
		owner: defaultOptions.defaultOwner,
		topics: defaultOptions.defaultTopics ?? [],
	};

	if (!options) {
		return searchOpt;
	}

	return {
		owner: options.owner ?? searchOpt.owner,
		topics: options.topics ?? searchOpt.topics,
	};
}
