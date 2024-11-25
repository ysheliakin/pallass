-- +goose Up
-- +goose StatementBegin
ALTER TABLE threads
DROP CONSTRAINT fk_user_email;

ALTER TABLE threads
ADD CONSTRAINT fk_user_email FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE threads
DROP CONSTRAINT fk_user_email;
-- +goose StatementEnd
