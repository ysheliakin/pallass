-- +goose Up
-- +goose StatementBegin
ALTER TABLE groups
ADD COLUMN user_email VARCHAR(100),
ADD CONSTRAINT fk_user_email FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE groups
DROP CONSTRAINT fk_user_email;

ALTER TABLE groups
DROP COLUMN user_email;
-- +goose StatementEnd
