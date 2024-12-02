// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package queries

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type FundingOpportunity struct {
	ID           int32
	Title        string
	Description  string
	TargetAmount pgtype.Numeric
	Link         pgtype.Text
	CreatedOn    pgtype.Timestamp
	DeadlineDate pgtype.Date
}

type Group struct {
	ID                   int32
	Name                 string
	Description          pgtype.Text
	CreatedAt            pgtype.Timestamp
	Uuid                 pgtype.UUID
	Public               pgtype.Bool
	FundingOpportunityID pgtype.Int4
}

type GroupMember struct {
	ID        int32
	GroupID   int32
	Role      string
	JoinedAt  pgtype.Timestamp
	UserEmail pgtype.Text
}

type GroupMessage struct {
	ID             int32
	Firstname      string
	Lastname       string
	Content        string
	GroupID        int32
	GroupMessageID pgtype.Int4
	Reply          pgtype.Bool
	CreatedAt      pgtype.Timestamp
}

type JoinGroupRequest struct {
	ID        int32
	GroupID   int32
	UserEmail string
	CreatedAt pgtype.Timestamp
}

type Message struct {
	ID        int32
	Firstname string
	Lastname  string
	ThreadID  int32
	Content   string
	CreatedAt pgtype.Timestamp
	MessageID pgtype.Int4
	Reply     pgtype.Bool
}

type SampleTable struct {
	ID pgtype.Int4
}

type Thread struct {
	ID                   int32
	Title                string
	Content              string
	Category             string
	CreatedAt            pgtype.Timestamp
	Uuid                 pgtype.UUID
	UserEmail            pgtype.Text
	FundingOpportunityID pgtype.Int4
}

type ThreadUpvote struct {
	ID        int32
	ThreadID  int32
	CreatedAt pgtype.Timestamp
	UserEmail string
}

type User struct {
	ID           int32
	Firstname    string
	Lastname     string
	Email        string
	Password     string
	Organization pgtype.Text
	FieldOfStudy string
	JobTitle     pgtype.Text
	CreatedAt    pgtype.Timestamp
	TempCode     pgtype.Text
}

type UserSocialLink struct {
	ID         int32
	UserEmail  string
	SocialLink string
	CreatedAt  pgtype.Timestamp
}
