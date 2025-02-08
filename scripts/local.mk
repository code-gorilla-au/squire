#####################
##@ LOCAL
#####################

local-clean-all: local-clean-db local-clean-modules ## Clean local dev  

local-clean-modules: ## clean node modules
	@echo "Cleaning node_modules"
	bunx rimraf node_modules apps/**/node_modules

local-clean-db: ## clean db
	@echo "Cleaning db"
	bunx rimraf .db/**/*.duckdb