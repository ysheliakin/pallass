-- name: AddFundingOpportunity :one
insert into funding_opportunities(title, description, target_amount, link, deadline_date)
values($1, $2, $3, $4, $5)
returning *;

-- name: GetAllFundingOpportunities :many
select *
from funding_opportunities;

-- name: GetFundingOpportunitiesSortedByHighestAmount :many
SELECT *
FROM funding_opportunities
WHERE deadline_date BETWEEN $1 AND $2
ORDER BY target_amount DESC;

-- name: GetFundingOpportunitiesSortedByLowestAmount :many
SELECT *
FROM funding_opportunities
WHERE deadline_date BETWEEN $1 AND $2
ORDER BY target_amount ASC;

-- name: GetFundingOpportunitiesByNameSortedByHighestAmount :many
SELECT *
FROM funding_opportunities
WHERE funding_opportunities.title ILIKE $1 AND deadline_date BETWEEN $2 AND $3
ORDER BY target_amount DESC;

-- name: GetFundingOpportunitiesByNameSortedByLowestAmount :many
SELECT *
FROM funding_opportunities
WHERE funding_opportunities.title ILIKE $1 AND deadline_date BETWEEN $2 AND $3
ORDER BY target_amount ASC;
