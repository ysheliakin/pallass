// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: threads.sql

package queries

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const getThreadAndMessagesByThreadIDAndFullnameByUserEmail = `-- name: GetThreadAndMessagesByThreadIDAndFullnameByUserEmail :many
SELECT 
    threads.id AS thread_id, 
    threads.title AS thread_title, 
    threads.content AS thread_content, 
    threads.category AS thread_category,
    threads.uuid AS thread_uuid,
    threads.created_at AS thread_created_at,
    threads.user_email AS thread_user_email,
    -- Messages in the thread
    messages.id AS message_id,
    messages.firstname AS message_firstname,
    messages.lastname AS message_lastname,
    messages.thread_id AS message_thread_id,
    messages.content AS message_content,
    messages.created_at AS message_created_at,
    (SELECT firstname || ' ' || lastname FROM users WHERE users.email = $2) AS user_fullname,
    -- Messages being replied to
    replying_message.id AS reply_id,
    replying_message.firstname AS reply_firstname,
    replying_message.lastname AS reply_lastname,
    replying_message.content AS reply_content,
    replying_message.created_at AS reply_created_at,
    -- Count of the thread's upvotes
    COUNT(thread_upvotes.id) AS upvote_count,
    array_agg(thread_upvotes.user_email) AS upvote_emails
FROM 
    threads
LEFT JOIN 
    messages ON threads.id = messages.thread_id
LEFT JOIN
    messages AS replying_message ON messages.message_id = replying_message.id
LEFT JOIN
    thread_upvotes ON threads.id = thread_upvotes.thread_id
WHERE 
    threads.id = $1
GROUP BY 
    threads.id, messages.id, replying_message.id
ORDER BY 
    messages.created_at ASC
`

type GetThreadAndMessagesByThreadIDAndFullnameByUserEmailParams struct {
	ID    int32
	Email string
}

type GetThreadAndMessagesByThreadIDAndFullnameByUserEmailRow struct {
	ThreadID         int32
	ThreadTitle      string
	ThreadContent    string
	ThreadCategory   string
	ThreadUuid       pgtype.UUID
	ThreadCreatedAt  pgtype.Timestamp
	ThreadUserEmail  pgtype.Text
	MessageID        pgtype.Int4
	MessageFirstname pgtype.Text
	MessageLastname  pgtype.Text
	MessageThreadID  pgtype.Int4
	MessageContent   pgtype.Text
	MessageCreatedAt pgtype.Timestamp
	UserFullname     interface{}
	ReplyID          pgtype.Int4
	ReplyFirstname   pgtype.Text
	ReplyLastname    pgtype.Text
	ReplyContent     pgtype.Text
	ReplyCreatedAt   pgtype.Timestamp
	UpvoteCount      int64
	UpvoteEmails     interface{}
}

func (q *Queries) GetThreadAndMessagesByThreadIDAndFullnameByUserEmail(ctx context.Context, arg GetThreadAndMessagesByThreadIDAndFullnameByUserEmailParams) ([]GetThreadAndMessagesByThreadIDAndFullnameByUserEmailRow, error) {
	rows, err := q.db.Query(ctx, getThreadAndMessagesByThreadIDAndFullnameByUserEmail, arg.ID, arg.Email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetThreadAndMessagesByThreadIDAndFullnameByUserEmailRow
	for rows.Next() {
		var i GetThreadAndMessagesByThreadIDAndFullnameByUserEmailRow
		if err := rows.Scan(
			&i.ThreadID,
			&i.ThreadTitle,
			&i.ThreadContent,
			&i.ThreadCategory,
			&i.ThreadUuid,
			&i.ThreadCreatedAt,
			&i.ThreadUserEmail,
			&i.MessageID,
			&i.MessageFirstname,
			&i.MessageLastname,
			&i.MessageThreadID,
			&i.MessageContent,
			&i.MessageCreatedAt,
			&i.UserFullname,
			&i.ReplyID,
			&i.ReplyFirstname,
			&i.ReplyLastname,
			&i.ReplyContent,
			&i.ReplyCreatedAt,
			&i.UpvoteCount,
			&i.UpvoteEmails,
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

const getThreadUpvotesCount = `-- name: GetThreadUpvotesCount :one
SELECT COUNT(*)
FROM thread_upvotes
WHERE thread_id = $1
`

func (q *Queries) GetThreadUpvotesCount(ctx context.Context, threadID int32) (int64, error) {
	row := q.db.QueryRow(ctx, getThreadUpvotesCount, threadID)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const getThreadsByCategory = `-- name: GetThreadsByCategory :many
SELECT id, title, content, category, created_at, uuid, user_email 
FROM threads
WHERE category = $1
ORDER BY created_at DESC
`

func (q *Queries) GetThreadsByCategory(ctx context.Context, category string) ([]Thread, error) {
	rows, err := q.db.Query(ctx, getThreadsByCategory, category)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Thread
	for rows.Next() {
		var i Thread
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Content,
			&i.Category,
			&i.CreatedAt,
			&i.Uuid,
			&i.UserEmail,
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

const getThreadsByCategorySortedByLeastUpvotes = `-- name: GetThreadsByCategorySortedByLeastUpvotes :many
SELECT
    threads.id, threads.title, threads.content, threads.category, threads.created_at, threads.uuid, threads.user_email,
    COUNT(thread_upvotes.id) AS upvote_count
FROM 
    threads
LEFT JOIN
    thread_upvotes ON threads.id = thread_upvotes.thread_id
WHERE 
    threads.category = $1
GROUP BY
    threads.id
ORDER BY 
    upvote_count ASC
`

type GetThreadsByCategorySortedByLeastUpvotesRow struct {
	ID          int32
	Title       string
	Content     string
	Category    string
	CreatedAt   pgtype.Timestamp
	Uuid        pgtype.UUID
	UserEmail   pgtype.Text
	UpvoteCount int64
}

func (q *Queries) GetThreadsByCategorySortedByLeastUpvotes(ctx context.Context, category string) ([]GetThreadsByCategorySortedByLeastUpvotesRow, error) {
	rows, err := q.db.Query(ctx, getThreadsByCategorySortedByLeastUpvotes, category)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetThreadsByCategorySortedByLeastUpvotesRow
	for rows.Next() {
		var i GetThreadsByCategorySortedByLeastUpvotesRow
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Content,
			&i.Category,
			&i.CreatedAt,
			&i.Uuid,
			&i.UserEmail,
			&i.UpvoteCount,
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

const getThreadsByCategorySortedByMostUpvotes = `-- name: GetThreadsByCategorySortedByMostUpvotes :many
SELECT
    threads.id, threads.title, threads.content, threads.category, threads.created_at, threads.uuid, threads.user_email,
    COUNT(thread_upvotes.id) AS upvote_count 
FROM 
    threads
LEFT JOIN
    thread_upvotes ON threads.id = thread_upvotes.thread_id 
WHERE 
    threads.category = $1
GROUP BY
    threads.id
ORDER BY 
    upvote_count DESC
`

type GetThreadsByCategorySortedByMostUpvotesRow struct {
	ID          int32
	Title       string
	Content     string
	Category    string
	CreatedAt   pgtype.Timestamp
	Uuid        pgtype.UUID
	UserEmail   pgtype.Text
	UpvoteCount int64
}

func (q *Queries) GetThreadsByCategorySortedByMostUpvotes(ctx context.Context, category string) ([]GetThreadsByCategorySortedByMostUpvotesRow, error) {
	rows, err := q.db.Query(ctx, getThreadsByCategorySortedByMostUpvotes, category)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetThreadsByCategorySortedByMostUpvotesRow
	for rows.Next() {
		var i GetThreadsByCategorySortedByMostUpvotesRow
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Content,
			&i.Category,
			&i.CreatedAt,
			&i.Uuid,
			&i.UserEmail,
			&i.UpvoteCount,
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

const getThreadsByNameSortedByLeastUpvotes = `-- name: GetThreadsByNameSortedByLeastUpvotes :many
SELECT
    threads.id, threads.title, threads.content, threads.category, threads.created_at, threads.uuid, threads.user_email,
    COUNT(thread_upvotes.id) AS upvote_count 
FROM 
    threads
LEFT JOIN
    thread_upvotes ON threads.id = thread_upvotes.thread_id 
WHERE 
    threads.title ILIKE $1
GROUP BY
    threads.id
ORDER BY 
    upvote_count ASC
`

type GetThreadsByNameSortedByLeastUpvotesRow struct {
	ID          int32
	Title       string
	Content     string
	Category    string
	CreatedAt   pgtype.Timestamp
	Uuid        pgtype.UUID
	UserEmail   pgtype.Text
	UpvoteCount int64
}

func (q *Queries) GetThreadsByNameSortedByLeastUpvotes(ctx context.Context, title string) ([]GetThreadsByNameSortedByLeastUpvotesRow, error) {
	rows, err := q.db.Query(ctx, getThreadsByNameSortedByLeastUpvotes, title)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetThreadsByNameSortedByLeastUpvotesRow
	for rows.Next() {
		var i GetThreadsByNameSortedByLeastUpvotesRow
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Content,
			&i.Category,
			&i.CreatedAt,
			&i.Uuid,
			&i.UserEmail,
			&i.UpvoteCount,
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

const getThreadsByNameSortedByMostUpvotes = `-- name: GetThreadsByNameSortedByMostUpvotes :many
SELECT
    threads.id, threads.title, threads.content, threads.category, threads.created_at, threads.uuid, threads.user_email,
    COUNT(thread_upvotes.id) AS upvote_count 
FROM 
    threads
LEFT JOIN
    thread_upvotes ON threads.id = thread_upvotes.thread_id 
WHERE 
    threads.title ILIKE $1
GROUP BY
    threads.id
ORDER BY 
    upvote_count DESC
`

type GetThreadsByNameSortedByMostUpvotesRow struct {
	ID          int32
	Title       string
	Content     string
	Category    string
	CreatedAt   pgtype.Timestamp
	Uuid        pgtype.UUID
	UserEmail   pgtype.Text
	UpvoteCount int64
}

func (q *Queries) GetThreadsByNameSortedByMostUpvotes(ctx context.Context, title string) ([]GetThreadsByNameSortedByMostUpvotesRow, error) {
	rows, err := q.db.Query(ctx, getThreadsByNameSortedByMostUpvotes, title)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetThreadsByNameSortedByMostUpvotesRow
	for rows.Next() {
		var i GetThreadsByNameSortedByMostUpvotesRow
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Content,
			&i.Category,
			&i.CreatedAt,
			&i.Uuid,
			&i.UserEmail,
			&i.UpvoteCount,
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

const getThreadsSortedByLeastUpvotes = `-- name: GetThreadsSortedByLeastUpvotes :many
SELECT
    threads.id, threads.title, threads.content, threads.category, threads.created_at, threads.uuid, threads.user_email,
    COUNT(thread_upvotes.id) AS upvote_count
FROM 
    threads
LEFT JOIN
    thread_upvotes ON threads.id = thread_upvotes.thread_id
GROUP BY
    threads.id
ORDER BY 
    upvote_count ASC
`

type GetThreadsSortedByLeastUpvotesRow struct {
	ID          int32
	Title       string
	Content     string
	Category    string
	CreatedAt   pgtype.Timestamp
	Uuid        pgtype.UUID
	UserEmail   pgtype.Text
	UpvoteCount int64
}

func (q *Queries) GetThreadsSortedByLeastUpvotes(ctx context.Context) ([]GetThreadsSortedByLeastUpvotesRow, error) {
	rows, err := q.db.Query(ctx, getThreadsSortedByLeastUpvotes)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetThreadsSortedByLeastUpvotesRow
	for rows.Next() {
		var i GetThreadsSortedByLeastUpvotesRow
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Content,
			&i.Category,
			&i.CreatedAt,
			&i.Uuid,
			&i.UserEmail,
			&i.UpvoteCount,
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

const getThreadsSortedByMostUpvotes = `-- name: GetThreadsSortedByMostUpvotes :many
SELECT
    threads.id, threads.title, threads.content, threads.category, threads.created_at, threads.uuid, threads.user_email,
    COUNT(thread_upvotes.id) AS upvote_count
FROM 
    threads
LEFT JOIN
    thread_upvotes ON threads.id = thread_upvotes.thread_id
GROUP BY
    threads.id
ORDER BY 
    upvote_count DESC
`

type GetThreadsSortedByMostUpvotesRow struct {
	ID          int32
	Title       string
	Content     string
	Category    string
	CreatedAt   pgtype.Timestamp
	Uuid        pgtype.UUID
	UserEmail   pgtype.Text
	UpvoteCount int64
}

func (q *Queries) GetThreadsSortedByMostUpvotes(ctx context.Context) ([]GetThreadsSortedByMostUpvotesRow, error) {
	rows, err := q.db.Query(ctx, getThreadsSortedByMostUpvotes)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetThreadsSortedByMostUpvotesRow
	for rows.Next() {
		var i GetThreadsSortedByMostUpvotesRow
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Content,
			&i.Category,
			&i.CreatedAt,
			&i.Uuid,
			&i.UserEmail,
			&i.UpvoteCount,
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

const getUpvotedThreadsByUserEmail = `-- name: GetUpvotedThreadsByUserEmail :many
SELECT threads.id, title, content, category, threads.created_at, uuid, threads.user_email, thread_upvotes.id, thread_id, thread_upvotes.created_at, thread_upvotes.user_email
FROM threads
JOIN thread_upvotes ON threads.id = thread_upvotes.thread_id
WHERE thread_upvotes.user_email = $1
ORDER BY thread_upvotes.created_at DESC
`

type GetUpvotedThreadsByUserEmailRow struct {
	ID          int32
	Title       string
	Content     string
	Category    string
	CreatedAt   pgtype.Timestamp
	Uuid        pgtype.UUID
	UserEmail   pgtype.Text
	ID_2        int32
	ThreadID    int32
	CreatedAt_2 pgtype.Timestamp
	UserEmail_2 string
}

func (q *Queries) GetUpvotedThreadsByUserEmail(ctx context.Context, userEmail string) ([]GetUpvotedThreadsByUserEmailRow, error) {
	rows, err := q.db.Query(ctx, getUpvotedThreadsByUserEmail, userEmail)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetUpvotedThreadsByUserEmailRow
	for rows.Next() {
		var i GetUpvotedThreadsByUserEmailRow
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.Content,
			&i.Category,
			&i.CreatedAt,
			&i.Uuid,
			&i.UserEmail,
			&i.ID_2,
			&i.ThreadID,
			&i.CreatedAt_2,
			&i.UserEmail_2,
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

const insertThread = `-- name: InsertThread :one
INSERT INTO threads (title, content, category, user_email, created_at)
VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
RETURNING id, uuid
`

type InsertThreadParams struct {
	Title     string
	Content   string
	Category  string
	UserEmail pgtype.Text
}

type InsertThreadRow struct {
	ID   int32
	Uuid pgtype.UUID
}

func (q *Queries) InsertThread(ctx context.Context, arg InsertThreadParams) (InsertThreadRow, error) {
	row := q.db.QueryRow(ctx, insertThread,
		arg.Title,
		arg.Content,
		arg.Category,
		arg.UserEmail,
	)
	var i InsertThreadRow
	err := row.Scan(&i.ID, &i.Uuid)
	return i, err
}

const insertThreadUpvote = `-- name: InsertThreadUpvote :exec
INSERT INTO thread_upvotes (thread_id, user_email, created_at)
VALUES ($1, $2, CURRENT_TIMESTAMP)
`

type InsertThreadUpvoteParams struct {
	ThreadID  int32
	UserEmail string
}

func (q *Queries) InsertThreadUpvote(ctx context.Context, arg InsertThreadUpvoteParams) error {
	_, err := q.db.Exec(ctx, insertThreadUpvote, arg.ThreadID, arg.UserEmail)
	return err
}
