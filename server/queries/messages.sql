-- name: StoreThreadMessage :one
INSERT INTO messages (firstname, lastname, thread_id, content, message_id, reply)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, created_at;

-- name: EditThreadMessageByID :exec
UPDATE messages
SET content = $1
WHERE id = $2;

-- name: DeleteThreadMessageByID :exec
DELETE FROM messages 
WHERE id = $1;

-- name: SelectReplyingMessageByID :many
SELECT id, firstname, lastname, content, created_at
FROM messages
WHERE id = $1;