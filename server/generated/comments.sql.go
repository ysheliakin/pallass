// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: comments.sql

package queries

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const getCommentsByThreadID = `-- name: GetCommentsByThreadID :many
SELECT id, firstname, lastname, content, created_at
FROM comments
WHERE thread_id = $1
ORDER BY created_at ASC
`

type GetCommentsByThreadIDRow struct {
	ID        int32
	Firstname string
	Lastname  string
	Content   string
	CreatedAt pgtype.Timestamp
}

func (q *Queries) GetCommentsByThreadID(ctx context.Context, threadID int32) ([]GetCommentsByThreadIDRow, error) {
	rows, err := q.db.Query(ctx, getCommentsByThreadID, threadID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetCommentsByThreadIDRow
	for rows.Next() {
		var i GetCommentsByThreadIDRow
		if err := rows.Scan(
			&i.ID,
			&i.Firstname,
			&i.Lastname,
			&i.Content,
			&i.CreatedAt,
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

const insertComment = `-- name: InsertComment :exec
INSERT INTO comments (firstname, lastname, thread_id, content)
VALUES ($1, $2, $3, $4)
`

type InsertCommentParams struct {
	Firstname string
	Lastname  string
	ThreadID  int32
	Content   string
}

func (q *Queries) InsertComment(ctx context.Context, arg InsertCommentParams) error {
	_, err := q.db.Exec(ctx, insertComment,
		arg.Firstname,
		arg.Lastname,
		arg.ThreadID,
		arg.Content,
	)
	return err
}
