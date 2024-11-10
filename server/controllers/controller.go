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
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	Title     string `json:"title"`
	Content   string `json:"content"`
	Category  string `json:"category"`
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
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	ThreadID  string `json:"threadid"`
	Content   string `json:"content"`
}

type User struct {
    Firstname string `json:"firstname"`
    Lastname string `json:"lastname"`
    Email string `json:"email"`
    Password string `json:"password"`
    Organization string `json:"organization"`
    Fieldofstudy string `json:"fieldofstudy"`
    Jobtitle string `json:"jobtitle"`
	SocialLinks []string `json:"sociallinks"`
	TempCode string `json:"tempcode"`
}

type LogInUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Group struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	CreatedBy   int32  `json:"created_by"`
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

// DeleteMessageController handles message deletion
func DeleteMessageController(c echo.Context) error {
	return c.String(http.StatusOK, "Message deleted")
}

func AddFundingOpportunity(c echo.Context) error {
	payload := GetBody(c)
	if payload == nil {
		e.Logger.Error("body is nil")
		return c.JSON(http.StatusBadRequest, ErrorPayload{Error: "could not parse body"})
	}
	params := queries.AddFundingOpportunityParams{
		Title:        payload["title"].(string),
		Description:  payload["description"].(string),
		TargetAmount: Numeric(payload["target_amount"].(float64)),
		Link:         Text(payload["link"].(string)),
		DeadlineDate: Date(payload["deadline_date"].(string)),
	}
	result, err := sql.AddFundingOpportunity(dbc, params)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}
	return c.JSON(http.StatusCreated, result)
}

func GetFundingOpportunities(c echo.Context) error {
	results, err := sql.GetAllFundingOpportunities(dbc)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}
	return c.JSON(http.StatusOK, results)
}
