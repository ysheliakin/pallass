-- name: InsertThread :one
INSERT INTO threads (firstname, lastname, title, content, category, upvotes, created_at)
VALUES ($1, $2, $3, $4, $5, 0, CURRENT_TIMESTAMP)
RETURNING id, uuid;

-- name: GetThreads :many
SELECT id, firstname, lastname, title, content, category, upvotes, uuid, created_at
FROM threads
ORDER BY created_at DESC;

-- name: GetThreadAndMessagesByThreadIDAndFullnameByUserEmail :many
SELECT 
    threads.id AS thread_id, 
    threads.firstname AS thread_firstname,
    threads.lastname AS thread_lastname, 
    threads.title AS thread_title, 
    threads.content AS thread_content, 
    threads.category AS thread_category,
    threads.upvotes AS thread_upvotes,
    threads.uuid AS thread_uuid,
    threads.created_at AS thread_created_at,
    messages.firstname AS message_firstname,
    messages.lastname AS message_lastname,
    messages.thread_id AS message_thread_id,
    messages.content AS message_content,
    messages.created_at AS message_created_at,
    (SELECT firstname || ' ' || lastname FROM users WHERE users.email = $2) AS user_fullname
FROM 
    threads
LEFT JOIN 
    messages ON threads.id = messages.thread_id
WHERE 
    threads.id = $1
ORDER BY 
    messages.created_at ASC;