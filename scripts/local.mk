#####################
##@ LOCAL
#####################


local-clean: ## clean node modules
	bunx rimraf node_modules apps/**/node_modules

local-clean-db: ## clean db
	bunx rimraf .db/**/*.duckdb