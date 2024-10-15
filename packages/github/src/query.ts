export function queryReposByTopic(
	owner: string,
	topic: string,
	first = 100,
): string {
	return `
{
  search(query: "owner:${owner} topic:${topic}", type: REPOSITORY, first: ${first}) {
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
          vulnerabilityAlerts(first: 100) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              state
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
