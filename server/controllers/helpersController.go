package controller

import (
	"encoding/json"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/labstack/echo/v4"
)

func GetBody(c echo.Context) echo.Map {
	body := make(map[string]interface{})
	err := json.NewDecoder(c.Request().Body).Decode(&body)
	if err != nil {
		return nil
	}
	return body
}

func Numeric(number float64) pgtype.Numeric {
	parse := strconv.FormatFloat(number, 'f', -1, 64)
	var ret pgtype.Numeric
	ret.Scan(parse)
	return ret
}

func NumericNull() pgtype.Numeric {
	return pgtype.Numeric{
		Int:              nil,
		Exp:              0,
		NaN:              false,
		InfinityModifier: 0,
		Valid:            false,
	}
}

func Text(value string) pgtype.Text {
	if value == "" {
		return pgtype.Text{}
	}
	return pgtype.Text{String: value, Valid: true}
}

func Date(value string) pgtype.Date {
	val, err := time.Parse(time.RFC3339, value)
	if err != nil {
		return pgtype.Date{}
	}
	return pgtype.Date{Time: val, Valid: true}
}
