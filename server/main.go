package main

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"sync"

	controller "sih/pallass/controllers"
	queries "sih/pallass/generated"

	"github.com/gorilla/websocket"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
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
var broadcastThreadMessage = make(chan Message)
var broadcastGroupMessage = make(chan GroupMessage)
var mu sync.Mutex

type Message struct {
	ID                 string `json:"id"`
	Sender             string `json:"sender"`
	Content            string `json:"content"`
	Date               string `json:"date"`
	Type               string `json:"type"`
	Reply              string `json:"reply"`
	ReplyingMsgID      string `json:"replyingmsgid"`
	ReplyingMsgSender  string `json:"replyingmsgsender"`
	ReplyingMsgContent string `json:"replyingmsgcontent"`
	ReplyingMsgDate    string `json:"replyingmsgdate"`
}

type GroupMessage struct {
	ID                 string `json:"id"`
	Sender             string `json:"sender"`
	Content            string `json:"content"`
	Date               string `json:"date"`
	Type               string `json:"type"`
	Reply              string `json:"reply"`
	ReplyingMsgID      string `json:"replyingmsgid"`
	ReplyingMsgSender  string `json:"replyingmsgsender"`
	ReplyingMsgContent string `json:"replyingmsgcontent"`
	ReplyingMsgDate    string `json:"replyingmsgdate"`
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
	e.GET("/wsthread/:email", webSocketThread)
	e.GET("/wsgroup/:email", webSocketGroup)
	// Post handlers
	e.POST("/request-reset", controller.RequestPasswordReset)
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
	authGroup.GET("/playlist", controller.PlaylistController)
	//authGroup.GET("/user", controller.GetUserController)
	authGroup.GET("/getThreadsSortedByMostUpvotes", controller.GetThreadsSortedByMostUpvotes)
	authGroup.GET("/getThreadsSortedByLeastUpvotes", controller.GetThreadsSortedByLeastUpvotes)
	authGroup.GET("/getUpvotedThreads/:email", controller.GetUpvotedThreadsController)
	authGroup.GET("/threads/getUpvotes/:threadID", controller.GetThreadUpvotes)
	authGroup.GET("/getGroups/:email", controller.GetGroups)
	// Post handlers
	authGroup.POST("/postThread", controller.ThreadController)
	authGroup.POST("/threads/:id", controller.GetThreadController)
	authGroup.POST("/newgroup", controller.CreateGroup)
	authGroup.POST("/addgroupmembers", controller.AddGroupMembers)
	authGroup.POST("/groups/:id", controller.GetGroupController)
	authGroup.POST("/getMembers", controller.GetGroupMembers)
	authGroup.POST("/exitGroup/:groupid", controller.ExitGroup)
	authGroup.POST("/changeOwner/:email", controller.ChangeOwner)
	authGroup.POST("/addMember/:groupid", controller.AddMember)
	authGroup.POST("/flag", controller.FlagController)
	authGroup.POST("/threads/upvote/:threadID", controller.UpvoteThread)
	authGroup.POST("/downvote", controller.DownvoteController)
	authGroup.POST("/post", func(c echo.Context) error {
		return c.String(http.StatusOK, "Post created")
	})
	authGroup.POST("/reset-password", controller.ResetPassword)
	authGroup.POST("/validate-code", controller.ValidateResetCode)
	authGroup.POST("/flag", func(c echo.Context) error {
		return c.String(http.StatusOK, "Flag added")
	})
	authGroup.POST("/downvote", func(c echo.Context) error {
		return c.String(http.StatusOK, "Downvoted")
	})
	authGroup.POST("/user", controller.UserController)
	authGroup.POST("/funding", controller.AddFundingOpportunity)
	authGroup.POST("/getUserName", controller.GetUserName)
	authGroup.POST("/storeThreadMessage", controller.StoreThreadMessage)
	authGroup.POST("/editThreadMessage", controller.EditThreadMessage)
	authGroup.POST("/getReplyingMessageData", controller.GetReplyingMessageData)
	authGroup.POST("/getThreadsByNameSortedByMostUpvotes", controller.GetThreadsByNameSortedByMostUpvotes)
	authGroup.POST("/getThreadsByNameSortedByLeastUpvotes", controller.GetThreadsByNameSortedByLeastUpvotes)
	authGroup.POST("/getThreadsByCategorySortedByMostUpvotes", controller.GetThreadsByCategorySortedByMostUpvotes)
	authGroup.POST("/getThreadsByCategorySortedByLeastUpvotes", controller.GetThreadsByCategorySortedByLeastUpvotes)
	authGroup.POST("/storeGroupMessage", controller.StoreGroupMessage)
	authGroup.POST("/getGroupReplyingMessageData", controller.GetGroupReplyingMessageData)
	authGroup.POST("/editGroupMessage", controller.EditGroupMessage)
	// Put handlers
	authGroup.PUT("/message", controller.UpdateMessageController)
	authGroup.PUT("/user", func(c echo.Context) error {
		return c.String(http.StatusOK, "User updated")
	})
	authGroup.PUT("/post", func(c echo.Context) error {
		return c.String(http.StatusOK, "Post updated")
	})
	authGroup.PUT("/user", controller.UpdateUserController)
	// Delete handlers
	authGroup.DELETE("/deleteThread", controller.DeleteThreadController)
	authGroup.DELETE("/deleteThreadMessage/:messageID", controller.DeleteThreadMessage)
	authGroup.DELETE("/deleteGroupMessage/:messageID", controller.DeleteGroupMessage)
	authGroup.DELETE("/deleteGroup/:groupID", controller.DeleteGroup)
	authGroup.DELETE("/post", func(c echo.Context) error {
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

func webSocketThread(c echo.Context) error {
	fmt.Println("webSocketThread")

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

		// If the message is of type EDIT_MESSAGE, create an edit message with the ID, Content, and Type fields
		if msg.Type == "EDIT_MESSAGE" {
			editMessage := Message{
				ID:      msg.ID,
				Content: msg.Content,
				Type:    "EDIT_MESSAGE",
			}

            // Broadcast the edit message to all clients
            broadcastThreadMessage <- editMessage
		} else if msg.Type == "DELETE_MESSAGE" {
			// If the message is of type DELETE_MESSAGE, create a delete message with the ID and Type fields
			deleteMessage := Message{
				ID:   msg.ID,
				Type: "DELETE_MESSAGE",
				ReplyingMsgID: msg.ReplyingMsgID,
            }

            // Broadcast the delete message to all clients
            broadcastThreadMessage <- deleteMessage
        } else {
            // Broadcast the normal messages
            broadcastThreadMessage <- msg
        }
	}

	return nil
}

func webSocketGroup(c echo.Context) error {
	fmt.Println("webSocketGroup")

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
		var msg GroupMessage

		err := conn.ReadJSON(&msg)
		if err != nil {
			mu.Lock()
			delete(clients, conn)
			mu.Unlock()
			break
		}

		// If the message is of type EDIT_MESSAGE, create an edit message with the ID, Content, and Type fields
		if msg.Type == "EDIT_MESSAGE" {
			editMessage := GroupMessage{
                ID: msg.ID,
				Content: msg.Content,
				Type: "EDIT_MESSAGE",
            }

            // Broadcast the edit message to all clients
            broadcastGroupMessage <- editMessage
		} else if msg.Type == "DELETE_MESSAGE" {
			// If the message is of type DELETE_MESSAGE, create a delete message with the ID and Type fields
            deleteMessage := GroupMessage{
                ID: msg.ID,
				Type: "DELETE_MESSAGE",
				ReplyingMsgID: msg.ReplyingMsgID,
            }

            // Broadcast the delete message to all clients
            broadcastGroupMessage <- deleteMessage
        } else {
            // Broadcast the normal messages
            broadcastGroupMessage <- msg
        }
	}

	return nil
}

func handleMessages() {
	for {
		select {
			case msg := <-broadcastThreadMessage:
				mu.Lock()
				// Go through each connected client and send the message
				for client := range clients {
					err := client.WriteJSON(msg)
					// If an error occurs, close the client connection and remove the client from the list of connected clients
					if err != nil {
						client.Close()
						delete(clients, client)
					}
				}
				mu.Unlock()

			case msg := <-broadcastGroupMessage:
				mu.Lock()
				// Go through each connected client and send the message
				for client := range clients {
					err := client.WriteJSON(msg)
					// If an error occurs, close the client connection and remove the client from the list of connected clients
					if err != nil {
						client.Close()
						delete(clients, client)
					}
				}
				mu.Unlock()
		}
	}
}



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
