-- name: StoreThreadMessage :one
INSERT INTO messages (firstname, lastname, thread_id, content)
VALUES ($1, $2, $3, $4)
RETURNING id, created_at;

-- name: EditThreadMessageByID :exec
UPDATE messages
SET content = $1
WHERE id = $2;

-- name: DeleteThreadMessageByID :exec
DELETE FROM messages 
WHERE id = $1;