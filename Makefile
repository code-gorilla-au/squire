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


#####################
##@ DEV
#####################

dev-app: ## Run the app in dev mode
	bun --env-file=$(ENV_CONTEXT_PATH) --filter=client run dev

dev-pre-ingest: ## Run the ingest in dev mode
	bun --env-file=$(ENV_CONTEXT_PATH) --filter=pre-ingest run ingest

install: tools-dev tools-ci ## Install dependencies
	bun install


lint-fix: ## run lint and fix
	bunx biome check --write .