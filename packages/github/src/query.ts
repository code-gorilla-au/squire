import type { VulnerabilityAlertState } from "./types";

export function queryReposAndActiveSecByTopic(
	owner: string,
	topic: string,
	first = 100,
): string {
	return queryReposWithSec(`owner:${owner} topic:${topic}`, "OPEN", first);
}

function queryReposWithSec(
	query: string,
	securityStates: VulnerabilityAlertState[] | VulnerabilityAlertState = "OPEN",
	first = 100,
): string {
	return `
{
  search(query: "${query}", type: REPOSITORY, first: ${first}) {
    pageInfo {
      hasNextPage
      endCursor
    }
    repositoryCount
    edges {
      node {
        ... on Repository {
          name
          url
          owner {
            login
          }
          vulnerabilityAlerts(
            states: ${securityStates}
            last: 100
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              state
              id
              number
              createdAt
              securityVulnerability {
                package {
                  name
                }
                advisory {
                  severity
                }
                firstPatchedVersion {
                  identifier
                }
                updatedAt
              }
              dependabotUpdate {
                pullRequest {
                  number
                  title
                }
                error {
                  title
                  body
                  errorType
                }
              }
            }
          }
        }
      }
    }
  }
}  
  `;
}
