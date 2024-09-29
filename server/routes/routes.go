package router

import (
	controller "sih/pallass/controller"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Run(e *echo.Echo) {
	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/", controller.HelloController)

	// Post Handlers
	e.POST("/user", controller.UserController)
	e.POST("/postThread", controller.ThreadController)
	e.POST("/comment", controller.CommentController)
	e.POST("/flag", controller.FlagController)
	e.POST("/upvote", controller.UpvoteController)
	e.POST("/downvote", controller.DownvoteController)

	// Get Handlers
	e.GET("/playlist", controller.PlaylistController)
	e.GET("/thread", controller.GetThreadController)
	e.GET("/comment", controller.GetCommentController)
	e.GET("/user", controller.GetUserController)

	// Put Handlers
	e.PUT("/user", controller.UpdateUserController)
	e.PUT("/updateThread", controller.UpdateThreadController)
	e.PUT("/comment", controller.UpdateCommentController)

	// Delete Handlers
	e.DELETE("/deleteThread", controller.DeleteThreadController)
	e.DELETE("/comment", controller.DeleteCommentController)
}
