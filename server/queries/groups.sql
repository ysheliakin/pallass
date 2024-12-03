-- name: InsertGroup :one
INSERT INTO groups (name, description, created_at, public)
VALUES ($1, $2, CURRENT_TIMESTAMP, $3)
RETURNING id, uuid;

-- name: InsertGroupWithGrant :one
INSERT INTO groups (name, description, created_at, public, funding_opportunity_id)
VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4)
RETURNING id, uuid;

-- name: InsertGroupMember :one
INSERT INTO group_members (group_id, user_email, role, joined_at)
VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
RETURNING group_id;

-- name: GetGroupByID :one
SELECT id, name, description, created_at
FROM groups
WHERE id = $1;

-- name: GetGroupsByUserEmail :many
SELECT * 
FROM groups
JOIN group_members ON groups.id = group_members.group_id
WHERE group_members.user_email = $1
ORDER BY group_members.joined_at DESC;

-- name: GetGroupAndGroupMessagesByGroupIDAndFullnameByUserEmail :many
SELECT 
    groups.id AS group_id, 
    groups.name AS group_name,
    groups.description AS group_description, 
    groups.public AS group_public,
    groups.uuid AS group_uuid,
    groups.created_at AS group_created_at,
    -- Messages in the group
    group_messages.id AS group_message_id,
    group_messages.firstname AS group_message_firstname,
    group_messages.lastname AS group_message_lastname,
    group_messages.group_id AS group_message_group_id,
    group_messages.content AS group_message_content,
    group_messages.created_at AS group_message_created_at,
    (SELECT firstname || ' ' || lastname FROM users WHERE users.email = $2) AS user_fullname,
    -- Messages being replied to
    group_replying_message.id AS group_reply_id,
    group_replying_message.firstname AS group_reply_firstname,
    group_replying_message.lastname AS group_reply_lastname,
    group_replying_message.content AS group_reply_content,
    group_replying_message.created_at AS group_reply_created_at,
    -- The grant associated with the group
    funding_opportunities.title AS funding_opportunity_title,
    -- Count of the group's members
    COUNT(group_members.id) AS member_count,
    -- Count of the group's join requests
    COUNT(join_group_requests.id) AS join_request_count,
    array_agg(group_members.user_email) AS member_emails,
    array_agg(group_members.role) AS member_roles
FROM 
    groups
LEFT JOIN 
    group_messages ON groups.id = group_messages.group_id
LEFT JOIN
    group_messages AS group_replying_message ON group_messages.group_message_id = group_replying_message.id
LEFT JOIN
    group_members ON groups.id = group_members.group_id
LEFT JOIN
    join_group_requests ON groups.id = join_group_requests.group_id
LEFT JOIN
    funding_opportunities ON groups.funding_opportunity_id = funding_opportunities.id
WHERE 
    groups.id = $1
GROUP BY 
    groups.id, group_messages.id, group_replying_message.id, funding_opportunities.id
ORDER BY 
    group_messages.created_at ASC;

-- name: GetGroupMembersByGroupID :many
SELECT gm.id, gm.group_id, gm.user_email, gm.role, gm.joined_at, u.firstname, u.lastname
FROM group_members gm
JOIN users u ON gm.user_email = u.email
WHERE gm.group_id = $1;

-- name: DeleteUserFromGroup :exec
DELETE FROM group_members
WHERE group_id = $1 AND user_email = $2;

-- name: SwitchGroupRoles :exec
UPDATE group_members
SET role = CASE 
        WHEN user_email = $1 THEN 'Member'
        WHEN user_email = $2 THEN 'Owner'
    END
WHERE user_email IN ($1, $2) AND group_id = $3;

-- name: DeleteGroup :exec
DELETE FROM groups
WHERE id = $1;

-- name: AddMemberToGroup :exec
INSERT INTO group_members (group_id, user_email, role, joined_at)
VALUES ($1, $2, $3, CURRENT_TIMESTAMP);

-- name: GetGroupsByNameSortedByMostRecent :many
SELECT 
    groups.*,
    array_agg(DISTINCT group_members.user_email) AS member_emails,
    array_agg(DISTINCT join_group_requests.user_email) AS join_request_emails
FROM 
    groups
LEFT JOIN
    group_members ON groups.id = group_members.group_id
LEFT JOIN
    join_group_requests ON groups.id = join_group_requests.group_id
WHERE 
    groups.name ILIKE $1
GROUP BY 
    groups.id
ORDER BY 
    groups.created_at DESC;

-- name: AddUserToJoinGroupRequests :exec
INSERT INTO join_group_requests (group_id, user_email, created_at)
VALUES ($1, $2, CURRENT_TIMESTAMP);

-- name: GetJoinGroupRequests :many
SELECT jgr.*, u.firstname, u.lastname
FROM join_group_requests jgr
JOIN users u ON jgr.user_email = u.email
WHERE jgr.group_id = $1;

-- name: RemoveJoinGroupRequest :exec
DELETE FROM join_group_requests
WHERE group_id = $1 AND user_email = $2;

-- name: GetGrants :many
SELECT id, title
FROM funding_opportunities;