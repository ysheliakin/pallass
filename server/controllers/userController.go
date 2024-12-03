package controller

import (
	"context"
	"net/http"
	"os"

	queries "sih/pallass/generated"

	"fmt"
	"github.com/golang-jwt/jwt/v4"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
	"math/rand"
	"time"
)

var secretKey = []byte(os.Getenv("JWT_SECRET_KEY"))

// User registration
func RegisterUser(c echo.Context) error {
	var user User

	fmt.Println("RegisterUser")

	// Decode the incoming JSON request body
	err := c.Bind(&user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Invalid inputs. Please enter valid inputs."})
	}

	if user.Firstname == "" || user.Lastname == "" || user.Email == "" || user.Password == "" || user.Fieldofstudy == "" {
		return c.JSON(http.StatusUnauthorized, RegisterResponse{Message: "We were unable to create your account. Please fill out every required field."})
	}

	// Check if the email inputted by the user is already stored in the database
	result, err := sql.CheckUserExistsByEmail(context.Background(), user.Email)
	if err == nil && result == 1 {
		return c.JSON(http.StatusUnauthorized, RegisterResponse{Message: "An account with this email address already exists."})
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Error("Error hashing password")
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "We were unable to create your account. Please check your information and try again."})
	}
	user.Password = string(hashedPassword)

	// Check if the user inputted an organization or not
	var organizationParam pgtype.Text
	if user.Organization != "" {
		organizationParam = pgtype.Text{String: user.Organization, Valid: true}
	} else {
		organizationParam = pgtype.Text{Valid: false}
	}

	// Check if the user inputted a job title or not
	var jobParam pgtype.Text
	if user.Jobtitle != "" {
		jobParam = pgtype.Text{String: user.Jobtitle, Valid: true}
	} else {
		jobParam = pgtype.Text{Valid: false}
	}

	userParams := queries.CreateUserParams{
		Firstname:    user.Firstname,
		Lastname:     user.Lastname,
		Email:        user.Email,
		Password:     user.Password,
		Organization: organizationParam,
		FieldOfStudy: user.Fieldofstudy,
		JobTitle:     jobParam,
	}

	// Save the new user to the database using sqlc queries
	err = sql.CreateUser(context.Background(), userParams)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "We were unable to create your account. Please check your information and try again."})
	}

	// Insert social links if the user inputted any
	if len(user.SocialLinks) > 0 {
		for _, socialLink := range user.SocialLinks {
			if socialLink != "" {
				userSocialLinksParams := queries.InsertUserSocialLinkParams{
					UserEmail:  user.Email,
					SocialLink: socialLink,
				}

				err = sql.InsertUserSocialLink(context.Background(), userSocialLinksParams)
				if err != nil {
					return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "There was an issue adding your link(s). Please verify your link(s) and try again."})
				}
			}
		}
	}

	return c.JSON(http.StatusOK, RegisterResponse{Message: "Account successfully registered"})
}

// User login
func LoginUser(c echo.Context) error {
	var user LogInUser

	// Decode the incoming JSON request body
	err := c.Bind(&user)
	if err != nil {
		log.Error(err)
		return c.JSON(http.StatusInternalServerError, ErrorPayload{Error: err.Error()})
	}

	// Retrieve the user from the database
	dbUser, err := sql.GetUserByEmail(context.Background(), user.Email)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, RegisterResponse{Message: "Incorrect email or password."})
	}

	// Compare the password inputted by the user with the hashed password stored in the database
	err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password))
	if err != nil {
		return c.JSON(http.StatusUnauthorized, RegisterResponse{Message: "Incorrect email or password."})
	}

	// Generate JWT token for the suer that expires in 24 hours
	claims := jwt.MapClaims{
		"email": dbUser.Email,
		"exp":   jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token
	signedToken, err := token.SignedString(secretKey)
	if err != nil {
		log.Error(err)
		return c.JSON(http.StatusUnauthorized, RegisterResponse{Message: "Invalid token"})
	}

	// Return the user and signed token via a JSON response
	return c.JSON(http.StatusOK, User{
		ID:           dbUser.ID,
		Firstname:    dbUser.Firstname,
		Lastname:     dbUser.Lastname,
		Email:        dbUser.Email,
		Organization: dbUser.Organization.String,
		Token:        signedToken,
		Jobtitle:     dbUser.JobTitle.String,
		Fieldofstudy: dbUser.FieldOfStudy,
	})
}

func Authenticate(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		fmt.Println("Authenticate()")

		// Get the bearer token
		bearerToken := c.Request().Header.Get("Authorization")
		if bearerToken == "" {
			fmt.Println("No token")
			return c.JSON(http.StatusUnauthorized, "No token")
		}

		// Remove the Bearer scheme from the bearer token string to only retrieve the token itself
		noBearerToken := bearerToken[len("Bearer "):]

		// Validate the token
		claims := &jwt.RegisteredClaims{}
		token, err := jwt.ParseWithClaims(noBearerToken, claims, func(token *jwt.Token) (interface{}, error) {
			return secretKey, nil
		})
		if err != nil || !token.Valid {
			log.Error(err)
			log.Error("Or the token is invalid")
			return c.JSON(http.StatusUnauthorized, "Invalid token")
		}

		fmt.Println("Token is valid, proceeding to next handler.")
		return next(c)
	}
}

// Send email containing the code to reset the password
func SendPasswordResetEmail(to, resetCode string) error {
	email := os.Getenv("GMAIL_USERNAME")
	password := os.Getenv("GMAIL_PASSWORD")

	if email == "" || password == "" {
		return fmt.Errorf("email credentials not set")
	}

	m := gomail.NewMessage()
	m.SetHeader("From", email)
	m.SetHeader("To", to)
	m.SetHeader("Subject", "Password Reset Request")
	body := "Password reset code: <strong>" + resetCode + "</strong>"
	m.SetBody("text/html", body)

	d := gomail.NewDialer("smtp.gmail.com", 587, email, password)
	err := d.DialAndSend(m)
	if err != nil {
		return err
	}
	return nil
}

// Generate a code to reset the password
func GenerateCode(length int) string {
	// Create a random number generator
	randomNumberGenerator := rand.New(rand.NewSource(time.Now().UnixNano()))
	// Give the range of possible values for each digit
	digitRange := "0123456789"

	// Create the code that will contain the digits
	code := make([]byte, length)

	for i := 0; i < len(code); i++ {
		code[i] = digitRange[randomNumberGenerator.Intn(len(digitRange))]
	}

	return string(code)
}

// Request password reset
func RequestPasswordReset(c echo.Context) error {
	var user User

	// Decode the incoming JSON request body
	err := c.Bind(&user)
	if err != nil {
		fmt.Println("Invalid inputs")
		return c.JSON(http.StatusBadRequest, RegisterResponse{Message: "Invalid inputs."})
	}

	_, err = sql.GetUserByEmail(context.Background(), user.Email)
	if err != nil {
		return c.JSON(http.StatusNotFound, RegisterResponse{Message: "The email you entered is not associated with an account."})
	}

	resetCode := GenerateCode(6)
	if len(resetCode) == 0 {
		fmt.Println("Unable to generate code")
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "An error occurred trying to generate the password reset code."})
	}

	storedResetCode := StoreResetCode(resetCode, user.Email)

	if storedResetCode == resetCode || storedResetCode == "" {
		fmt.Println("Error storing the code")
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "An error occurred trying to store the code."})
	}

	if err := SendPasswordResetEmail(user.Email, resetCode); err != nil {
		fmt.Printf("Could not send email: %v\n", err)
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "An error occurred trying to send the email."})
	}

	return c.JSON(http.StatusOK, map[string]string{"code": resetCode})
}

// Store the code
func StoreResetCode(code string, email string) string {
	var user User

	fmt.Println("storeResetCode()")

	// Hash the code
	hashedCode, err := bcrypt.GenerateFromPassword([]byte(code), bcrypt.DefaultCost)
	if err != nil {
		return "Could not retrieve the generated code"
	}
	user.TempCode = string(hashedCode)

	var tempCodeParam = pgtype.Text{String: user.TempCode, Valid: true}

	user.Email = email

	userParams := queries.UpdateUserCodeByEmailParams{
		TempCode: tempCodeParam,
		Email:    user.Email,
	}

	// Add a temporary code to the user table where the email address equals that of a user row
	err = sql.UpdateUserCodeByEmail(context.Background(), userParams)
	if err != nil {
		return "Error creating an account"
	}

	tempCodeStr := tempCodeParam.String

	return tempCodeStr
}

// Reset the password
func ResetPassword(c echo.Context) error {
	var user User

	// Decode the incoming JSON request body
	err := c.Bind(&user)
	if err != nil {
		return c.JSON(http.StatusBadRequest, RegisterResponse{Message: "Invalid password."})
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "An error occurred tryin to reset your password."})
	}
	user.Password = string(hashedPassword)

	userParams := queries.UpdateUserPasswordByEmailParams{
		Password: user.Password,
		Email:    user.Email,
	}

	// Update the user's password in the database
	err = sql.UpdateUserPasswordByEmail(context.Background(), userParams)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "An error occurred tryin to reset your password."})
	}

	err = sql.RemoveCodeByEmail(context.Background(), user.Email)
	if err != nil {
		fmt.Println("Could not remove the reset code")
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Your password was reset. But an error occurred trying to remove the password reset code associated with your email address."})
	}

	return c.JSON(http.StatusOK, RegisterResponse{Message: "Password reset successfully"})
}

func ValidateResetCode(c echo.Context) error {
	var user User

	fmt.Println("")
	fmt.Println("validateResetCode()")

	// Decode the incoming JSON request body
	err := c.Bind(&user)
	if err != nil {
		fmt.Println("Invalid code")
		return c.JSON(http.StatusBadRequest, RegisterResponse{Message: "Invalid code."})
	}

	// Retrieve the user from the database
	dbUser, err := sql.GetUserByEmail(context.Background(), user.Email)
	if err != nil {
		fmt.Println("Wrong email")
		return c.JSON(http.StatusUnauthorized, RegisterResponse{Message: "An error occurred while verifying the code you entered."})
	}

	tempCodeStr := (dbUser.TempCode).String

	// Compare the code inputted by the user with the hashed code in the database
	err = bcrypt.CompareHashAndPassword([]byte(tempCodeStr), []byte(user.TempCode))
	if err != nil {
		fmt.Println("Wrong code")
		return c.JSON(http.StatusUnauthorized, RegisterResponse{Message: "The code you entered is incorrect."})
	}

	fmt.Println("Successful code verification")

	// Return the signed token via a JSON response
	return c.JSON(http.StatusOK, RegisterResponse{Message: "Successful code verification"})
}

func GetUserProfile(c echo.Context) error {
	fmt.Println("GetUserProfile")

	userEmail := c.Param("email")

	userData, err := sql.GetUserAndSocialLinksByEmail(context.Background(), userEmail)
	if err != nil {
		fmt.Println("Error getting the user's profile")
		return c.JSON(http.StatusUnauthorized, RegisterResponse{Message: "Error getting the user's profile"})
	}

	return c.JSON(http.StatusOK, userData)
}

// UserController handles user-related actions
func UserController(c echo.Context) error {
	return c.String(http.StatusOK, "User created")
}

// UpdateUserController handles user updates
func UpdateUserController(c echo.Context) error {
	return c.String(http.StatusOK, "User updated")
}

func EditProfile(c echo.Context) error {
	fmt.Println()
	fmt.Println("EditProfile")

	var user User

	// Decode the incoming JSON request body
	err := c.Bind(&user)
	if err != nil {
		fmt.Println("Invalid code")
		return c.JSON(http.StatusBadRequest, RegisterResponse{Message: "Invalid code."})
	}

	fmt.Println("JSON decoding successful")

	if user.Email == "" || user.Fieldofstudy == "" {
		return c.JSON(http.StatusUnauthorized, RegisterResponse{Message: "We were unable to create your account. Please fill out every required field."})
	}

	// Check if the user inputted an organization or not
	var organizationParam pgtype.Text
	if user.Organization != "" {
		organizationParam = pgtype.Text{String: user.Organization, Valid: true}
	} else {
		organizationParam = pgtype.Text{Valid: false}
	}

	// Check if the user inputted a job title or not
	var jobParam pgtype.Text
	if user.Jobtitle != "" {
		jobParam = pgtype.Text{String: user.Jobtitle, Valid: true}
	} else {
		jobParam = pgtype.Text{Valid: false}
	}

	if user.Password == "" {
		userParams := queries.UpdateUserExcludingPasswordParams{
			Organization: organizationParam,
			FieldOfStudy: user.Fieldofstudy,
			JobTitle:     jobParam,
			Email:        user.Email,
		}

		// Save the new user to the database using sqlc queries
		err = sql.UpdateUserExcludingPassword(context.Background(), userParams)
		if err != nil {
			fmt.Println("We were unable to create your profile. Please check your information and try again.")
			return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "We were unable to create your profile. Please check your information and try again."})
		}
	} else {
		// Hash the password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Error("Error hashing password")
			return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "We were unable to create your account. Please check your information and try again."})
		}
		user.Password = string(hashedPassword)

		userParams := queries.UpdateUserParams{
			Password:     user.Password,
			Organization: organizationParam,
			FieldOfStudy: user.Fieldofstudy,
			JobTitle:     jobParam,
			Email:        user.Email,
		}

		// Save the new user to the database using sqlc queries
		err = sql.UpdateUser(context.Background(), userParams)
		if err != nil {
			fmt.Println("We were unable to create your profile. Please check your information and try again.")
			return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "We were unable to create your profile. Please check your information and try again."})
		}
	}

	err = sql.DeleteSocialLinks(context.Background(), user.Email)
	if err != nil {
		fmt.Println("We were unable to delete your social links.")
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "We were unable to delete your social links."})
	}

	// Insert social links if the user inputted any
	if len(user.SocialLinks) > 0 {
		for _, socialLink := range user.SocialLinks {
			if socialLink != "" {
				userSocialLinksParams := queries.InsertUserSocialLinkParams{
					UserEmail:  user.Email,
					SocialLink: socialLink,
				}

				err = sql.InsertUserSocialLink(context.Background(), userSocialLinksParams)
				if err != nil {
					fmt.Println("There was an issue adding your link(s). Please verify your link(s) and try again.")
					return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "There was an issue adding your link(s). Please verify your link(s) and try again."})
				}
			}
		}
	}

	fmt.Println("Account successfully registered")
	return c.JSON(http.StatusOK, RegisterResponse{Message: "Account successfully registered"})
}
