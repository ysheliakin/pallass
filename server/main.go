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

	e.GET("/thread", controller.GetThreadController)
	e.POST("/postThread", controller.ThreadController)
	e.POST("/post", controller.CreatePost)
	e.PUT("/updateThread", controller.UpdateThreadController)
	e.DELETE("/deleteThread", controller.DeleteThreadController)

	e.GET("/comment", controller.GetCommentController)
	e.POST("/comment", controller.CommentController)
	e.PUT("/comment", controller.UpdateCommentController)
	e.DELETE("/comment", controller.DeleteCommentController)

	e.POST("/flag", controller.FlagController)
	e.POST("/upvote", controller.UpvoteController)
	e.POST("/downvote", controller.DownvoteController)

	e.GET("/playlist", controller.PlaylistController)

	e.GET("/user", controller.GetUserController)
	e.POST("/user", controller.UserController)
	e.PUT("/user", controller.UpdateUserController)

	// Start server
	e.Logger.Fatal(e.Start(":5000"))
}
