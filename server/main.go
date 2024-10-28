package main

import (
	"context"
	"net/http"
	"os"

	controller "sih/pallass/controller"
	queries "sih/pallass/generated"

	"fmt"
	"github.com/gorilla/websocket"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
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
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func init() {
	// Load the environment variables from .env file in dev
	// (in prod they are set in AWS)
	if os.Getenv("env") == "prod" {
		err := godotenv.Load()
		if err != nil {
			e.Logger.Fatal(err)
		}
	}
}

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

	// Public routes
	e.GET("/", controller.HelloController)
	e.POST("/request-reset", controller.RequestPasswordReset)
	e.GET("/threads/:id", controller.GetThreadController)
	e.GET("/threads/:id/comments", controller.GetCommentController)
	e.POST("/registeruser", controller.RegisterUser)
	e.POST("/loginuser", controller.LoginUser)
	e.GET("/funding", controller.GetFundingOpportunities)

	// routes registered after this will require authentication
	authGroup := e.Group("")
	authGroup.Use(middleware.Logger())
	authGroup.Use(middleware.Recover())
	authGroup.Use(middleware.CORS()) // TODO: might want to make this stricter
	authGroup.Use(controller.Authenticate)

	// Private routes requiring bearer token
	authGroup.POST("/postThread", controller.ThreadController)
	authGroup.POST("/comment", controller.CommentController)
	authGroup.POST("/newgroup", controller.CreateGroup)

	authGroup.GET("/group/:id", controller.GetGroupController)

	authGroup.DELETE("/deleteThread", controller.DeleteThreadController)

	authGroup.PUT("/comment", controller.UpdateCommentController)
	authGroup.DELETE("/comment", controller.DeleteCommentController)

	authGroup.POST("/flag", controller.FlagController)
	authGroup.POST("/upvote", controller.UpvoteController)
	authGroup.POST("/downvote", controller.DownvoteController)

	authGroup.GET("/playlist", controller.PlaylistController)

	// Get Handlers
	authGroup.GET("/playlist", func(c echo.Context) error {
		return c.String(http.StatusOK, "Here is the playlist")
	})
	authGroup.GET("/ws/:email", webSocket)
	authGroup.GET("/user", controller.GetUser)

	// Post Handlers
	authGroup.POST("/post", func(c echo.Context) error {
		return c.String(http.StatusOK, "Post created")
	})
	authGroup.POST("/reset-password", controller.ResetPassword)
	authGroup.POST("/validate-code", controller.ValidateResetCode)
	authGroup.POST("/comment", func(c echo.Context) error {
		return c.String(http.StatusOK, "Comment created")
	})
	authGroup.POST("/flag", func(c echo.Context) error {
		return c.String(http.StatusOK, "Flag added")
	})
	authGroup.POST("/upvote", func(c echo.Context) error {
		return c.String(http.StatusOK, "Upvoted")
	})
	authGroup.POST("/downvote", func(c echo.Context) error {
		return c.String(http.StatusOK, "Downvoted")
	})
	authGroup.POST("/user", controller.UserController)
	authGroup.POST("/funding", controller.AddFundingOpportunity)

	// Put Handlers
	authGroup.PUT("/user", func(c echo.Context) error {
		return c.String(http.StatusOK, "User updated")
	})
	authGroup.PUT("/post", func(c echo.Context) error {
		return c.String(http.StatusOK, "Post updated")
	})
	authGroup.PUT("/comment", func(c echo.Context) error {
		return c.String(http.StatusOK, "Comment updated")
	})
	authGroup.PUT("/user", controller.UpdateUserController)

	// Delete Handlers
	authGroup.DELETE("/post", func(c echo.Context) error {
		return c.String(http.StatusOK, "Post deleted")
	})
	authGroup.DELETE("/comment", func(c echo.Context) error {
		return c.String(http.StatusOK, "Comment deleted")
	})

	// Start server
	e.Logger.Fatal(e.Start(":5000"))
}

func webSocket(c echo.Context) error {
	fmt.Println("WebSocket")

	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	defer conn.Close()

	return nil
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
