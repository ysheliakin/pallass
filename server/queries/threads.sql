-- name: InsertThread :one
INSERT INTO threads (firstname, lastname, title, content, category, upvotes, created_at)
VALUES ($1, $2, $3, $4, $5, 0, CURRENT_TIMESTAMP)
RETURNING id, uuid;

-- name: GetThreadByID :one
SELECT id, firstname, lastname, title, content, category, upvotes, uuid, created_at
FROM threads
WHERE id = $1;

-- name: GetThreads :many
SELECT id, firstname, lastname, title, content, category, upvotes, uuid, created_at
FROM threads
ORDER BY created_at DESC;