# squire
Your most trusted local assistant. Squire's aim is to provide a focused, product view of your github organisation.

| Feature | Description |
| ------- | ----------- |
| Group by product | Use github topics to group repositories by product |
| See open PRs | Dashboard allows you to see all open PRs for all products as well as drill down to open PRs by product |
| Sec vulnerability | See open security vulnerabilities for your product suite |  
| Insights | Get insights on PRs and security metrics for all products, or per product basis. |
| Basic reports | Download basic reports from your product's page in JSON format (other format's supporting coming soon) |

## Install 
To install dependencies:

```bash
bun install

touch .env.local # your local env file
```

## Add local config

```bash

# ================================
#  Client: Squire app
# ================================
VITE_DB_FILE_PATH=".db/squire.duckdb"
VITE_LOG_LEVEL="debug"
VITE_GH_TOKEN=<your-token>
VITE_GH_OWNER=<your-org>


```


## Pre ingestion (Deprecated + removed)
Was causing inconsistent behaviour with duckdb bindings do decided to remove from workflow. 

First run you will need to create your products from the form provided.


## Run app
run the client locally

```bash
bun run dev:app
```

Access the webpage on http://localhost:5173/