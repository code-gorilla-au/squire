#####################
##@ TESTS
#####################

test: ## Run tests
	bun run --filter='*' test

test-cover: ## Run Package tests with coverage
	bunx vitest --coverage

