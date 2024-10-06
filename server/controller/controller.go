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

// Mock user data
var mockUsers = []struct {
	FirstName   string `json:"firstname"`
	LastName    string `json:"lastname"`
	Institution string `json:"institution"`
	Title       string `json:"title"`
	Field       string `json:"field"`
}{
	{
		FirstName:   "Alice",
		LastName:    "Johnson",
		Institution: "University A",
		Title:       "Professor",
		Field:       "Computer Science",
	},
	{
		FirstName:   "Bob",
		LastName:    "Smith",
		Institution: "Institute B",
		Title:       "Researcher",
		Field:       "Mathematics",
	},
	{
		FirstName:   "Charlie",
		LastName:    "Brown",
		Institution: "College C",
		Title:       "Lecturer",
		Field:       "Physics",
	},
}

// Mock data for threads
var mockThreads = []struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Content  string `json:"content"`
	Category string `json:"categoy"`
}{
	{ID: 1, Title: "First Thread", Content: "This is the first Thread.", Category: "Physics"},
	{ID: 2, Title: "Second Thread", Content: "This is the second Thread.", Category: "Biology"},
	{ID: 3, Title: "Third Thread", Content: "This is the Third Thread.", Category: "Chemistry"},
}

// Mock comments(probably pass in thread id when using)
var mockComments = []struct {
	ID        int    `json:"id"`
	ThreadID  int    `json:"thread_id"`
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Content   string `json:"content"`
}{
	{
		ID:        1,
		ThreadID:  1,
		FirstName: "Alice",
		LastName:  "Johnson",
		Content:   "Great post!",
	},
	{
		ID:        2,
		ThreadID:  1,
		FirstName: "Bob",
		LastName:  "Smith",
		Content:   "Thanks for sharing!",
	},
	{
		ID:        3,
		ThreadID:  1,
		FirstName: "Charlie",
		LastName:  "Brown",
		Content:   "Nice job!",
	},
}

func SetGlobalContext(echoInstance *echo.Echo, queriesInstance *queries.Queries, dbContext context.Context) {
	e = echoInstance
	sql = queriesInstance
	dbc = dbContext
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

	// Decode the incoming JSON request body
	err := c.Bind(&thread)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid inputs")
	}

	// Prepare parameters for the database insertion
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

func CreatePost(c echo.Context) error {
	return c.JSON(http.StatusOK, "Thread created")
}

// CommentController handles comment-related actions
func CommentController(c echo.Context) error {
	return c.String(http.StatusOK, "Comment created")
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
	return c.JSON(http.StatusOK, mockThreads)
}

func GetCommentController(c echo.Context) error {
	return c.JSON(http.StatusOK, mockComments)
}

func GetUserController(c echo.Context) error {
	return c.JSON(http.StatusOK, mockUsers)
}

// UpdateUserController handles user updates
func UpdateUserController(c echo.Context) error {
	return c.String(http.StatusOK, "User updated")
}

// UpdatePostController handles post updates
func UpdateThreadController(c echo.Context) error {
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
