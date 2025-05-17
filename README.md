# squire
Your most trusted local assistant. Squire's aim is to provide a focused, product view of your github organisation.

| Feature           | Description                                                                                            |
|-------------------|--------------------------------------------------------------------------------------------------------|
| Group by product  | Use github topics to group repositories by product                                                     |
| See open PRs      | Dashboard allows you to see all open PRs for all products as well as drill down to open PRs by product |
| Sec vulnerability | See open security vulnerabilities for your product suite                                               |  
| Insights          | Get insights on PRs and security metrics for all products, or per product basis.                       |
| Basic reports     | Download basic reports from your product's page in JSON format (other format's supporting coming soon) |

## Install 
NOTE: we've added a makefile to help with orchestrating.

To install dependencies:

```bash
make install

touch .env.local # your local env file
```

## Add local config

```bash

# ================================
#  Client: Squire app
# ================================
VITE_DB_FILE_PATH="$PROJECT_ROOT/.db/squire.duckdb"
VITE_LOG_LEVEL="debug"
VITE_GH_TOKEN=<your-token>
VITE_GH_OWNER=<your-org>

# ================================
#  Pre-Ingest
# ================================
TOPICS_TO_INGEST=comma,delimited,list,to,ingest

```

## Pre ingestion 
New pre-ingest app has been re-written to be idempotent and use the same env variables as the app. Ensure you add the env var `TOPICS_TO_INGEST` to the config file, which is a comma delimited list.

```bash
make dev-ingest
```

## Run app
run the client locally

```bash
make dev-app
```

Access the webpage on http://localhost:5173/


## Reset state
Common issue is to have a segmentation fault with the duck async library. It requires a full clean, you need to run the following command to reset the app to a clean slate

```bash
make reset-state
```

After you can run the pre-ingest command `make dev-ingest` to hydrate all the data.