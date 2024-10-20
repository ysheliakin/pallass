-- name: AddFundingOpportunity :one
insert into funding_opportunities(title, description, target_amount, link, deadline_date)
values($1, $2, $3, $4, $5)
returning *;

-- name: GetAllFundingOpportunities :many
select *
from funding_opportunities;
