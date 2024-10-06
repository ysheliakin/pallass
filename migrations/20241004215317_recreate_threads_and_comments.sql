-- +goose Up
-- +goose StatementBegin
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS threads;

CREATE TABLE threads (
    id SERIAL PRIMARY KEY,             -- Unique identifier for each thread
    firstname VARCHAR(100) NOT NULL,   --Added names
    lastname VARCHAR(100) NOT NULL,     
    title VARCHAR(100) NOT NULL,       
    content TEXT NOT NULL,            
    category VARCHAR(100) NOT NULL,     
    upvotes INTEGER DEFAULT 0,          -- Number of likes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,              -- Unique identifier for each comment
    firstname VARCHAR(100) NOT NULL,    --Added names
    lastname VARCHAR(100) NOT NULL,      
    thread_id INT NOT NULL,              
    content TEXT NOT NULL,              
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (thread_id) REFERENCES threads(id) -- Foreign key constraint
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE threads;
DROP TABLE comments;
-- +goose StatementEnd
