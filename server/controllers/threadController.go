package controller

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/labstack/echo/v4"

	queries "sih/pallass/generated"
)

func UpvoteThread(c echo.Context) error {

	threadID, err := strconv.Atoi(c.Param("threadID"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid thread ID")
	}

	upvotes, err := sql.UpvoteThread(context.Background(), int32(threadID))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Failed to upvote thread")
	}

	return c.JSON(http.StatusOK, map[string]int32{"upvotes": upvotes.Int32})
}

// ThreadController handles thread-related actions
func ThreadController(c echo.Context) error {
	var thread Thread

	err := c.Bind(&thread)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid inputs")
	}

	//parameters for the database insertion
	var categoryParam pgtype.Text
	if thread.Category != "" {
		categoryParam = pgtype.Text{String: thread.Category, Valid: true}
	} else {
		categoryParam = pgtype.Text{Valid: false}
	}

	threadParams := queries.InsertThreadParams{
		Firstname: thread.Firstname,
		Lastname:  thread.Lastname,
		Title:     thread.Title,
		Content:   thread.Content,
		Category:  categoryParam.String,
	}

	threadUUID, err := sql.InsertThread(context.Background(), threadParams)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Error creating thread")
	}

	threadIDStr := strconv.FormatInt(int64(threadUUID.ID), 10)
	threadUUIDStr := fmt.Sprintf("%x-%x-%x-%x-%x", threadUUID.Uuid.Bytes[0:4], threadUUID.Uuid.Bytes[4:6], threadUUID.Uuid.Bytes[6:8], threadUUID.Uuid.Bytes[8:10], threadUUID.Uuid.Bytes[10:16])

	return c.JSON(http.StatusOK, map[string]string{
		"id":   threadIDStr,
		"uuid": threadUUIDStr,
	})
}

// UpvoteController handles upvote actions
func UpvoteController(c echo.Context) error {
	return c.String(http.StatusOK, "Upvoted")
}

// DownvoteController handles downvote actions
func DownvoteController(c echo.Context) error {
	return c.String(http.StatusOK, "Downvoted")
}

func GetThreadsController(c echo.Context) error {
	fmt.Println("GetThreadsController")

	// Query the database
	threads, err := sql.GetThreads(context.Background())
	if err != nil {
		if err.Error() == "no rows in result set" {
			return c.JSON(http.StatusNotFound, "Thread not found")
		}
		return c.JSON(http.StatusInternalServerError, "Error retrieving thread")
	}
	return c.JSON(http.StatusOK, threads)
}

func GetThreadController(c echo.Context) error {
	fmt.Println("GetThreadController")

	var user User

	// Decode the incoming JSON request body
	err := c.Bind(&user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Invalid input. Please enter a valid input."})
	}

	threadIDStr := c.Param("id")
	threadID, err := strconv.ParseInt(threadIDStr, 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid thread ID")
	}
	threadIDInt32 := int32(threadID)

	threadParams := queries.GetThreadAndMessagesByThreadIDAndFullnameByUserEmailParams{
		ID:    threadIDInt32,
		Email: user.Email,
	}

	// Query the database
	thread, err := sql.GetThreadAndMessagesByThreadIDAndFullnameByUserEmail(context.Background(), threadParams) // Pass as int32
	if err != nil {
		if err.Error() == "no rows in result set" {
			return c.JSON(http.StatusNotFound, "Thread not found")
		}
		return c.JSON(http.StatusInternalServerError, "Error retrieving thread")
	}
	return c.JSON(http.StatusOK, thread)
}

// DeleteThreadController handles thread deletion
func DeleteThreadController(c echo.Context) error {
	return c.String(http.StatusOK, "Thread deleted")
}

func StoreThreadMessage(c echo.Context) error {
	var threadMessage ThreadMessage

	fmt.Println("StoreThreadMessage()")

	// Decode the incoming JSON request body
	err := c.Bind(&threadMessage)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	threadId, err := strconv.Atoi(threadMessage.ThreadID)
	if err != nil {
		e.Logger.Error(err)
		return c.String(http.StatusBadRequest, "Invalid ID format")
	}

	threadMessageParams := queries.StoreThreadMessageParams{
		Firstname: threadMessage.Firstname,
		Lastname:  threadMessage.Lastname,
		ThreadID:  int32(threadId),
		Content:   threadMessage.Content,
	}

	// Store the thread message
	messageData, err := sql.StoreThreadMessage(context.Background(), threadMessageParams)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	fmt.Println("messageData: ", messageData)
	return c.JSON(http.StatusOK, messageData)
}

func GetUserName(c echo.Context) error {
	var user User

	// Decode the incoming JSON request body
	err := c.Bind(&user)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Invalid input. Please enter a valid input."})
	}

	// Retrieve the user's information
	userData, err := sql.GetUserByEmail(context.Background(), user.Email)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, userData)
}

func DeleteThreadMessage(c echo.Context) error {
	fmt.Println("DeleteThreadMessage()")

	threadMessageIDStr := c.Param("messageID")

	threadId, err := strconv.Atoi(threadMessageIDStr)
	if err != nil {
		e.Logger.Error(err)
		return c.String(http.StatusBadRequest, "Invalid ID format")
	}

	// Delete the thread message
	err = sql.DeleteThreadMessageByID(context.Background(), int32(threadId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, RegisterResponse{Message: "Thead message successfully stored"})
}

func EditThreadMessage(c echo.Context) error {
	var threadMessage ThreadMessage

	fmt.Println("EditThreadMessage()")

	// Decode the incoming JSON request body
	err := c.Bind(&threadMessage)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	messageId, err := strconv.Atoi(threadMessage.ID)
	if err != nil {
		e.Logger.Error(err)
		return c.String(http.StatusBadRequest, "Invalid ID format")
	}

	editThreadMessageParams := queries.EditThreadMessageByIDParams{
		ID:      int32(messageId),
		Content: threadMessage.Content,
	}

	// Edit the thread message
	err = sql.EditThreadMessageByID(context.Background(), editThreadMessageParams)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, RegisterResponse{Message: "Thread message successfully updated"})
}
