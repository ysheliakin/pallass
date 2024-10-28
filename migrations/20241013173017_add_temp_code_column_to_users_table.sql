-- +goose Up
-- +goose StatementBegin
ALTER TABLE users 
ADD COLUMN temp_code VARCHAR(100) UNIQUE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users DROP COLUMN temp_code;
-- +goose StatementEnd
