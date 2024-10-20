package main

import (
	"context"
	"os"

	controller "sih/pallass/controller"
	queries "sih/pallass/generated"

	"github.com/jackc/pgx/v5"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

// TODO: Define the Comment struct
type Comment struct {
	Content string `json:"content"`
	UserID  int    `json:"user_id"`
}

var e *echo.Echo
var dbc context.Context
var sql *queries.Queries

func main() {
	// Echo instance
	e = echo.New()
	e.Logger.SetLevel(log.INFO)

	// Postgres connection
	dbc = context.Background()
	conn, err := pgx.Connect(dbc, os.Getenv("DB"))
	if err != nil {
		e.Logger.Fatal(err)
		return
	}
	defer conn.Close(dbc)
	sql = queries.New(conn)

	controller.SetGlobalContext(e, sql, dbc)

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	// e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
	// 	AllowOrigins: []string{"http://localhost:5137", "https://ysheliakin.github.io/pallass"},
	// }))
	e.Use(middleware.CORS()) // TODO: might want to make this stricter

	e.GET("/", controller.HelloController)

	e.GET("/threads/:id", controller.GetThreadController)
	e.POST("/postThread", controller.ThreadController)
	e.GET("/threads/:id/comments", controller.GetCommentController)
	e.POST("/comment", controller.CommentController)
	e.POST("/newgroup", controller.CreateGroup)

	e.GET("/group/:id", controller.GetGroupController)

	e.DELETE("/deleteThread", controller.DeleteThreadController)

	e.PUT("/comment", controller.UpdateCommentController)
	e.DELETE("/comment", controller.DeleteCommentController)

	e.POST("/flag", controller.FlagController)
	e.POST("/upvote", controller.UpvoteController)
	e.POST("/downvote", controller.DownvoteController)

	e.GET("/playlist", controller.PlaylistController)

	e.GET("/user", controller.GetUserController)
	e.POST("/user", controller.UserController)
	e.PUT("/user", controller.UpdateUserController)

	e.GET("/funding", controller.GetFundingOpportunities)
	e.POST("/funding", controller.AddFundingOpportunity)

	// Start server
	e.Logger.Fatal(e.Start(":5000"))
}

// func addComment(c echo.Context) error {
// 	postID := c.Param("id") // Change the route to expect post ID
// 	var comment Comment
// 	if err := c.Bind(&comment); err != nil {
// 		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid input"})
// 	}

// 	// Insert comment into database
// 	_, err := sql.CreateComment(context.Background(), comment.Content, postID, comment.UserID) // Use your query function
// 	if err != nil {
// 		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "could not add comment"})
// 	}

// 	// Notify users (for simplicity, notify all users)
// 	_, err = sql.CreateNotification(context.Background(), comment.UserID, comment.Content+" was added to a post!", postID) // Use your query function
// 	if err != nil {
// 		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "could not send notifications"})
// 	}

// 	return c.JSON(http.StatusCreated, comment)
// }

// func getNotifications(c echo.Context) error {
// 	userID := c.Param("user_id")
// 	rows, err := db.Query(context.Background(), "SELECT message, post_id FROM notifications WHERE user_id = $1", userID)
// 	if err != nil {
// 		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "could not fetch notifications"})
// 	}
// 	defer rows.Close()

// 	var notifications []Notification
// 	for rows.Next() {
// 		var notification Notification
// 		if err := rows.Scan(&notification.Message, &notification.PostID); err != nil {
// 			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "could not scan notification"})
// 		}
// 		notifications = append(notifications, notification)
// 	}

// 	return c.JSON(http.StatusOK, notifications)
// }
