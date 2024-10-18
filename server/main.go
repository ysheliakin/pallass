package main

import (
	"context"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	queries "sih/pallass/generated"

	"github.com/jackc/pgx/v5"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/crypto/bcrypt"
	"github.com/labstack/gommon/log"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
	"gopkg.in/gomail.v2"
	"fmt"
	"time"
	"math/rand"
)

var e *echo.Echo
var dbc context.Context
var sql *queries.Queries
var secretKey = []byte(os.Getenv("JWT_SECRET_KEY"))

type User struct {
    Firstname string `json:"firstname"`
    Lastname string `json:"lastname"`
    Email string `json:"email"`
    Password string `json:"password"`
    Organization string `json:"organization"`
    Fieldofstudy string `json:"fieldofstudy"`
    Jobtitle string `json:"jobtitle"`
	SocialLinks []string `json:"sociallinks"`
	TempCode string `json:"tempcode"`
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

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORS configuration
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
        AllowHeaders: []string{"*"},
	}))

	// Get Handlers
	e.GET("/playlist", func(c echo.Context) error {
		return c.String(http.StatusOK, "Here is the playlist")
	})
	e.GET("/authenticate", authenticate)

	// Post Handlers
	e.POST("/registeruser", registerUser)
	e.POST("/loginuser", loginUser)
	e.POST("/post", func(c echo.Context) error {
		return c.String(http.StatusOK, "Post created")
	})
	e.POST("/checkemail", checkEmail)
	e.POST("/request-reset", requestPasswordReset)
	e.POST("/reset-password", resetPassword)
	e.POST("/validate-code", validateResetCode)

	e.POST("/comment", func(c echo.Context) error {
		return c.String(http.StatusOK, "Comment created")
	})
	e.POST("/flag", func(c echo.Context) error {
		return c.String(http.StatusOK, "Flag added")
	})
	e.POST("/upvote", func(c echo.Context) error {
		return c.String(http.StatusOK, "Upvoted")
	})
	e.POST("/downvote", func(c echo.Context) error {
		return c.String(http.StatusOK, "Downvoted")
	})

	// Put Handlers
	e.PUT("/user", func(c echo.Context) error {
		return c.String(http.StatusOK, "User updated")
	})
	e.PUT("/post", func(c echo.Context) error {
		return c.String(http.StatusOK, "Post updated")
	})
	e.PUT("/comment", func(c echo.Context) error {
		return c.String(http.StatusOK, "Comment updated")
	})

	// Delete Handlers
	e.DELETE("/post", func(c echo.Context) error {
		return c.String(http.StatusOK, "Post deleted")
	})
	e.DELETE("/comment", func(c echo.Context) error {
		return c.String(http.StatusOK, "Comment deleted")
	})

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

// User registration
func registerUser(c echo.Context) error {
    var user User

    // Decode the incoming JSON request body
    err := c.Bind(&user); 
    if err != nil {
		log.Fatal("Invalid inputs")
    }

    _, err = sql.CheckUserExistsByEmail(context.Background(), user.Email) 
    if err != nil {
        return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Error creating an account"})
    }

	// Hash the password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
		log.Fatal("Error hashing password")
        return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Error creating an account"})
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
		Firstname: user.Firstname,
		Lastname: user.Lastname,
		Email: user.Email, 
		Password: user.Password, 
		Organization: organizationParam, 
		Fieldofstudy: user.Fieldofstudy, 
		Jobtitle: jobParam,
	}

    // Save the new user to the database using sqlc queries
    err = sql.CreateUser(context.Background(), userParams) 
    if err != nil {
        return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Error creating an account"})
    }

	// Insert social links if the user inputted any
	if len(user.SocialLinks) > 0 {
		for _, socialLink := range user.SocialLinks {
			if socialLink != "" {
				userSocialLinksParams := queries.InsertUserSocialLinkParams{
					UserEmail: user.Email,
					SocialLink: socialLink,
				}

				err = sql.InsertUserSocialLink(context.Background(), userSocialLinksParams)
				if err != nil {
					return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Error inserting the social link(s)"})
				}
			}
		}
	} 

    return c.JSON(http.StatusOK, RegisterResponse{Message: "Account successfully registered"})
}

// User login
func loginUser(c echo.Context) error {
	var user User

    // Decode the incoming JSON request body
	err := c.Bind(&user)
	if err != nil {
		log.Fatal("Invalid inputs")
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

	// Generate JWT token that expires in 1 hour
	claims := jwt.RegisteredClaims{ ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)) }
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token
	signedToken, err := token.SignedString(secretKey)
	if err != nil {
		log.Fatal(err)
	}

	// Return the signed token via a JSON response
    return c.JSON(http.StatusOK, map[string]string{"token": signedToken})
}

func authenticate(c echo.Context) error {
	// Get the bearer token
	bearerToken := c.Request().Header.Get("Authorization")
	if bearerToken == "" {
		return c.JSON(http.StatusUnauthorized, "No token")
	}

	// Remove the Bearer scheme from the bearer token string to only retrieve the token itself
	noBearerToken := bearerToken[len("Bearer "):]

	// Validate the token
	claims := &jwt.RegisteredClaims{}
	token, err := jwt.ParseWithClaims(noBearerToken, claims, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		log.Fatal(err)
	}
	
	if (!token.Valid) {
		log.Fatal("Invalid token")
	}

	return c.JSON(http.StatusOK, RegisterResponse{Message: "Successful authentication"})
}

func checkEmail(c echo.Context) error {
	var user User

    // Decode the incoming JSON request body
	err := c.Bind(&user)
	if err != nil {
		return c.JSON(http.StatusBadRequest, RegisterResponse{Message: "Invalid email"})
	}

	// Retrieve the user from the database
	accountExists, err := sql.GetUserByEmail(context.Background(), user.Email)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, RegisterResponse{Message: "Wrong email"})
	}
	if accountExists.Email == "" {
		return c.JSON(http.StatusUnauthorized, RegisterResponse{Message: "An account with this email address already exists."})
	}

	// Return the signed token via a JSON response
    return c.JSON(http.StatusOK, RegisterResponse{Message: "Successful email verification"})
}

// Send email containing the code to reset the password
func sendResetEmail(to, resetCode string) error {
	email := os.Getenv("GMAIL_USERNAME")
    password := os.Getenv("GMAIL_PASSWORD")

	if email == "" || password == "" {
        return fmt.Errorf("email credentials not set")
    }

    m := gomail.NewMessage()
    m.SetHeader("From", email)
    m.SetHeader("To", to)
    m.SetHeader("Subject", "Password Reset Request")
	body := "Verification code: <strong>" + resetCode + "</strong>"
    m.SetBody("text/html", body)

    d := gomail.NewDialer("smtp.gmail.com", 587, email, password)
    err := d.DialAndSend(m)
    if err != nil {
        return err
    }
    return nil
}

// Generate a code to reset the password
func GenerateResetCode(length int) string {
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
func requestPasswordReset(c echo.Context) error {
	var user User

	// Decode the incoming JSON request body
	err := c.Bind(&user)
	if err != nil {
		fmt.Println("Invalid inputs")
		return c.JSON(http.StatusBadRequest, RegisterResponse{Message: "Invalid inputs"})
	}

	fmt.Println("Email 0: ", user.Email)

    _, err =  sql.GetUserByEmail(context.Background(), user.Email)
    if err != nil {
		fmt.Println("User not found")
		return c.JSON(http.StatusNotFound, RegisterResponse{Message: "User not found"})
    }

	resetCode := GenerateResetCode(6)
    if len(resetCode) == 0 {
		fmt.Println("Unable to generate code")
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Unable to generate code"})
    }

	storedResetCode := storeResetCode(resetCode, user.Email)
	
	fmt.Println("resetCode: ", resetCode)
	fmt.Println("storedResetCode: ", storedResetCode)
	
	if storedResetCode == resetCode || storedResetCode == "" {
		fmt.Println("Error storing the code")
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Error storing the code"})
	}

    if err := sendResetEmail(user.Email, resetCode); err != nil {
		fmt.Printf("Could not send email: %v\n", err)
		return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Could not send email"})
	}
	
    return c.JSON(http.StatusOK, map[string]string{"code": resetCode})
}

// Store the code
func storeResetCode(code string, email string) string {
	var user User

	fmt.Println("")
	fmt.Println("storeResetCode()")
	fmt.Println("code: ", code)

	// Hash the code
	hashedCode, err := bcrypt.GenerateFromPassword([]byte(code), bcrypt.DefaultCost)
	if err != nil {
		return "Could not retrieve the generated code";
	}
	user.TempCode = string(hashedCode)

	fmt.Println("user.TempCode: ", user.TempCode)

	var tempCodeParam = pgtype.Text{String: user.TempCode, Valid: true}

	user.Email = email

	fmt.Println("tempCodeParam: ", tempCodeParam)
	fmt.Println("user.Email: ", user.Email) // Doesn't get the email

	userParams := queries.UpdateUserCodeByEmailParams{
		TempCode: tempCodeParam,
		Email: user.Email,
	}

	fmt.Println("userParams: ", userParams)

	// Add a temporary code to the user table where the email address equals that of a user row
	err = sql.UpdateUserCodeByEmail(context.Background(), userParams); 
	if err != nil {
		return "Error creating an account"
	}

	tempCodeStr := tempCodeParam.String;

	return tempCodeStr;
}

// Reset the password
func resetPassword(c echo.Context) error {
    var user User

    // Decode the incoming JSON request body
    err := c.Bind(&user); 
    if err != nil {
        return c.JSON(http.StatusBadRequest, RegisterResponse{Message: "Invalid inputs"})
    }

	fmt.Println("Password (resetPassword): ", user.Password)

	// Hash the password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Error hashing password"})
    }
    user.Password = string(hashedPassword)

	userParams := queries.UpdateUserPasswordByEmailParams{
		Password: user.Password,
		Email: user.Email,
	}

	fmt.Println("Email (resetPassword): ", user.Email)

    // Update the user's password in the database
    err = sql.UpdateUserPasswordByEmail(context.Background(), userParams);
	if err != nil {
        return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Could not reset password"})
    }

	err = sql.RemoveCodeByEmail(context.Background(), user.Email);
	if err != nil {
		fmt.Println("Could not remove the reset code")
        return c.JSON(http.StatusInternalServerError, RegisterResponse{Message: "Could not remove the reset code"})
    }

    return c.JSON(http.StatusOK, RegisterResponse{Message: "Password reset successfully"})
}

func validateResetCode(c echo.Context) error {
	var user User

	fmt.Println("")
	fmt.Println("validateResetCode()")

    // Decode the incoming JSON request body
	err := c.Bind(&user)
	if err != nil {
		fmt.Println("Invalid code")
		return c.JSON(http.StatusBadRequest, RegisterResponse{Message: "Invalid code"})
	}

	fmt.Println("Email: ", user.Email)
	fmt.Println("user.TempCode: ", user.TempCode)

	// Retrieve the user from the database
	dbUser, err := sql.GetUserByEmail(context.Background(), user.Email)
	if err != nil {
		fmt.Println("Wrong email")
		return c.JSON(http.StatusUnauthorized, RegisterResponse{Message: "Wrong email"})
	}

	fmt.Println("dbUser.TempCode: ", dbUser.TempCode)

	tempCodeStr := (dbUser.TempCode).String

	fmt.Println("tempCodeStr: ", tempCodeStr)

	// Compare the code inputted by the user with the hashed code in the database
	err = bcrypt.CompareHashAndPassword([]byte(tempCodeStr), []byte(user.TempCode))
	if err != nil {
		fmt.Println("Wrong code")
		return c.JSON(http.StatusUnauthorized, RegisterResponse{Message: "Wrong code"})
	}

	fmt.Println("Successful code verification")

	// Return the signed token via a JSON response
    return c.JSON(http.StatusOK, RegisterResponse{Message: "Successful code verification"})
}
