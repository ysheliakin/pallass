-- +goose Up
-- +goose StatementBegin
CREATE TABLE threads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL, -- title for thread
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    upvotes INTEGER DEFAULT 0,  -- # of upvotes for thread
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Date when the thread was created
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE threads;
-- +goose StatementEnd
