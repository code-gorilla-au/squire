.DEFAULT_GOAL := help

PROJECT_ROOT:=$(shell git rev-parse --show-toplevel)
REPO_URL := $(shell git config --get remote.origin.url)
COMMIT := $(shell git rev-parse --short HEAD)
BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
DATE := $(shell date +%Y-%m-%d-%H-%M-%S)
APP_NAME := $(shell basename `git rev-parse --show-toplevel`)

# Load env properties , db name, port, etc...
# nb: You can change the default config with `make ENV_CONTEXT=".env.uat" `
ENV_CONTEXT ?= .env.local
ENV_CONTEXT_PATH:=$(PROJECT_ROOT)/$(ENV_CONTEXT)

## Override any default values in the parent .env, with your own
-include $(ENV_CONTEXT_PATH)

MAKE_LIB:=$(PROJECT_ROOT)/scripts
-include $(MAKE_LIB)/tests.mk
-include $(MAKE_LIB)/local.mk
-include $(MAKE_LIB)/logs.mk


BUN_CMD ?= "run test"
BUN_FILTER ?= "*"

#####################
##@ CI
#####################

install-ci: ## Install immutable dependencies
	bun install --frozen-lockfile

build: ## Build the app
	bun run --filter client build

#####################
##@ DEV
#####################

dev-app: ## Run the app in dev mode
	$(eval BUN_CMD := "run dev")
	$(eval BUN_FILTER := "client")
	@$(MAKE) bun-run-cmd --no-print-directory BUN_CMD=$(BUN_CMD) BUN_FILTER=$(BUN_FILTER)

dev-ingest: ## Pre-ingest github data into app before starting
	$(eval BUN_CMD := "run ingest")
	$(eval BUN_FILTER := "pre-ingest")
	@$(MAKE) bun-run-cmd --no-print-directory BUN_CMD=$(BUN_CMD) BUN_FILTER=$(BUN_FILTER)

install: ## Install dependencies
	bun install

lint-fix: ## run lint and fix
	bunx biome check --write .


reset-state: local-clean-all install ## Reset the state of the app
	

bun-run-cmd: # private task - common bun run command
	PROJECT_ROOT=$(PROJECT_ROOT) \
	bun --env-file=$(ENV_CONTEXT_PATH) --filter=$(BUN_FILTER) $(BUN_CMD)