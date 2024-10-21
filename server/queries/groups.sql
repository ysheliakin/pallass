-- name: InsertGroup :one
INSERT INTO groups (name, description, created_at, created_by)
VALUES ($1, $2, CURRENT_TIMESTAMP, $3)
RETURNING id;

-- name: InsertGroupMember :exec
INSERT INTO group_members (group_id, user_id, role, joined_at)
VALUES ($1, $2, $3, CURRENT_TIMESTAMP);

-- name: GetGroupByID :one
SELECT id, name, description, created_by, created_at
FROM groups
WHERE id = $1;

-- -- name: GetGroupMembersByGroupID :many
-- SELECT gm.id, gm.group_id, gm.user_id, gm.role, gm.joined_at, u.firstname, u.lastname
-- FROM group_members gm
-- JOIN users u ON gm.user_id = u.id
-- WHERE gm.group_id = $1;

-- -- name: CheckIfUserInGroup :one
-- SELECT COUNT(*) 
-- FROM group_members
-- WHERE group_id = $1 AND user_id = $2;


