-- +goose Up
-- +goose StatementBegin
ALTER TABLE groups
DROP COLUMN created_by;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE groups
DROP COLUMN created_by;
-- +goose StatementEnd
