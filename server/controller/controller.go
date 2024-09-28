package controller

import (
	"context"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"

	queries "sih/pallass/generated"
)

var e *echo.Echo
var dbc context.Context
var sql *queries.Queries

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

// PostController handles post-related actions
func PostController(c echo.Context) error {
	return c.String(http.StatusOK, "Post created")
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

// UpdateUserController handles user updates
func UpdateUserController(c echo.Context) error {
	return c.String(http.StatusOK, "User updated")
}

// UpdatePostController handles post updates
func UpdatePostController(c echo.Context) error {
	return c.String(http.StatusOK, "Post updated")
}

// UpdateCommentController handles comment updates
func UpdateCommentController(c echo.Context) error {
	return c.String(http.StatusOK, "Comment updated")
}

// DeletePostController handles post deletion
func DeletePostController(c echo.Context) error {
	return c.String(http.StatusOK, "Post deleted")
}

// DeleteCommentController handles comment deletion
func DeleteCommentController(c echo.Context) error {
	return c.String(http.StatusOK, "Comment deleted")
}
