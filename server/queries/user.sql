-- name: CreateUser :exec
INSERT INTO users (firstname, lastname, email, password, organization, fieldOfStudy, jobTitle)
VALUES ($1, $2, $3, $4, $5, $6, $7);

-- name: GetUserByEmail :one
SELECT id, firstname, lastname, email, password, organization, fieldOfStudy, jobTitle
FROM users
WHERE email = $1;

-- name: InsertUserSocialLink :exec
INSERT INTO user_social_links(user_email, social_link)
VALUES ($1, $2);