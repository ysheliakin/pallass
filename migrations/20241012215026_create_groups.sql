-- +goose Up
-- +goose StatementBegin
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,             
    description TEXT,                        
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,  
    created_by INTEGER REFERENCES users(id) NOT NULL  
);

CREATE TABLE group_members (
    id SERIAL PRIMARY KEY,                   -- Auto-increment primary key
    group_id INTEGER REFERENCES groups(id) NOT NULL,  -- Group ID is required
    user_id INTEGER REFERENCES users(id) NOT NULL,    -- User ID is required
    role VARCHAR(20) DEFAULT 'member' NOT NULL,  -- Role defaults to 'member', so NOT NULL
    joined_at TIMESTAMP DEFAULT NOW() NOT NULL   -- Auto-generated timestamp, so NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
