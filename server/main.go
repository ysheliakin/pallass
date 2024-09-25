package main

import (
	"context"
	"net/http"
	"os"
	queries "sih/pallass/generated"
	"strconv"

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

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", hello)

	// Post Handlers
	e.POST("/registeruser", func(c echo.Context) error {
		return c.String(http.StatusOK, "User created")
	})
	e.POST("/loginuser", func(c echo.Context) error {
		return c.String(http.StatusOK, "User logged in")
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

	// Start server
	e.Logger.Fatal(e.Start(":5000"))
}

func hello(c echo.Context) error {
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

// User registration
func registerUser(c echo.Context) error {
	var user User

	// Save the new user to the database
	_, err := dbPool.Exec(context.Background(), "INSERT INTO users (firstname, lastname, email, password, organization, fieldOfStudy, job) VALUES ($1, $2, $3, $4, $5, $6, $7)", user.Firstname, user.Lastname, user.Email, user.Password, user.Organization, user.FieldOfStudy, user.JobTitle)

	if err != nil {
		response := RegisterResponse{Message: "Error creating an account"}
		json.NewEncoder(w).Encode(response)
		return
	}

	response := RegisterResponse{Message: "Account successfully registered"}
	json.NewEncoder(w).Encode(response)
}