package controller

import (
	"context"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5/pgtype"
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

type Comment struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	ThreadID  int32  `json:"thread_id"` // Ensure this matches your JSON request
	Content   string `json:"content"`
}

func SetGlobalContext(echoInstance *echo.Echo, queriesInstance *queries.Queries, dbContext context.Context) {
	e = echoInstance
	sql = queriesInstance
	dbc = dbContext
}

type ErrorPayload struct {
	Error string `json:"error"`
}

// HelloController handles the root endpoint
func HelloController(c echo.Context) error {
	str := "Hello world: "
	sampleValues, err := sql.GetSample(dbc) // Sample query with code generated with sqlc
	if err != nil {
		e.Logger.Error(err)
		return c.String(http.StatusInternalServerError, "Error happened :(")
	}
	e.Logger.Infof("retrieved %d rows", len(sampleValues))
	for _, x := range sampleValues {
		str = str + strconv.FormatInt(int64(x.Int32), 10) + " "
	}
	return c.String(http.StatusOK, str)
}

// UserController handles user-related actions
func UserController(c echo.Context) error {
	return c.String(http.StatusOK, "User created")
}

// ThreadController handles thread-related actions
func ThreadController(c echo.Context) error {
	var thread Thread

	err := c.Bind(&thread)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid inputs")
	}

	//parameters for the database insertion
	var categoryParam pgtype.Text
	if thread.Category != "" {
		categoryParam = pgtype.Text{String: thread.Category, Valid: true}
	} else {
		categoryParam = pgtype.Text{Valid: false}
	}

	threadParams := queries.InsertThreadParams{
		Firstname: thread.Firstname,
		Lastname:  thread.Lastname,
		Title:     thread.Title,
		Content:   thread.Content,
		Category:  categoryParam.String,
	}

	err = sql.InsertThread(context.Background(), threadParams)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Error creating thread")
	}

	return c.JSON(http.StatusOK, "Thread created")
}

func CreateGroup(c echo.Context) error {
	return c.JSON(http.StatusOK, "Thread created")
}

// CommentController handles comment-related actions
func CommentController(c echo.Context) error {
	var comment Comment

	err := c.Bind(&comment)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid inputs")
	}

	commentParams := queries.InsertCommentParams{
		Firstname: comment.Firstname,
		Lastname:  comment.Lastname,
		ThreadID:  comment.ThreadID,
		Content:   comment.Content,
	}

	err = sql.InsertComment(context.Background(), commentParams)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Error creating comment")
	}

	return c.JSON(http.StatusOK, "Comment created")
}

// FlagController handles flag-related actions
func FlagController(c echo.Context) error {
	return c.String(http.StatusOK, "Flag added")
}

// UpvoteController handles upvote actions
func UpvoteController(c echo.Context) error {
	return c.String(http.StatusOK, "Upvoted")
}

// DownvoteController handles downvote actions
func DownvoteController(c echo.Context) error {
	return c.String(http.StatusOK, "Downvoted")
}

// PlaylistController handles playlist retrieval
func PlaylistController(c echo.Context) error {
	return c.String(http.StatusOK, "Here is the playlist")
}

func GetThreadController(c echo.Context) error {
	threadIDStr := c.Param("id")
	threadID, err := strconv.ParseInt(threadIDStr, 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid thread ID")
	}
	threadIDInt32 := int32(threadID)

	// Query the database
	thread, err := sql.GetThreadByID(context.Background(), threadIDInt32) // Pass as int32
	if err != nil {
		if err.Error() == "no rows in result set" {
			return c.JSON(http.StatusNotFound, "Thread not found")
		}
		return c.JSON(http.StatusInternalServerError, "Error retrieving thread")
	}
	return c.JSON(http.StatusOK, thread)
}

func GetCommentController(c echo.Context) error {
	threadID := c.Param("id")

	// Convert threadID to int (assuming it's an integer type)
	id, err := strconv.Atoi(threadID)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid thread ID")
	}

	comments, err := sql.GetCommentsByThreadID(context.Background(), int32(id)) // Pass as int32
	if err != nil {
		if err.Error() == "no rows in result set" {
			return c.JSON(http.StatusNotFound, "No comments found for this thread")
		}
		return c.JSON(http.StatusInternalServerError, "Error retrieving comments")
	}

	// Return the retrieved comments as a JSON response
	return c.JSON(http.StatusOK, comments)
}

func GetUserController(c echo.Context) error {
	return c.JSON(http.StatusOK, "Flag added")
}

// UpdateUserController handles user updates
func UpdateUserController(c echo.Context) error {
	return c.String(http.StatusOK, "User updated")
}

// UpdatePostController handles post updates
func GetGroupController(c echo.Context) error {
	return c.String(http.StatusOK, "Thread updated")
}

// UpdateCommentController handles comment updates
func UpdateCommentController(c echo.Context) error {
	return c.String(http.StatusOK, "Comment updated")
}

// DeletePostController handles post deletion
func DeleteThreadController(c echo.Context) error {
	return c.String(http.StatusOK, "Thread deleted")
}

// DeleteCommentController handles comment deletion
func DeleteCommentController(c echo.Context) error {
	return c.String(http.StatusOK, "Comment deleted")
}

func AddFundingOpportunity(c echo.Context) error {
	var params queries.AddFundingOpportunityParams 
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, ErrorPayload{Error: err.Error()})
	}
	result, err := sql.AddFundingOpportunity(dbc, params)
	if err != nil {
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
