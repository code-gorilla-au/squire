# squire
Your most trusted local assistant. Squire's aim is to provide a focused, product view of your github organisation.

| Feature | Description |
| ------- | ----------- |
| Group by product | Use github topics to group repositories by product |
| See open PRs | Dashboard allows you to see all open PRs for all products as well as drill down to open PRs by product |
| Sec vulnerability | See open security vulnerabilities for your product suite |  

## Install 
To install dependencies:

```bash
bun install

touch .env.local # your local env file
```

## Add local config

```bash

# ================================
#  Worker: pre ingestion helper
# ================================
GH_TOKEN=<your-token>
GH_OWNER=<your-org>
GH_REPO_TOPICS="your,topics,to,ingest" # comma delimited list
LOG_LEVEL="debug"
DB_FILE_PATH=".db/squire.duckdb"

# ================================
#  Client: Squire app
# ================================
VITE_DB_FILE_PATH=".db/squire.duckdb"
VITE_LOG_LEVEL="debug"
VITE_GH_TOKEN=<your-token>
VITE_GH_OWNER=<your-org>


```


## Pre ingestion
You have the option to pre-ingest data if you have already added the topics to the repositories.

```bash
bun run dev:worker
```

## Run app
run the client locally

```bash
bun run dev:app
```

Access the webpage on http://localhost:5173/