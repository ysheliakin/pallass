-- name: AddFundingOpportunity :one
insert into funding_opportunities(title, description, target_amount, link, deadline_date)
values($1, $2, $3, $4, $5)
returning *;

-- name: GetAllFundingOpportunities :many
select *
from funding_opportunities;

-- name: GetFundingOpportunitiesSortedByHighestAmountWithinDeadlineAndAmountRanges :many
SELECT *
FROM funding_opportunities
WHERE deadline_date BETWEEN $1 AND $2 AND target_amount BETWEEN $3 AND $4
ORDER BY target_amount DESC;

-- name: GetFundingOpportunitiesSortedByLowestAmountWithinDeadlineAndAmountRanges :many
SELECT *
FROM funding_opportunities
WHERE deadline_date BETWEEN $1 AND $2 AND target_amount BETWEEN $3 AND $4
ORDER BY target_amount ASC;

-- name: GetFundingOpportunitiesByNameSortedByHighestAmountWithinDeadlineAndAmountRanges :many
SELECT *
FROM funding_opportunities
WHERE funding_opportunities.title ILIKE $1 AND deadline_date BETWEEN $2 AND $3 AND target_amount BETWEEN $4 AND $5
ORDER BY target_amount DESC;

-- name: GetFundingOpportunitiesByNameSortedByLowestAmountWithinDeadlineAndAmountRanges :many
SELECT *
FROM funding_opportunities
WHERE funding_opportunities.title ILIKE $1 AND deadline_date BETWEEN $2 AND $3 AND target_amount BETWEEN $4 AND $5
ORDER BY target_amount ASC;
