package controller

import (
	"context"
	"fmt"
	"net/http"

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

	groupParams := queries.InsertGroupParams{
		Name:        group.Name,
		Description: descriptionParam,
		CreatedBy:   group.CreatedBy,
	}

	groupID, err := sql.InsertGroup(context.Background(), groupParams)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "Error creating group")
	}

	// Construct a link to the newly created group
	id := fmt.Sprint(groupID)

	// Return the link to the client
	return c.JSON(http.StatusOK, map[string]string{
		"id": id,
	})
}

// UpdatePostController handles post updates
func GetGroupController(c echo.Context) error {
	return c.String(http.StatusOK, "Thread updated")
}