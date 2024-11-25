-- +goose Up
-- +goose StatementBegin
ALTER TABLE threads
    DROP COLUMN firstname,
    DROP COLUMN lastname;

ALTER TABLE threads
    ADD COLUMN user_email VARCHAR(100);

ALTER TABLE threads
    ADD CONSTRAINT fk_user_email FOREIGN KEY (user_email) REFERENCES users(email);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE threads
    DROP CONSTRAINT fk_user_email;

ALTER TABLE threads
    DROP COLUMN user_email;

ALTER TABLE threads
    ADD COLUMN firstname VARCHAR(100),
    ADD COLUMN lastname VARCHAR(100);
-- +goose StatementEnd
