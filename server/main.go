package main

import (
	"context"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"fmt"
	"sync"

	controller "sih/pallass/controllers"
	queries "sih/pallass/generated"

	"github.com/jackc/pgx/v5"
	"github.com/labstack/echo/v4"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
	"github.com/joho/godotenv"
)

var e *echo.Echo
var dbc context.Context
var sql *queries.Queries
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]bool)

// Broadcast messages
var broadcast = make(chan Message)
var mu sync.Mutex

type Message struct {
	Sender  string `json:"sender"`
	Content string `json:"content"`
}

type RegisterResponse struct {
	Message string `json:"message"`
}

func init() {
	// Load the environment variables
	err := godotenv.Load()
	if err != nil {
		e.Logger.Fatal(err)
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

	/* Public routes */
	// Get handlers
	e.GET("/funding", controller.GetFundingOpportunities)
	// Post handlers
	e.POST("/request-reset", controller.RequestPasswordReset)
	e.POST("/threads/:id", controller.GetThreadController)
	e.POST("/registeruser", controller.RegisterUser)
	e.POST("/loginuser", controller.LoginUser)

	// routes registered after this will require authentication
	authGroup := e.Group("")
	authGroup.Use(middleware.Logger())
	authGroup.Use(middleware.Recover())
	authGroup.Use(middleware.CORS()) // TODO: might want to make this stricter
	authGroup.Use(controller.Authenticate)

	/* Private routes requiring bearer token */
	// Get handlers
	e.GET("/group/:id", controller.GetGroupController)
	e.GET("/playlist", controller.PlaylistController)
	//e.GET("/authenticate", controller.Authenticate)
	e.GET("/ws/:email", webSocket)
	//e.GET("/user", controller.GetUserController)
	e.GET("/getThreads", controller.GetThreadsController)
	// Post handlers
	e.POST("/postThread", controller.ThreadController)
	e.POST("/newgroup", controller.CreateGroup)
	e.POST("/flag", controller.FlagController)
	e.POST("/threads/upvote/:threadID", controller.UpvoteThread)
	e.POST("/downvote", controller.DownvoteController)
	e.POST("/post", func(c echo.Context) error {
		return c.String(http.StatusOK, "Post created")
	})
	e.POST("/reset-password", controller.ResetPassword)
	e.POST("/validate-code", controller.ValidateResetCode)
	e.POST("/flag", func(c echo.Context) error {
		return c.String(http.StatusOK, "Flag added")
	})
	e.POST("/downvote", func(c echo.Context) error {
		return c.String(http.StatusOK, "Downvoted")
	})
	e.POST("/user", controller.UserController)
	e.POST("/funding", controller.AddFundingOpportunity)
	e.POST("/getUserName", controller.GetUserName)
	e.POST("/storeThreadMessage", controller.StoreThreadMessage)
	// Put handlers
	e.PUT("/message", controller.UpdateMessageController)
	e.PUT("/user", func(c echo.Context) error {
		return c.String(http.StatusOK, "User updated")
	})
	e.PUT("/post", func(c echo.Context) error {
		return c.String(http.StatusOK, "Post updated")
	})
	e.PUT("/user", controller.UpdateUserController)
	// Delete handlers
	e.DELETE("/deleteThread", controller.DeleteThreadController)
	e.DELETE("/message", controller.DeleteMessageController)
	e.DELETE("/post", func(c echo.Context) error {
		return c.String(http.StatusOK, "Post deleted")
	})

	// Message handling
	go handleMessages()

	// Start server
	e.Logger.Fatal(e.Start(":5000"))
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

func webSocket(c echo.Context) error {
	fmt.Println("webSocket")

	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	defer conn.Close()

	// Lock the mutex
	mu.Lock()
	clients[conn] = true
	// Unlock the mutex
	mu.Unlock()

	for {
		var msg Message

		err := conn.ReadJSON(&msg)
		if err != nil {
			mu.Lock()
			delete(clients, conn)
			mu.Unlock()
			break
		}

		broadcast <- msg
	}

	return nil
}

func handleMessages() {
	for {
		msg := <-broadcast
		mu.Lock()
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				client.Close()
				delete(clients, client)
			}
		}
		mu.Unlock()
	}
}


// func addMessage(c echo.Context) error {
// 	postID := c.Param("id") // Change the route to expect post ID
// 	var message Message
// 	if err := c.Bind(&message); err != nil {
// 		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid input"})
// 	}

// 	// Insert message into database
// 	_, err := sql.CreateMessage(context.Background(), message.Content, postID, message.UserID) // Use your query function
// 	if err != nil {
// 		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "could not add message"})
// 	}

// 	// Notify users (for simplicity, notify all users)
// 	_, err = sql.CreateNotification(context.Background(), message.UserID, message.Content+" was added to a post!", postID) // Use your query function
// 	if err != nil {
// 		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "could not send notifications"})
// 	}

// 	return c.JSON(http.StatusCreated, message)
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
