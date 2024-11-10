-- +goose Up
-- +goose StatementBegin
ALTER TABLE groups
ADD COLUMN public BOOLEAN DEFAULT FALSE,
ADD COLUMN notifications BOOLEAN DEFAULT FALSE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE groups
DROP COLUMN privacy_setting,
DROP COLUMN notifications;
-- +goose StatementEnd
