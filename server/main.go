package main

import (
	"context"
	"os"

	// controller "sih/pallass/controller"
	queries "sih/pallass/generated"
	// router "sih/pallass/routes"

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

	// controller.SetGlobalContext(e, sql, dbc)
	// router.Run(e)

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Start server
	e.Logger.Fatal(e.Start(":5000"))
}
