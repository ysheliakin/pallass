// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: groups.sql

package queries

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const deleteGroup = `-- name: DeleteGroup :exec
DELETE FROM groups
WHERE id = $1
`

func (q *Queries) DeleteGroup(ctx context.Context, id int32) error {
	_, err := q.db.Exec(ctx, deleteGroup, id)
	return err
}

const deleteUserFromGroup = `-- name: DeleteUserFromGroup :exec
DELETE FROM group_members
WHERE group_id = $1 AND user_email = $2
`

type DeleteUserFromGroupParams struct {
	GroupID   int32
	UserEmail pgtype.Text
}

func (q *Queries) DeleteUserFromGroup(ctx context.Context, arg DeleteUserFromGroupParams) error {
	_, err := q.db.Exec(ctx, deleteUserFromGroup, arg.GroupID, arg.UserEmail)
	return err
}

const getGroupAndGroupMessagesByGroupIDAndFullnameByUserEmail = `-- name: GetGroupAndGroupMessagesByGroupIDAndFullnameByUserEmail :many
SELECT 
    groups.id AS group_id, 
    groups.name AS group_name,
    groups.description AS group_description, 
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
    -- Count of the group's members
    COUNT(group_members.id) AS member_count,
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
WHERE 
    groups.id = $1
GROUP BY 
    groups.id, group_messages.id, group_replying_message.id
ORDER BY 
    group_messages.created_at ASC
`

type GetGroupAndGroupMessagesByGroupIDAndFullnameByUserEmailParams struct {
	ID    int32
	Email string
}

type GetGroupAndGroupMessagesByGroupIDAndFullnameByUserEmailRow struct {
	GroupID               int32
	GroupName             string
	GroupDescription      pgtype.Text
	GroupUuid             pgtype.UUID
	GroupCreatedAt        pgtype.Timestamp
	GroupMessageID        pgtype.Int4
	GroupMessageFirstname pgtype.Text
	GroupMessageLastname  pgtype.Text
	GroupMessageGroupID   pgtype.Int4
	GroupMessageContent   pgtype.Text
	GroupMessageCreatedAt pgtype.Timestamp
	UserFullname          interface{}
	GroupReplyID          pgtype.Int4
	GroupReplyFirstname   pgtype.Text
	GroupReplyLastname    pgtype.Text
	GroupReplyContent     pgtype.Text
	GroupReplyCreatedAt   pgtype.Timestamp
	MemberCount           int64
	MemberEmails          interface{}
	MemberRoles           interface{}
}

func (q *Queries) GetGroupAndGroupMessagesByGroupIDAndFullnameByUserEmail(ctx context.Context, arg GetGroupAndGroupMessagesByGroupIDAndFullnameByUserEmailParams) ([]GetGroupAndGroupMessagesByGroupIDAndFullnameByUserEmailRow, error) {
	rows, err := q.db.Query(ctx, getGroupAndGroupMessagesByGroupIDAndFullnameByUserEmail, arg.ID, arg.Email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetGroupAndGroupMessagesByGroupIDAndFullnameByUserEmailRow
	for rows.Next() {
		var i GetGroupAndGroupMessagesByGroupIDAndFullnameByUserEmailRow
		if err := rows.Scan(
			&i.GroupID,
			&i.GroupName,
			&i.GroupDescription,
			&i.GroupUuid,
			&i.GroupCreatedAt,
			&i.GroupMessageID,
			&i.GroupMessageFirstname,
			&i.GroupMessageLastname,
			&i.GroupMessageGroupID,
			&i.GroupMessageContent,
			&i.GroupMessageCreatedAt,
			&i.UserFullname,
			&i.GroupReplyID,
			&i.GroupReplyFirstname,
			&i.GroupReplyLastname,
			&i.GroupReplyContent,
			&i.GroupReplyCreatedAt,
			&i.MemberCount,
			&i.MemberEmails,
			&i.MemberRoles,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getGroupByID = `-- name: GetGroupByID :one
SELECT id, name, description, created_at
FROM groups
WHERE id = $1
`

type GetGroupByIDRow struct {
	ID          int32
	Name        string
	Description pgtype.Text
	CreatedAt   pgtype.Timestamp
}

func (q *Queries) GetGroupByID(ctx context.Context, id int32) (GetGroupByIDRow, error) {
	row := q.db.QueryRow(ctx, getGroupByID, id)
	var i GetGroupByIDRow
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.CreatedAt,
	)
	return i, err
}

const getGroupMembersByGroupID = `-- name: GetGroupMembersByGroupID :many
SELECT gm.id, gm.group_id, gm.user_email, gm.role, gm.joined_at, u.firstname, u.lastname
FROM group_members gm
JOIN users u ON gm.user_email = u.email
WHERE gm.group_id = $1
`

type GetGroupMembersByGroupIDRow struct {
	ID        int32
	GroupID   int32
	UserEmail pgtype.Text
	Role      string
	JoinedAt  pgtype.Timestamp
	Firstname string
	Lastname  string
}

func (q *Queries) GetGroupMembersByGroupID(ctx context.Context, groupID int32) ([]GetGroupMembersByGroupIDRow, error) {
	rows, err := q.db.Query(ctx, getGroupMembersByGroupID, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetGroupMembersByGroupIDRow
	for rows.Next() {
		var i GetGroupMembersByGroupIDRow
		if err := rows.Scan(
			&i.ID,
			&i.GroupID,
			&i.UserEmail,
			&i.Role,
			&i.JoinedAt,
			&i.Firstname,
			&i.Lastname,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const insertGroup = `-- name: InsertGroup :one
INSERT INTO groups (name, description, created_at, public, notifications)
VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4)
RETURNING id, uuid
`

type InsertGroupParams struct {
	Name          string
	Description   pgtype.Text
	Public        pgtype.Bool
	Notifications pgtype.Bool
}

type InsertGroupRow struct {
	ID   int32
	Uuid pgtype.UUID
}

func (q *Queries) InsertGroup(ctx context.Context, arg InsertGroupParams) (InsertGroupRow, error) {
	row := q.db.QueryRow(ctx, insertGroup,
		arg.Name,
		arg.Description,
		arg.Public,
		arg.Notifications,
	)
	var i InsertGroupRow
	err := row.Scan(&i.ID, &i.Uuid)
	return i, err
}

const insertGroupMember = `-- name: InsertGroupMember :one
INSERT INTO group_members (group_id, user_email, role, joined_at)
VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
RETURNING group_id
`

type InsertGroupMemberParams struct {
	GroupID   int32
	UserEmail pgtype.Text
	Role      string
}

func (q *Queries) InsertGroupMember(ctx context.Context, arg InsertGroupMemberParams) (int32, error) {
	row := q.db.QueryRow(ctx, insertGroupMember, arg.GroupID, arg.UserEmail, arg.Role)
	var group_id int32
	err := row.Scan(&group_id)
	return group_id, err
}

const switchGroupRoles = `-- name: SwitchGroupRoles :exec
UPDATE group_members
SET role = CASE 
        WHEN user_email = $1 THEN 'Member'
        WHEN user_email = $2 THEN 'Owner'
    END
WHERE user_email IN ($1, $2) AND group_id = $3
`

type SwitchGroupRolesParams struct {
	UserEmail   pgtype.Text
	UserEmail_2 pgtype.Text
	GroupID     int32
}

func (q *Queries) SwitchGroupRoles(ctx context.Context, arg SwitchGroupRolesParams) error {
	_, err := q.db.Exec(ctx, switchGroupRoles, arg.UserEmail, arg.UserEmail_2, arg.GroupID)
	return err
}
