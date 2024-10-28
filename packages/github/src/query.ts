export function queryReposAndActiveSecByTopic(
	owner: string,
	topic: string,
	first = 100,
): string {
	return queryReposWithSec(`owner:${owner} topic:${topic}`, first);
}

function queryReposWithSec(query: string, first = 100): string {
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
          pullRequests(last:100) {
            nodes {
              id
              state
              createdAt
              closedAt
              mergedAt
              permalink
            }
            totalCount
          }            
          vulnerabilityAlerts(
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
