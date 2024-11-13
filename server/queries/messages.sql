-- name: StoreThreadMessage :one
INSERT INTO messages (firstname, lastname, thread_id, content)
VALUES ($1, $2, $3, $4)
RETURNING id, created_at;
