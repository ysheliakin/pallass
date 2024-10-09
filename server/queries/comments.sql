-- name: InsertComment :exec
INSERT INTO comments (firstname, lastname, thread_id, content)
VALUES ($1, $2, $3, $4);

-- name: GetCommentsByThreadID :many
SELECT id, firstname, lastname, content, created_at
FROM comments
WHERE thread_id = $1
ORDER BY created_at ASC; 
