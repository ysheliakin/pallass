-- name: InsertThread :one
INSERT INTO threads (firstname, lastname, title, content, category, upvotes, created_at)
VALUES ($1, $2, $3, $4, $5, 0, CURRENT_TIMESTAMP)
RETURNING id;

-- name: GetThreadByID :one
SELECT id, firstname, lastname, title, content, category, upvotes, created_at
FROM threads
WHERE id = $1;



