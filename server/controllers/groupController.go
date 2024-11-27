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

func CreateGroup(c echo.Context) error {
	var group Group

	err := c.Bind(&group)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid inputs")
	}

	var descriptionParam pgtype.Text
	if group.Description != "" {
		descriptionParam = pgtype.Text{String: group.Description, Valid: true}
	} else {
		descriptionParam = pgtype.Text{Valid: false}
	}

	privacyParam := pgtype.Bool{Bool: group.Privacy, Valid: true}
	notificationsParam := pgtype.Bool{Bool: group.Notifications, Valid: true}

	// Inserting group data, including Privacy and Notifications fields
	groupParams := queries.InsertGroupParams{
		Name:          group.Name,
		Description:   descriptionParam,
		Public:        privacyParam,
		Notifications: notificationsParam,
	}

	groupID, err := sql.InsertGroup(context.Background(), groupParams)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "An error occurred trying to create the group."})
	}

	groupIDStr := strconv.FormatInt(int64(groupID.ID), 10)
	groupUUIDStr := fmt.Sprintf("%x-%x-%x-%x-%x", groupID.Uuid.Bytes[0:4], groupID.Uuid.Bytes[4:6], groupID.Uuid.Bytes[6:8], groupID.Uuid.Bytes[8:10], groupID.Uuid.Bytes[10:16])

	return c.JSON(http.StatusOK, map[string]string{
		"id":   groupIDStr,
		"uuid": groupUUIDStr,
	})
}

func AddGroupMembers(c echo.Context) error {
	fmt.Println("AddGroupMembers()")

	var groupMember GroupMember

	err := c.Bind(&groupMember)
	if err != nil {
		fmt.Println("Invalid inputs")
		return c.JSON(http.StatusBadRequest, "Invalid inputs")
	}

	groupIDInt, err := strconv.Atoi(groupMember.GroupID)
	if err != nil {
		fmt.Println("Invalid GroupID format")
		return c.JSON(http.StatusBadRequest, "Invalid GroupID format")
	}

	var userEmailParam pgtype.Text
	if groupMember.UserEmail != "" {
		userEmailParam = pgtype.Text{String: groupMember.UserEmail, Valid: true}
	} else {
		userEmailParam = pgtype.Text{Valid: false}
	}

	InsertGroupMemberParams := queries.InsertGroupMemberParams{
		GroupID: int32(groupIDInt),
		UserEmail: userEmailParam,
		Role: groupMember.Role,
	}

	groupID, err := sql.InsertGroupMember(context.Background(), InsertGroupMemberParams)
	if err != nil {
		fmt.Println("Error adding a new member to the group")
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "No user with the email address '" + groupMember.UserEmail + "' exists."})
	}

	return c.JSON(http.StatusOK, groupID)
}

func GetGroupController(c echo.Context) error {
	fmt.Println("GetGroupController()")

	var user User

	// Decode the incoming JSON request body
	err := c.Bind(&user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Invalid input. Please enter a valid input."})
	}

	groupIDStr := c.Param("id")
	groupID, err := strconv.ParseInt(groupIDStr, 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid Group ID")
	}
	groupIDInt32 := int32(groupID)

	fmt.Println("GroupIDInt32: ", groupIDInt32)

	groupParams := queries.GetGroupAndGroupMessagesByGroupIDAndFullnameByUserEmailParams{
		ID:    groupIDInt32,
		Email: user.Email,
	}

	fmt.Println("groupParams initiated")

	// Query the database
	group, err := sql.GetGroupAndGroupMessagesByGroupIDAndFullnameByUserEmail(context.Background(), groupParams) // Pass as int32
	if err != nil {
		if err.Error() == "no rows in result set" {
			return c.JSON(http.StatusNotFound, "Group not found")
		}
		return c.JSON(http.StatusInternalServerError, "Error retrieving group")
	}

	fmt.Println("group: ", group)
	return c.JSON(http.StatusOK, group)
}

// Store a group message in the database
func StoreGroupMessage(c echo.Context) error {
	var groupMessage GroupMessage
	var replyMessageIDParam pgtype.Int4

	reply := pgtype.Bool{Bool: false, Valid: true}

	fmt.Println("StoreGroupMessage()")

	// Decode the incoming JSON request body
	err := c.Bind(&groupMessage)
	if err != nil {
		e.Logger.Error(err)
		fmt.Println("Error decoding the incoming JSON request body")
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	groupId, err := strconv.Atoi(groupMessage.GroupID)
	if err != nil {
		e.Logger.Error(err)
		fmt.Println("Invalid group ID format")
		return c.String(http.StatusBadRequest, "Invalid group ID format")
	}

	// If the message is a reply, convert the replied to message ID to pgtpye.Int4 and set reply to true
	// Else set the reply to false
	if groupMessage.ReplyMessageID != "" {
		fmt.Println("ReplyMessageID exists")

		replyMessageID, err := strconv.Atoi(groupMessage.ReplyMessageID)
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

	groupMessageParams := queries.StoreGroupMessageParams{
		Firstname: groupMessage.Firstname,
		Lastname:  groupMessage.Lastname,
		GroupID:  int32(groupId),
		Content:   groupMessage.Content,
		GroupMessageID: replyMessageIDParam,
		Reply: reply,
	}

	// Store the group message
	messageData, err := sql.StoreGroupMessage(context.Background(), groupMessageParams)
	if err != nil {
		fmt.Println("Unable to StoreGroupMessage")
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	fmt.Println("messageData: ", messageData)
	return c.JSON(http.StatusOK, messageData)
}

// Delete a message
func DeleteGroupMessage(c echo.Context) error {
	fmt.Println("DeleteGroupMessage()")

	groupMessageIDStr := c.Param("messageID")

	groupMessageId, err := strconv.Atoi(groupMessageIDStr)
	if err != nil {
		e.Logger.Error(err)
		return c.String(http.StatusBadRequest, "Invalid ID format")
	}

	// Delete the group message
	err = sql.DeleteGroupMessageAndRepliesByID(context.Background(), int32(groupMessageId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, RegisterResponse{Message: "Group message and replies successfully deleted"})
}

// Edit a message
func EditGroupMessage(c echo.Context) error {
	var groupMessage GroupMessage

	fmt.Println("EditGroupMessage()")

	// Decode the incoming JSON request body
	err := c.Bind(&groupMessage)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	messageId, err := strconv.Atoi(groupMessage.ID)
	if err != nil {
		e.Logger.Error(err)
		return c.String(http.StatusBadRequest, "Invalid ID format")
	}

	editGroupMessageParams := queries.EditGroupMessageByIDParams{
		ID:      int32(messageId),
		Content: groupMessage.Content,
	}

	// Edit the group message
	err = sql.EditGroupMessageByID(context.Background(), editGroupMessageParams)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, RegisterResponse{Message: "Group message successfully updated"})
}

// Get the messages that are replies
func GetGroupReplyingMessageData(c echo.Context) error {
	var groupMessage GroupMessage

	fmt.Println("GetGroupReplyingMessageData()")

	// Decode the incoming JSON request body
	err := c.Bind(&groupMessage)
	if err != nil {
		e.Logger.Error(err)
		fmt.Println("Error decoding the incoming JSON request body")
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	replyingMessageId, err := strconv.Atoi(groupMessage.ID)
	if err != nil {
		e.Logger.Error(err)
		fmt.Println("Invalid ID format")
		return c.String(http.StatusBadRequest, "Invalid ID format")
	}

	replyingMessageData, err := sql.SelectGroupReplyingMessageByID(context.Background(), int32(replyingMessageId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	fmt.Println("replyingMessageData: ", replyingMessageData)
	return c.JSON(http.StatusOK, replyingMessageData)
}

// Get the list of members of a group
func GetGroupMembers(c echo.Context) error {
	var groupMember GroupMember

	fmt.Println("GetGroupMembers()")
	
	// Decode the incoming JSON request body
	err := c.Bind(&groupMember)
	if err != nil {
		e.Logger.Error(err)
		fmt.Println("Error decoding the incoming JSON request body")
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	groupIDInt, err := strconv.Atoi(groupMember.GroupID)
	if err != nil {
		fmt.Println("Invalid GroupID format")
		return c.JSON(http.StatusBadRequest, "Invalid GroupID format")
	}

	groupMembers, err := sql.GetGroupMembersByGroupID(context.Background(), int32(groupIDInt))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	fmt.Println("groupMembers: ", groupMembers)
	return c.JSON(http.StatusOK, groupMembers)
}

// Leave/kick a user out of the group
func ExitGroup(c echo.Context) error {
	var groupMember GroupMember

	fmt.Println("ExitGroup()")
	
	// Decode the incoming JSON request body
	err := c.Bind(&groupMember)
	if err != nil {
		e.Logger.Error(err)
		fmt.Println("Error decoding the incoming JSON request body")
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	var memberEmailParam pgtype.Text
	if groupMember.UserEmail != "" {
		memberEmailParam = pgtype.Text{String: groupMember.UserEmail, Valid: true}
	} else {
		memberEmailParam = pgtype.Text{Valid: false}
	}

	fmt.Println("memberEmailParam: ", memberEmailParam)

	groupIDStr := c.Param("groupid")

	fmt.Println("groupIDStr: ", groupIDStr)

	groupID, err := strconv.ParseInt(groupIDStr, 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid Group ID")
	}
	groupIDInt32 := int32(groupID)

	fmt.Println("groupIDInt32: ", groupIDInt32)

	groupMemberParams := queries.DeleteUserFromGroupParams{
		GroupID:   groupIDInt32,
		UserEmail: memberEmailParam,
	}

	err = sql.DeleteUserFromGroup(context.Background(), groupMemberParams)
	if err != nil {
		fmt.Println("DeleteUserFromGroup didn't work")
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, RegisterResponse{Message: "User successfully removed from the group"})	
}

// Change the owner of the group
func ChangeOwner(c echo.Context) error {
	var groupMember GroupMember

	fmt.Println()
	fmt.Println("ChangeOwner()")

	// Decode the incoming JSON request body
	err := c.Bind(&groupMember)
	if err != nil {
		e.Logger.Error(err)
		fmt.Println("Error decoding the incoming JSON request body")
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	var memberEmailParam pgtype.Text
	if groupMember.UserEmail != "" {
		memberEmailParam = pgtype.Text{String: groupMember.UserEmail, Valid: true}
	} else {
		memberEmailParam = pgtype.Text{Valid: false}
	}

	groupID, err := strconv.ParseInt(groupMember.GroupID, 10, 32)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid Group ID")
	}
	groupIDInt32 := int32(groupID)

	email := c.Param("email")

	var emailParam pgtype.Text
	if email != "" {
		emailParam = pgtype.Text{String: email, Valid: true}
	} else {
		emailParam = pgtype.Text{Valid: false}
	}

	fmt.Println("emailParam: ", emailParam)
	fmt.Println("memberEmailParam: ", memberEmailParam)
	fmt.Println("groupIDInt32: ", groupIDInt32)

	switchRolesParams := queries.SwitchGroupRolesParams{
		UserEmail:   emailParam,
		UserEmail_2: memberEmailParam,
		GroupID:     groupIDInt32,
	}

	err = sql.SwitchGroupRoles(context.Background(), switchRolesParams)
	if err != nil {
		fmt.Println("SwitchGroupRoles didn't work")
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, RegisterResponse{Message: "User successfully removed from the group"})
}

// Delete the group
func DeleteGroup(c echo.Context) error {
	fmt.Println("DeleteGroupMessage()")

	groupIDStr := c.Param("groupid")

	groupId, err := strconv.Atoi(groupIDStr)
	if err != nil {
		e.Logger.Error(err)
		return c.String(http.StatusBadRequest, "Invalid ID format")
	}

	// Delete the group message
	err = sql.DeleteGroup(context.Background(), int32(groupId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, RegisterResponse{Message: "Group successfully deleted"})
}

// Add a member to the group
func AddMember(c echo.Context) error {
	fmt.Println("AddMember()")

	var groupMember GroupMember

	// Decode the incoming JSON request body
	err := c.Bind(&groupMember)
	if err != nil {
		e.Logger.Error(err)
		fmt.Println("Error decoding the incoming JSON request body")
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	var emailParam pgtype.Text
	if groupMember.UserEmail != "" {
		emailParam = pgtype.Text{String: groupMember.UserEmail, Valid: true}
	} else {
		emailParam = pgtype.Text{Valid: false}
	}

	fmt.Println("emailParam: ", emailParam)

	groupIDStr := c.Param("groupid")

	groupId, err := strconv.Atoi(groupIDStr)
	if err != nil {
		e.Logger.Error(err)
		return c.String(http.StatusBadRequest, "Invalid ID format")
	}

	// Inserting new member data
	newMemberParams := queries.AddMemberToGroupParams{
		GroupID:   int32(groupId),
		UserEmail: emailParam,
		Role:      "Member",
	}

	// Delete the group message
	err = sql.AddMemberToGroup(context.Background(), newMemberParams)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	return c.JSON(http.StatusOK, RegisterResponse{Message: "New member successfully added to the group"})
}

// Get the groups that the user is a part of
func GetGroups(c echo.Context) error {
	fmt.Println("GetGroups")

	emailParam := c.Param("email")
	fmt.Println("emailParam: ", emailParam)

	var email pgtype.Text
	if emailParam != "" {
		email = pgtype.Text{String: emailParam, Valid: true}
	} else {
		email = pgtype.Text{Valid: false}
	}

	// Query the database to retrieve information from all of the groups that the user is a part of
	groups, err := sql.GetGroupsByUserEmail(context.Background(), email)
	if err != nil {
		if err.Error() == "no rows in result set" {
			return c.JSON(http.StatusNotFound, "No groups were found")
		}
		return c.JSON(http.StatusInternalServerError, "Error retrieving upvoted threads")
	}
	fmt.Println("groups: ", groups)
	return c.JSON(http.StatusOK, groups)
}



/*func JoinGroup(c echo.Context) error {
	var member GroupMember

	// Bind the JSON input to the GroupMember struct
	err := c.Bind(&member)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid inputs")
	}

	groupIDInt, err := strconv.Atoi(member.GroupID)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid GroupID format")
	}

	userIDInt, err := strconv.Atoi(member.UserID)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid GroupID format")
	}

	// Prepare parameters for inserting the group member
	groupMemberParams := queries.InsertGroupMemberParams{
		GroupID: int32(groupIDInt),
		UserID:  int32(userIDInt),
		Role:    member.Role,
	}

	// Insert the group member into the database
	memberID, err := sql.InsertGroupMember(context.Background(), groupMemberParams)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Error adding group member")
	}

	// Convert the member ID to a string
	memberIDStr := strconv.FormatInt(int64(memberID), 10)

	return c.JSON(http.StatusOK, map[string]string{
		"id": memberIDStr,
	})
}*/
