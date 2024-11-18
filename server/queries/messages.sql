-- name: StoreThreadMessage :one
INSERT INTO messages (firstname, lastname, thread_id, content, message_id, reply)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, created_at;

-- name: EditThreadMessageByID :exec
UPDATE messages
SET content = $1
WHERE id = $2;

-- name: DeleteThreadMessageAndRepliesByID :exec
WITH RECURSIVE deleted_replies AS (
  -- Base case -> get the direct replies
  SELECT id
  FROM messages
  WHERE message_id = $1
  
  -- Allow duplicate values that are in both the base and recursive cases
  UNION ALL
  
  -- Recursive case -> get the nested replies
  SELECT m.id
  FROM messages m
  INNER JOIN deleted_replies dr ON dr.id = m.message_id
)
DELETE FROM messages
WHERE messages.id IN (SELECT id FROM deleted_replies)
  OR messages.id = $1;

-- name: SelectReplyingMessageByID :many
SELECT id, firstname, lastname, content, created_at
FROM messages
WHERE id = $1;