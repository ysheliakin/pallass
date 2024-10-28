-- +goose Up
-- +goose StatementBegin
ALTER TABLE users
ALTER COLUMN temp_code TYPE VARCHAR(255);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users
ALTER COLUMN temp_code TYPE VARCHAR(100);
-- +goose StatementEnd
