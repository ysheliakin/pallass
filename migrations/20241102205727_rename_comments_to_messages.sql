-- +goose Up
-- +goose StatementBegin
ALTER TABLE comments RENAME TO messages;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE messages RENAME TO comments;
-- +goose StatementEnd
