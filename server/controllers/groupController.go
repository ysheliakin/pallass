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
		return c.JSON(http.StatusInternalServerError, "Error creating group")
	}

	groupIDStr := strconv.FormatInt(int64(groupID.ID), 10)
	groupUUIDStr := fmt.Sprintf("%x-%x-%x-%x-%x", groupID.Uuid.Bytes[0:4], groupID.Uuid.Bytes[4:6], groupID.Uuid.Bytes[6:8], groupID.Uuid.Bytes[8:10], groupID.Uuid.Bytes[10:16])

	return c.JSON(http.StatusOK, map[string]string{
		"id":   groupIDStr,
		"uuid": groupUUIDStr,
	})

}

func GetGroupController(c echo.Context) error {
	return c.String(http.StatusOK, "Thread updated")
}

func JoinGroup(c echo.Context) error {
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

}
