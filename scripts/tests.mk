#####################
##@ TESTS
#####################

test: ## Run tests
	bun run --filter='*' test

test-cover: ## Run tests in watch mode with coverage
	bunx vitest --coverage

