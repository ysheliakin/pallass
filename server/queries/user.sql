-- name: CreateUser :exec
INSERT INTO users (firstname, lastname, email, password, organization, fieldOfStudy, jobTitle)
VALUES ($1, $2, $3, $4, $5, $6, $7);

-- name: GetUserByEmail :one
SELECT id, firstname, lastname, email, password, organization, fieldOfStudy, jobTitle
FROM users
WHERE email = $1;
