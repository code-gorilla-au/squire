const queryGetLastNMergedPullRequests = `
SELECT pr.* FROM pull_requests pr
LEFT JOIN repositories r ON pr.repositoryName = r.name
LEFT JOIN products p ON r.topic IN p.tags
LEFT JOIN org_products op ON p.id = op.productId
WHERE state = 'MERGED'
AND pr.createdAt >= (now() - interval '90' day)
`;

export const queryGetPullRequestInsights = `
with merged_prs as (
    ${queryGetLastNMergedPullRequests}
)
SELECT 
    count() as totalMerged,
    avg(dateDiff('day', createdAt, mergedAt)) as daysToMerge,
    max(dateDiff('day', createdAt, mergedAt)) as maxDaysToMerge,
    min(dateDiff('day', createdAt, mergedAt)) as minDaysToMerge
FROM merged_prs
`;

const queryGetPullRequestInsightsByProductId = `
${queryGetLastNMergedPullRequests}
AND op.productId = $2
`;

export const queryGetOrgPullRequestInsightsByProduct = `
with merged_prs as (
    ${queryGetPullRequestInsightsByProductId}
)
SELECT 
    count() as totalMerged,
    avg(dateDiff('day', createdAt, mergedAt)) as daysToMerge,
    max(dateDiff('day', createdAt, mergedAt)) as maxDaysToMerge,
    min(dateDiff('day', createdAt, mergedAt)) as minDaysToMerge
FROM merged_prs
`;

const queryGetLastNSecurityAdvisory = `
SELECT sa.* FROM securities sa
LEFT JOIN repositories r ON sa.repositoryName = r.name
LEFT JOIN products p ON r.topic IN p.tags
LEFT JOIN org_products op ON p.id = op.productId
WHERE sa.createdAt >= (now() - interval '90' day)
`;

const queryGetSecurityAdvisoryByProductId = `
${queryGetLastNSecurityAdvisory}
AND op.productId = $2
`;

export const queryGetOrgSecurityAdvisoryInsights = `
with security_advisories_insights as (
    ${queryGetLastNSecurityAdvisory}
)
SELECT 
    count() as total,
    count_if(state != 'OPEN') as resolved,
    count_if(state = 'OPEN') as open,
    avg(dateDiff('day', createdAt, updatedAt)) FILTER(state != 'OPEN') as daysToMerge,
    max(dateDiff('day', createdAt, updatedAt)) FILTER(state != 'OPEN') as maxDaysToMerge,
    min(dateDiff('day', createdAt, updatedAt)) FILTER(state != 'OPEN') as minDaysToMerge  
FROM security_advisories_insights
`;

export const queryGetSecurityAdvisoryInsightsByProduct = `
with security_advisories_insights as (
    ${queryGetSecurityAdvisoryByProductId}
)
SELECT 
    count() as total,
    count_if(state != 'OPEN') as resolved,
    count_if(state = 'OPEN') as open,
    avg(dateDiff('day', createdAt, updatedAt)) FILTER(state != 'OPEN') as daysToMerge,
    max(dateDiff('day', createdAt, updatedAt)) FILTER(state != 'OPEN') as maxDaysToMerge,
    min(dateDiff('day', createdAt, updatedAt)) FILTER(state != 'OPEN') as minDaysToMerge  
FROM security_advisories_insights
`;
