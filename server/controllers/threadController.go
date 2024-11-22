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
	var user User

	fmt.Println()
	fmt.Println("UpvoteThread()")

	// Decode the incoming JSON request body
	err := c.Bind(&user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Invalid input. Please enter a valid input."})
	}

	fmt.Println("user.Email: ", user.Email)

	threadId, err := strconv.Atoi(c.Param("threadID"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid thread ID")
	}

	fmt.Println("threadId: ", int32(threadId))

	upvoteParams := queries.InsertThreadUpvoteParams{
		ThreadID: int32(threadId),
		UserEmail: user.Email,
	}

	fmt.Println("upvoteParams")

	err = sql.InsertThreadUpvote(context.Background(), upvoteParams)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Failed to upvote thread")
	}

	fmt.Println("InsertThreadUpvote()")

	return c.JSON(http.StatusOK, RegisterResponse{Message: "Successfully upvoted the thread"})
}

func GetThreadUpvotes(c echo.Context) error {
	fmt.Println("GetThreadUpvotes()")

	threadId, err := strconv.Atoi(c.Param("threadID"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid thread ID")
	}

	fmt.Println("threadID: ", int32(threadId))

	threadUpvotesCount, err := sql.GetThreadUpvotesCount(context.Background(), int32(threadId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Failed to upvote thread")
	}

	fmt.Println("threadUpvotesCount worked")

	return c.JSON(http.StatusOK, threadUpvotesCount)	
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

// DownvoteController handles downvote actions
func DownvoteController(c echo.Context) error {
	return c.String(http.StatusOK, "Downvoted")
}

// Get all of the discussion threads
func GetThreadsSortedByMostUpvotes(c echo.Context) error {
	fmt.Println("getThreadsSortedByMostUpvoted")

	// Query the database to retrieve information from all of the threads
	threads, err := sql.GetThreadsSortedByMostUpvotes(context.Background())
	if err != nil {
		if err.Error() == "no rows in result set" {
			return c.JSON(http.StatusNotFound, "No threads were found")
		}
		return c.JSON(http.StatusInternalServerError, "Error retrieving thread")
	}
	return c.JSON(http.StatusOK, threads)
}

func GetThreadsSortedByLeastUpvotes(c echo.Context) error {
	fmt.Println("getThreadsSortedByMostUpvoted")

	// Query the database to retrieve information from all of the threads
	threads, err := sql.GetThreadsSortedByLeastUpvotes(context.Background())
	if err != nil {
		if err.Error() == "no rows in result set" {
			return c.JSON(http.StatusNotFound, "No threads were found")
		}
		return c.JSON(http.StatusInternalServerError, "Error retrieving thread")
	}
	return c.JSON(http.StatusOK, threads)
}

// Get all of the discussion threads that the user upvoted
func GetUpvotedThreadsController(c echo.Context) error {
	fmt.Println("GetUpvotedThreadsController")

	email := c.Param("email")

	// Query the database to retrieve information from all of the upvoted threads
	threads, err := sql.GetUpvotedThreadsByUserEmail(context.Background(), email)
	if err != nil {
		if err.Error() == "no rows in result set" {
			return c.JSON(http.StatusNotFound, "No upvoted threads were found")
		}
		return c.JSON(http.StatusInternalServerError, "Error retrieving upvoted threads")
	}
	return c.JSON(http.StatusOK, threads)
}

// Get a thread's information (including its messages)
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

	fmt.Println("threadIDInt32: ", threadIDInt32)

	threadParams := queries.GetThreadAndMessagesByThreadIDAndFullnameByUserEmailParams{
		ID:    threadIDInt32,
		Email: user.Email,
	}

	fmt.Println("threadParams initiated")

	// Query the database
	thread, err := sql.GetThreadAndMessagesByThreadIDAndFullnameByUserEmail(context.Background(), threadParams) // Pass as int32
	if err != nil {
		if err.Error() == "no rows in result set" {
			return c.JSON(http.StatusNotFound, "Thread not found")
		}
		return c.JSON(http.StatusInternalServerError, "Error retrieving thread")
	}

	fmt.Println("thread: ", thread)
	return c.JSON(http.StatusOK, thread)
}

// DeleteThreadController handles thread deletion
func DeleteThreadController(c echo.Context) error {
	return c.String(http.StatusOK, "Thread deleted")
}

// Store a thread message in the database
func StoreThreadMessage(c echo.Context) error {
	var threadMessage ThreadMessage
	var replyMessageIDParam pgtype.Int4

	reply := pgtype.Bool{Bool: false, Valid: true}

	fmt.Println("StoreThreadMessage()")

	// Decode the incoming JSON request body
	err := c.Bind(&threadMessage)
	if err != nil {
		e.Logger.Error(err)
		fmt.Println("Error decoding the incoming JSON request body")
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	threadId, err := strconv.Atoi(threadMessage.ThreadID)
	if err != nil {
		e.Logger.Error(err)
		fmt.Println("Invalid thread ID format")
		return c.String(http.StatusBadRequest, "Invalid thread ID format")
	}

	// If the message is a reply, convert the replied to message ID to pgtpye.Int4 and set reply to true
	// Else set the reply to false
	if threadMessage.ReplyMessageID != "" {
		fmt.Println("ReplyMessageID exists")

		replyMessageID, err := strconv.Atoi(threadMessage.ReplyMessageID)
		if err != nil {
			e.Logger.Error(err)
			fmt.Println("Invalid reply message ID format")
			return c.String(http.StatusBadRequest, "Invalid reply message ID format")
		}

		replyMessageIDParam = pgtype.Int4{Int32: int32(replyMessageID), Valid: true}

		reply = pgtype.Bool{Bool: true, Valid: true}
	} else {
		replyMessageIDParam = pgtype.Int4{Valid: false}
	}

	threadMessageParams := queries.StoreThreadMessageParams{
		Firstname: threadMessage.Firstname,
		Lastname:  threadMessage.Lastname,
		ThreadID:  int32(threadId),
		Content:   threadMessage.Content,
		MessageID: replyMessageIDParam,
		Reply: reply,
	}

	// Store the thread message
	messageData, err := sql.StoreThreadMessage(context.Background(), threadMessageParams)
	if err != nil {
		fmt.Println("Unable to StoreThreadMessage")
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	fmt.Println("messageData: ", messageData)
	return c.JSON(http.StatusOK, messageData)
}

// Get the information of the user sending a message
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
	err = sql.DeleteThreadMessageAndRepliesByID(context.Background(), int32(threadId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, RegisterResponse{Message: "Thead message and replies successfully deleted"})
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

// Get the information of the message being replied to
func GetReplyingMessageData(c echo.Context) error {
	var threadMessage ThreadMessage

	fmt.Println("GetReplyingMessageData()")

	// Decode the incoming JSON request body
	err := c.Bind(&threadMessage)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	replyingMessageId, err := strconv.Atoi(threadMessage.ID)
	if err != nil {
		e.Logger.Error(err)
		return c.String(http.StatusBadRequest, "Invalid ID format")
	}

	replyingMessageData, err := sql.SelectReplyingMessageByID(context.Background(), int32(replyingMessageId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, replyingMessageData)
}

func GetThreadsByCategory(c echo.Context) error {
	var thread Thread

	fmt.Println("GetThreadsByCategory()")

	// Decode the incoming JSON request body
	err := c.Bind(&thread)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	fmt.Println("thread.Category: ", thread.Category)

	threads, err := sql.GetThreadsByCategory(context.Background(), thread.Category)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Failed to upvote thread")
	}

	fmt.Println("threads: ", threads)

	return c.JSON(http.StatusOK, threads)
}

func GetThreadsByCategorySortedByMostUpvotes(c echo.Context) error {
	var thread Thread

	fmt.Println("GetThreadsByCategory()")

	// Decode the incoming JSON request body
	err := c.Bind(&thread)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	fmt.Println("thread.Category: ", thread.Category)

	threads, err := sql.GetThreadsByCategorySortedByMostUpvotes(context.Background(), thread.Category)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Failed to upvote thread")
	}

	fmt.Println("threads: ", threads)

	return c.JSON(http.StatusOK, threads)
}

func GetThreadsByCategorySortedByLeastUpvotes(c echo.Context) error {
	var thread Thread

	fmt.Println("GetThreadsByCategory()")

	// Decode the incoming JSON request body
	err := c.Bind(&thread)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	fmt.Println("thread.Category: ", thread.Category)

	threads, err := sql.GetThreadsByCategorySortedByLeastUpvotes(context.Background(), thread.Category)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Failed to upvote thread")
	}

	fmt.Println("threads: ", threads)

	return c.JSON(http.StatusOK, threads)
}

func GetThreadsByNameSortedByMostUpvotes(c echo.Context) error {
	var thread Thread

	fmt.Println()
	fmt.Println("GetThreadsByCategory()")

	// Decode the incoming JSON request body
	err := c.Bind(&thread)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	threadTitle := "%" + thread.Title + "%"
	fmt.Println("thread.Title: ", threadTitle)

	threads, err := sql.GetThreadsByNameSortedByMostUpvotes(context.Background(), threadTitle)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Failed to upvote thread")
	}

	fmt.Println("threads: ", threads)

	return c.JSON(http.StatusOK, threads)
}

func GetThreadsByNameSortedByLeastUpvotes(c echo.Context) error {
	var thread Thread

	fmt.Println()
	fmt.Println("GetThreadsByCategory()")

	// Decode the incoming JSON request body
	err := c.Bind(&thread)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	threadTitle := "%" + thread.Title + "%"
	fmt.Println("threadTitle: ", threadTitle)

	threads, err := sql.GetThreadsByNameSortedByLeastUpvotes(context.Background(), threadTitle)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Failed to upvote thread")
	}

	fmt.Println("threads: ", threads)

	return c.JSON(http.StatusOK, threads)
}