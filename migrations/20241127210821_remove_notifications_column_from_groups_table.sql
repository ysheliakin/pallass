-- +goose Up
-- +goose StatementBegin
ALTER TABLE groups
DROP COLUMN notifications;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE groups
ADD COLUMN notifications;
-- +goose StatementEnd
