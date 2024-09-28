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
	e.POST("/post", controller.PostController)
	e.POST("/comment", controller.CommentController)
	e.POST("/flag", controller.FlagController)
	e.POST("/upvote", controller.UpvoteController)
	e.POST("/downvote", controller.DownvoteController)

	// Get Handlers
	e.GET("/playlist", controller.PlaylistController)

	// Put Handlers
	e.PUT("/user", controller.UpdateUserController)
	e.PUT("/post", controller.UpdatePostController)
	e.PUT("/comment", controller.UpdateCommentController)

	// Delete Handlers
	e.DELETE("/post", controller.DeletePostController)
	e.DELETE("/comment", controller.DeleteCommentController)
}
