-- +goose Up
-- +goose StatementBegin
 CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     firstname VARCHAR(100) NOT NULL,
     lastname VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     organization VARCHAR(100),
     fieldOfStudy VARCHAR(100) NOT NULL,
     jobTitle VARCHAR(100),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE users;
-- +goose StatementEnd