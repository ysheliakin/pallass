package main

import (
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", hello)

	// Post Handlers
	e.POST("/user", func(c echo.Context) error {
		return c.String(http.StatusOK, "User created")
	})
	e.POST("/post", func(c echo.Context) error {
		return c.String(http.StatusOK, "Post created")
	})
	e.POST("/comment", func(c echo.Context) error {
		return c.String(http.StatusOK, "Comment created")
	})
	e.POST("/flag", func(c echo.Context) error {
		return c.String(http.StatusOK, "Flag added")
	})
	e.POST("/upvote", func(c echo.Context) error {
		return c.String(http.StatusOK, "Upvoted")
	})
	e.POST("/downvote", func(c echo.Context) error {
		return c.String(http.StatusOK, "Downvoted")
	})

	// Get Handlers
	e.GET("/playlist", func(c echo.Context) error {
		return c.String(http.StatusOK, "Here is the playlist")
	})

	// Put Handlers
	e.PUT("/user", func(c echo.Context) error {
		return c.String(http.StatusOK, "User updated")
	})
	e.PUT("/post", func(c echo.Context) error {
		return c.String(http.StatusOK, "Post updated")
	})
	e.PUT("/comment", func(c echo.Context) error {
		return c.String(http.StatusOK, "Comment updated")
	})

	// Delete Handlers
	e.DELETE("/post", func(c echo.Context) error {
		return c.String(http.StatusOK, "Post deleted")
	})
	e.DELETE("/comment", func(c echo.Context) error {
		return c.String(http.StatusOK, "Comment deleted")
	})

	// Angular Reverse Proxy
	e.GET("/*", echo.WrapHandler(AngularHandler))

	// Start server
	e.Logger.Fatal(e.Start(":5000"))
}

func hello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello World!")
}

// Reverse Proxy for Angular
func getOrigin() *url.URL {
	origin, _ := url.Parse("http://localhost:4200")
	return origin
}

var origin = getOrigin()

var director = func(req *http.Request) {
	req.Header.Add("X-Forwarded-Host", req.Host)
	req.Header.Add("X-Origin-Host", origin.Host)
	req.URL.Scheme = "http"
	req.URL.Host = origin.Host
}

// AngularHandler loads Angular assets
var AngularHandler = &httputil.ReverseProxy{Director: director}
