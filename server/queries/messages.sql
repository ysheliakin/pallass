-- name: StoreInitialThreadMessage :exec
INSERT INTO messages (firstname, lastname, thread_id, content)
VALUES ('Thread', 'Bot', $1, 'Feel free to communicate with others!');

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


-- name: StoreInitialGroupMessage :exec
INSERT INTO group_messages (firstname, lastname, group_id, content)
VALUES ('Group', 'Bot', $1, 'Feel free to communicate with others!');

-- name: StoreGroupMessage :one
INSERT INTO group_messages (firstname, lastname, group_id, content, group_message_id, reply)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, created_at;

-- name: EditGroupMessageByID :exec
UPDATE group_messages
SET content = $1
WHERE id = $2;

-- name: DeleteGroupMessageAndRepliesByID :exec
WITH RECURSIVE deleted_replies AS (
  -- Base case -> get the direct replies
  SELECT id
  FROM group_messages
  WHERE group_message_id = $1
  
  -- Allow duplicate values that are in both the base and recursive cases
  UNION ALL
  
  -- Recursive case -> get the nested replies
  SELECT m.id
  FROM group_messages m
  INNER JOIN deleted_replies dr ON dr.id = m.group_message_id
)
DELETE FROM group_messages
WHERE group_messages.id IN (SELECT id FROM deleted_replies)
  OR group_messages.id = $1;

-- name: SelectGroupReplyingMessageByID :many
SELECT id, firstname, lastname, content, created_at
FROM group_messages
WHERE id = $1;