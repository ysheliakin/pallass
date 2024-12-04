-- name: InsertPost :one
INSERT INTO posts (user_id, title, content)
VALUES ($1, $2, $3)
RETURNING id;

-- name: GetUserPosts :many
select *
from posts
where user_id = $1;

-- name: GetPost :one
select *
from posts
where id = $1;
