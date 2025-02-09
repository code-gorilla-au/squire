#####################
##@ TESTS
#####################

test: ## Run tests
	$(eval BUN_CMD := "run test")
	@$(MAKE) bun-run-cmd --no-print-directory BUN_CMD=$(BUN_CMD)

test-cover: ## Run Package tests with coverage
	bunx vitest --coverage

test-client: ## Run tests for client
	cd ./apps/client && \
	bunx vitest --run