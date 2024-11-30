-- name: CreateUser :exec
INSERT INTO users (firstname, lastname, email, password, organization, field_of_study, job_title)
VALUES ($1, $2, $3, $4, $5, $6, $7);

-- name: GetUserByEmail :one
SELECT id, firstname, lastname, email, password, organization, field_of_study, job_title, temp_code
FROM users
WHERE email = $1;

-- name: GetUserAndSocialLinksByEmail :one
SELECT u.id, u.firstname, u.lastname, u.email, u.organization, u.field_of_study, u.job_title, array_agg(usl.social_link) AS social_links
FROM users u
LEFT JOIN user_social_links usl ON u.email = usl.user_email
WHERE u.email = $1
GROUP BY u.id;

-- name: InsertUserSocialLink :exec
INSERT INTO user_social_links(user_email, social_link)
VALUES ($1, $2);

-- name: UpdateUserCodeByEmail :exec
UPDATE users
SET temp_code = $1
WHERE email = $2;

-- name: GetUserEmailByCode :exec
SELECT email
FROM users
WHERE temp_code = $1;

-- name: UpdateUserPasswordByEmail :exec
UPDATE users
SET password = $1
WHERE email = $2;

-- name: RemoveCodeByEmail :exec
UPDATE users
SET temp_code = NULL
WHERE email = $1;

-- name: CheckUserExistsByEmail :one
SELECT 1
FROM users
WHERE email = $1;

-- name: UpdateUserExcludingPassword :exec
UPDATE users
SET organization = $1, field_of_study = $2, job_title = $3
WHERE email = $4;

-- name: UpdateUser :exec
UPDATE users
SET password = $1, organization = $2, field_of_study = $3, job_title = $4
WHERE email = $5;

-- name: DeleteSocialLinks :exec
DELETE FROM user_social_links
WHERE user_email = $1;
