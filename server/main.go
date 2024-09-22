package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"

	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)


func main() {

	fmt.Print("inside of main.go")
	host := "127.0.0.1:4201" 
	if err := http.ListenAndServe(host, httpHandler()); err != nil {
		fmt.Print("Failed to listen to " + host)
		log.Fatalf("Failed to listen on %s: %v", host, err)
	} else {
		fmt.Print("Listening to " + host)
	}

}

// httpHandler creates the backend HTTP router for queries, types, and serving the Angular frontend.
func httpHandler() http.Handler {

	fmt.Print("inside of httpHandler in Go")
	router := mux.NewRouter()
	
	// Post Handlers
	router.HandleFunc("/", createUser).Methods("POST")
	router.HandleFunc("/", createPost).Methods("POST")
	router.HandleFunc("/", createComment).Methods("POST")
	router.HandleFunc("/", addFlag).Methods("POST")
	router.HandleFunc("/", upVote).Methods("POST")
	router.HandleFunc("/", downVote).Methods("POST")


	// Get Handlers 
	router.HandleFunc("/", getPlaylist).Methods("GET")

	// Put Handlers 
	router.HandleFunc("/", editUser).Methods("PUT")
	router.HandleFunc("/", editPost).Methods("PUT")
	router.HandleFunc("/", editComment).Methods("PUT")



	// Delete Handlers
	router.HandleFunc("/", deletePost).Methods("DELETE") 
	router.HandleFunc("/", deleteComment).Methods("DELETE") 

	
	// WARNING: this route must be the last route defined.

	router.PathPrefix("/").Handler(AngularHandler).Methods("GET")

	 
	return handlers.LoggingHandler(os.Stdout,
		handlers.CORS(
			handlers.AllowCredentials(),
			handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization",
				"DNT", "Keep-Alive", "User-Agent", "X-Requested-With", "If-Modified-Since",
				"Cache-Control", "Content-Range", "Range"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}),
			handlers.AllowedOrigins([]string{"http://localhost:4200"}), 
			handlers.ExposedHeaders([]string{"DNT", "Kxeep-Alive", "User-Agent",
				"X-Requested-With", "If-Modified-Since", "Cache-Control",
				"Content-Type", "Content-Range", "Range", "Content-Disposition"}),
			handlers.MaxAge(86400),
		)(router))
}

func createUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userID"]
	username := vars["username"]
	name := vars["name"]
	university := vars["university"]
	email := vars["email"]

	//connect to PostgreSQL on localhost port ?????
	client, err := PostgreSQL.Connect(context.Background(), options.Client().ApplyURI("postgresql://localhost:?????"))
	if err != nil {
		return fmt.Errorf("Error connecting to PostgreSQL: %v", err)
	}
	defer client.Disconnect(context.Background())

	fmt.Fprintf(w, "You've added the user: %s with the following id %s and username %s\n", userID, username)
}

func editUser(w http.ResponseWriter, r *http.Request) {
	//connect to PostgreSQL on localhost port ?????
	client, err := PostgreSQL.Connect(context.Background(), options.Client().ApplyURI("postgresql://localhost:?????"))
	if err != nil {
		return fmt.Errorf("Error connecting to PostgreSQL: %v", err)
	}
	defer client.Disconnect(context.Background())

	fmt.Fprintf(w, "You've edited the user: %s with the following id %s and username %s\n", userID, username)

}

func createPost(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	postID := vars["postID"]
	postDate := vars["postDate"]
	editID := vars["editID"]
	userID := vars["userID"]
	title := vars["title"]
	description := vars["description"]
	rating := vars["rating"]

	//connect to PostgreSQL on localhost port ?????
	client, err := PostgreSQL.Connect(context.Background(), options.Client().ApplyURI("postgresql://localhost:?????"))
	if err != nil {
		return fmt.Errorf("Error connecting to PostgreSQL: %v", err)
	}
	defer client.Disconnect(context.Background())

	fmt.Fprintf(w, "You've added the post: %s with the following title %s and description %s\n", postID, title, description)
}

func editPost(w http.ResponseWriter, r *http.Request) {
	//connect to PostgreSQL on localhost port ?????
	client, err := PostgreSQL.Connect(context.Background(), options.Client().ApplyURI("postgresql://localhost:?????"))
	if err != nil {
		return fmt.Errorf("Error connecting to PostgreSQL: %v", err)
	}
	defer client.Disconnect(context.Background())

	fmt.Fprintf(w, "You've edited the post: %s with the following title %s and description %s\n", postID, title, description)
}

func deletePost(w http.ResponseWriter, r *http.Request) {
	//connect to PostgreSQL on localhost port ?????
	client, err := PostgreSQL.Connect(context.Background(), options.Client().ApplyURI("postgresql://localhost:?????"))
	if err != nil {
		return fmt.Errorf("Error connecting to PostgreSQL: %v", err)
	}
	defer client.Disconnect(context.Background())

	fmt.Fprintf(w, "You've deleted the post: %s with the following title %s and description %s\n", postID, title, description)
}

func createComment(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	commentID := vars["commentID"]
	body := vars["body"]
	editID := vars["editID"]
	sourceID := vars["sourceID"]
	postDate := vars["postDate"]

	//connect to PostgreSQL on localhost port ?????
	client, err := PostgreSQL.Connect(context.Background(), options.Client().ApplyURI("postgresql://localhost:?????"))
	if err != nil {
		return fmt.Errorf("Error connecting to PostgreSQL: %v", err)
	}
	defer client.Disconnect(context.Background())

	fmt.Fprintf(w, "You've added the comment: %s with the following body %s\n", commentID, body)
}

func editComment(w http.ResponseWriter, r *http.Request) {
	//connect to PostgreSQL on localhost port ?????
	client, err := PostgreSQL.Connect(context.Background(), options.Client().ApplyURI("postgresql://localhost:?????"))
	if err != nil {
		return fmt.Errorf("Error connecting to PostgreSQL: %v", err)
	}
	defer client.Disconnect(context.Background())

	fmt.Fprintf(w, "You've edited the comment: %s with the following body %s\n", commentID, body)
}

func deleteComment(w http.ResponseWriter, r *http.Request) {
	//connect to PostgreSQL on localhost port ?????
	client, err := PostgreSQL.Connect(context.Background(), options.Client().ApplyURI("postgresql://localhost:?????"))
	if err != nil {
		return fmt.Errorf("Error connecting to PostgreSQL: %v", err)
	}
	defer client.Disconnect(context.Background())

	fmt.Fprintf(w, "You've deleted the comment: %s with the following body %s\n", commentID, body)
}

func addFlag(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	flagID := vars["flagID"]
	flagType := vars["flagType"]
	creatorID := vars["creatorID"]
	details := vars["details"]
	creationDate := vars["creationDate"]

	//connect to PostgreSQL on localhost port ?????
	client, err := PostgreSQL.Connect(context.Background(), options.Client().ApplyURI("postgresql://localhost:?????"))
	if err != nil {
		return fmt.Errorf("Error connecting to PostgreSQL: %v", err)
	}
	defer client.Disconnect(context.Background())

	fmt.Fprintf(w, "You've added the flag: %s with the following details %s\n", flagID, details)
}

func upVote(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	voteID := vars["voteID"]
	voteType := vars["voteType"]
	commentID := vars["commentID"]
	userID := vars["userID"]

	//connect to PostgreSQL on localhost port ?????
	client, err := PostgreSQL.Connect(context.Background(), options.Client().ApplyURI("postgresql://localhost:?????"))
	if err != nil {
		return fmt.Errorf("Error connecting to PostgreSQL: %v", err)
	}
	defer client.Disconnect(context.Background())

	fmt.Fprintf(w, "You've upvoted the comment ID: %s that was posted by the following userID %s\n", commentID, userID)
}

func downVote(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	voteID := vars["voteID"]
	voteType := vars["voteType"]
	commentID := vars["commentID"]
	userID := vars["userID"]

	//connect to PostgreSQL on localhost port ?????
	client, err := PostgreSQL.Connect(context.Background(), options.Client().ApplyURI("postgresql://localhost:?????"))
	if err != nil {
		return fmt.Errorf("Error connecting to PostgreSQL: %v", err)
	}
	defer client.Disconnect(context.Background())

	fmt.Fprintf(w, "You've downvoted the comment ID: %s that was posted by the following userID %s\n", commentID, userID)
}



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

// AngularHandler loads angular assets
var AngularHandler = &httputil.ReverseProxy{Director: director}