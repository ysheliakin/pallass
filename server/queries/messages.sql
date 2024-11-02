-- name: StoreThreadMessage :exec
INSERT INTO messages (firstname, lastname, thread_id, content)
VALUES ($1, $2, $3, $4);
