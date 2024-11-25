-- +goose Up
-- +goose StatementBegin
ALTER TABLE thread_upvotes
ADD COLUMN user_email VARCHAR(100) NOT NULL REFERENCES users(email) ON DELETE CASCADE;

ALTER TABLE thread_upvotes
DROP COLUMN user_id;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE thread_upvotes
ADD COLUMN user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE;

-- In case the table already contains rows 
UPDATE thread_upvotes
SET user_id = users.id
FROM users
WHERE thread_upvotes.user_email = users.email;

ALTER TABLE thread_upvotes
DROP COLUMN user_email;
-- +goose StatementEnd
