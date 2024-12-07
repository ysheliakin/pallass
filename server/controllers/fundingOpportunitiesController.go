package controller

import (
	"context"
	"fmt"
	"time"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/labstack/echo/v4"

	queries "sih/pallass/generated"
)

func AddFundingOpportunity(c echo.Context) error {
	payload := GetBody(c)
	if payload == nil {
		e.Logger.Error("body is nil")
		return c.JSON(http.StatusBadRequest, ErrorPayload{Error: "could not parse body"})
	}
	params := queries.AddFundingOpportunityParams{
		Title:        payload["title"].(string),
		Description:  payload["description"].(string),
		TargetAmount: Numeric(payload["target_amount"].(float64)),
		Link:         Text(payload["link"].(string)),
		DeadlineDate: Date(payload["deadline_date"].(string)),
	}
	result, err := sql.AddFundingOpportunity(dbc, params)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}
	return c.JSON(http.StatusCreated, result)
}

// Get all of the funding opportunities, sorted by the highest amount, between the minimum and maximum amounts and between the earliest and latest deadlines inputted by the user
func GetFundingOpportunitiesSortedByHighestAmount(c echo.Context) error {
	var fundingOpportunity FundingOpportunity

	fmt.Println()
	fmt.Println("GetFundingOpportunitiesSortedByHighestAmount")

	// Decode the incoming JSON request body
	err := c.Bind(&fundingOpportunity)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	startDate := c.QueryParam("startDate")
	endDate := c.QueryParam("endDate")

	// YYYY-MM-DD format
	layout := "2006-01-02"
	var parsedStartDate, parsedEndDate time.Time

	if startDate != "" {
		parsedStartDate, err = time.Parse(layout, startDate)
		if err != nil {
			e.Logger.Error(err)
			return c.JSON(http.StatusBadRequest, "Invalid startDate format")
		}
	}

	if endDate != "" {
		parsedEndDate, err = time.Parse(layout, endDate)
		if err != nil {
			e.Logger.Error(err)
			return c.JSON(http.StatusBadRequest, "Invalid endDate format")
		}
	}

	var pgStartDate, pgEndDate pgtype.Date

	pgStartDate.Time = parsedStartDate
	pgStartDate.Valid = true

	pgEndDate.Time = parsedEndDate
	pgEndDate.Valid = true

	minAmountFloat, err := strconv.ParseFloat(fundingOpportunity.MinAmount, 64)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")	
	}

	maxAmountFloat, err := strconv.ParseFloat(fundingOpportunity.MaxAmount, 64)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	dataParam := queries.GetFundingOpportunitiesSortedByHighestAmountWithinDeadlineAndAmountRangesParams{
		DeadlineDate: pgStartDate,
		DeadlineDate_2: pgEndDate,
		TargetAmount: Numeric(minAmountFloat),
		TargetAmount_2: Numeric(maxAmountFloat),
	}

	// Query the database to retrieve information from all of the funding opportunities
	fundingOpportunities, err := sql.GetFundingOpportunitiesSortedByHighestAmountWithinDeadlineAndAmountRanges(context.Background(), dataParam)
	if err != nil {
		if err.Error() == "no rows in result set" {
			return c.JSON(http.StatusNotFound, "No funding opportunities were found")
		}
		return c.JSON(http.StatusInternalServerError, "Error retrieving funding opportunities")
	}
	return c.JSON(http.StatusOK, fundingOpportunities)
}

// Get all of the funding opportunities, sorted by the lowest amount, between the minimum and maximum amounts and between the earliest and latest deadlines inputted by the user
func GetFundingOpportunitiesSortedByLowestAmount(c echo.Context) error {
	var fundingOpportunity FundingOpportunity

	fmt.Println()
	fmt.Println("GetFundingOpportunitiesSortedByLowestAmount")

	// Decode the incoming JSON request body
	err := c.Bind(&fundingOpportunity)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	startDate := c.QueryParam("startDate")
	endDate := c.QueryParam("endDate")

	// YYYY-MM-DD format
	layout := "2006-01-02"
	var parsedStartDate, parsedEndDate time.Time

	if startDate != "" {
		parsedStartDate, err = time.Parse(layout, startDate)
		if err != nil {
			e.Logger.Error(err)
			return c.JSON(http.StatusBadRequest, "Invalid startDate format")
		}
	}

	if endDate != "" {
		parsedEndDate, err = time.Parse(layout, endDate)
		if err != nil {
			e.Logger.Error(err)
			return c.JSON(http.StatusBadRequest, "Invalid endDate format")
		}
	}

	var pgStartDate, pgEndDate pgtype.Date

	pgStartDate.Time = parsedStartDate
	pgStartDate.Valid = true

	pgEndDate.Time = parsedEndDate
	pgEndDate.Valid = true

	minAmountFloat, err := strconv.ParseFloat(fundingOpportunity.MinAmount, 64)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")	
	}

	maxAmountFloat, err := strconv.ParseFloat(fundingOpportunity.MaxAmount, 64)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	dataParam := queries.GetFundingOpportunitiesSortedByLowestAmountWithinDeadlineAndAmountRangesParams{
		DeadlineDate: pgStartDate,
		DeadlineDate_2: pgEndDate,
		TargetAmount: Numeric(minAmountFloat),
		TargetAmount_2: Numeric(maxAmountFloat),
	}

	// Query the database to retrieve information from all of the funding opportunities
	fundingOpportunities, err := sql.GetFundingOpportunitiesSortedByLowestAmountWithinDeadlineAndAmountRanges(context.Background(), dataParam)
	if err != nil {
		if err.Error() == "no rows in result set" {
			return c.JSON(http.StatusNotFound, "No funding opportunities were found")
		}
		return c.JSON(http.StatusInternalServerError, "Error retrieving funding opportunities")
	}
	return c.JSON(http.StatusOK, fundingOpportunities)
}

// Get all of the funding opportunities with titles that include the name/keywords inputted by the user, sorted by the highest amount, between the minimum and maximum amounts and between the earliest and latest deadlines inputted
func GetFundingOpportunitiesByNameSortedByHighestAmount(c echo.Context) error {
	var fundingOpportunity FundingOpportunity

	fmt.Println()
	fmt.Println("GetFundingOpportunitiesByNameSortedByHighestAmount()")

	// Decode the incoming JSON request body
	err := c.Bind(&fundingOpportunity)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	fundingOpportunityTitle := "%" + fundingOpportunity.Title + "%"
	fmt.Println("fundingOpportunity.Title: ", fundingOpportunityTitle)

	startDate := c.QueryParam("startDate")
	endDate := c.QueryParam("endDate")

	// YYYY-MM-DD format
	layout := "2006-01-02"
	var parsedStartDate, parsedEndDate time.Time

	if startDate != "" {
		parsedStartDate, err = time.Parse(layout, startDate)
		if err != nil {
			e.Logger.Error(err)
			return c.JSON(http.StatusBadRequest, "Invalid startDate format")
		}
	}

	if endDate != "" {
		parsedEndDate, err = time.Parse(layout, endDate)
		if err != nil {
			e.Logger.Error(err)
			return c.JSON(http.StatusBadRequest, "Invalid endDate format")
		}
	}

	var pgStartDate, pgEndDate pgtype.Date

	pgStartDate.Time = parsedStartDate
	pgStartDate.Valid = true

	pgEndDate.Time = parsedEndDate
	pgEndDate.Valid = true

	minAmountFloat, err := strconv.ParseFloat(fundingOpportunity.MinAmount, 64)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")	
	}

	maxAmountFloat, err := strconv.ParseFloat(fundingOpportunity.MaxAmount, 64)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	dataParam := queries.GetFundingOpportunitiesByNameSortedByHighestAmountWithinDeadlineAndAmountRangesParams{
		Title: fundingOpportunityTitle,
		DeadlineDate: pgStartDate,
		DeadlineDate_2: pgEndDate,
		TargetAmount: Numeric(minAmountFloat),
		TargetAmount_2: Numeric(maxAmountFloat),
	}

	fundingOpportunities, err := sql.GetFundingOpportunitiesByNameSortedByHighestAmountWithinDeadlineAndAmountRanges(context.Background(), dataParam)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "No funding opportunities were found."})
	}

	fmt.Println("fundingOpportunities: ", fundingOpportunities)

	return c.JSON(http.StatusOK, fundingOpportunities)
}

// Get all of the funding opportunities with titles that include the name/keywords inputted by the user, sorted by the lowest amount, between the minimum and maximum amounts and between the earliest and latest deadlines inputted
func GetFundingOpportunitiesByNameSortedByLowestAmount(c echo.Context) error {
	var fundingOpportunity FundingOpportunity

	fmt.Println()
	fmt.Println("GetFundingOpportunitiesByNameSortedByLowestAmount()")

	// Decode the incoming JSON request body
	err := c.Bind(&fundingOpportunity)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	fundingOpportunityTitle := "%" + fundingOpportunity.Title + "%"
	fmt.Println("fundingOpportunity.Title: ", fundingOpportunityTitle)

	startDate := c.QueryParam("startDate")
	endDate := c.QueryParam("endDate")

	// YYYY-MM-DD format
	layout := "2006-01-02"
	var parsedStartDate, parsedEndDate time.Time

	if startDate != "" {
		parsedStartDate, err = time.Parse(layout, startDate)
		if err != nil {
			e.Logger.Error(err)
			return c.JSON(http.StatusBadRequest, "Invalid startDate format")
		}
	}

	if endDate != "" {
		parsedEndDate, err = time.Parse(layout, endDate)
		if err != nil {
			e.Logger.Error(err)
			return c.JSON(http.StatusBadRequest, "Invalid endDate format")
		}
	}

	var pgStartDate, pgEndDate pgtype.Date

	pgStartDate.Time = parsedStartDate
	pgStartDate.Valid = true

	pgEndDate.Time = parsedEndDate
	pgEndDate.Valid = true

	minAmountFloat, err := strconv.ParseFloat(fundingOpportunity.MinAmount, 64)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")	
	}

	maxAmountFloat, err := strconv.ParseFloat(fundingOpportunity.MaxAmount, 64)
	if err != nil {
		e.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, "Error decoding the incoming JSON request body")
	}

	dataParam := queries.GetFundingOpportunitiesByNameSortedByLowestAmountWithinDeadlineAndAmountRangesParams{
		Title: fundingOpportunityTitle,
		DeadlineDate: pgStartDate,
		DeadlineDate_2: pgEndDate,
		TargetAmount: Numeric(minAmountFloat),
		TargetAmount_2: Numeric(maxAmountFloat),
	}

	fundingOpportunities, err := sql.GetFundingOpportunitiesByNameSortedByLowestAmountWithinDeadlineAndAmountRanges(context.Background(), dataParam)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "No funding opportunities were found."})
	}

	fmt.Println("fundingOpportunities: ", fundingOpportunities)

	return c.JSON(http.StatusOK, fundingOpportunities)
}