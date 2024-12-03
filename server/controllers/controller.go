package controller

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v4"

	queries "sih/pallass/generated"
)

var e *echo.Echo
var dbc context.Context
var sql *queries.Queries

type Thread struct {
	Title     string `json:"title"`
	Content   string `json:"content"`
	Category  string `json:"category"`
	UserEmail string `json:"useremail"`
	Upvotes   int    `json:"upvotes"` // defaults to 0
}

type Message struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	ThreadID  int32  `json:"thread_id"`
	Content   string `json:"content"`
}

type RegisterResponse struct {
	Message string `json:"message"`
}

type ErrorPayload struct {
	Error string `json:"error"`
}

type ThreadMessage struct {
	ID             string `json:"id"`
	Firstname      string `json:"firstname"`
	Lastname       string `json:"lastname"`
	ThreadID       string `json:"threadid"`
	Content        string `json:"content"`
	ReplyMessageID string `json:"replymessageid"`
}

type GroupMessage struct {
	ID             string `json:"id"`
	Firstname      string `json:"firstname"`
	Lastname       string `json:"lastname"`
	GroupID        string `json:"groupid"`
	Content        string `json:"content"`
	ReplyMessageID string `json:"replymessageid"`
}

type GroupMember struct {
	GroupID   string `json:"groupid"`
	UserEmail string `json:"useremail"`
	Role      string `json:"role"`
}

type JoinGroupRequest struct {
	GroupID   string `json:"groupid"`
	UserEmail string `json:"useremail"`  
}

type User struct {
	ID           int32    `json:"id"`
	Firstname    string   `json:"firstName"`
	Lastname     string   `json:"lastName"`
	Email        string   `json:"email"`
	Password     string   `json:"password"`
	Organization string   `json:"organization"`
	Fieldofstudy string   `json:"fieldOfStudy"`
	Jobtitle     string   `json:"jobTitle"`
	SocialLinks  []string `json:"socialLinks"`
	TempCode     string   `json:"tempCode"`
	Token        string   `json:"token"`
}

type LogInUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Group struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Description   string `json:"description"`
	Privacy       bool   `json:"privacy"`
	Notifications bool   `json:"notifications"`
}

type FundingOpportunity struct {
	Title        string `json:"title"`
	Description  string `json:"description"`
	TargetAmount string `json:"target_amount"`
	Link         string `json:"link"`
	DeadlineDate string `json:"deadline_date"`
}

func SetGlobalContext(echoInstance *echo.Echo, queriesInstance *queries.Queries, dbContext context.Context) {
	e = echoInstance
	sql = queriesInstance
	dbc = dbContext
}

// FlagController handles flag-related actions
func FlagController(c echo.Context) error {
	return c.String(http.StatusOK, "Flag added")
}

// PlaylistController handles playlist retrieval
func PlaylistController(c echo.Context) error {
	return c.String(http.StatusOK, "Here is the playlist")
}

// UpdateMessageController handles message updates
func UpdateMessageController(c echo.Context) error {
	return c.String(http.StatusOK, "Message updated")
}

func GetFundingOpportunities(c echo.Context) error {
	results, err := sql.GetAllFundingOpportunities(dbc)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}
	return c.JSON(http.StatusOK, results)
}
