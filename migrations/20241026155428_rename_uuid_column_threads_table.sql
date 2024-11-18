-- +goose Up
-- +goose StatementBegin
ALTER TABLE threads
RENAME COLUMN groupUuid TO threadUuid;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE threads
RENAME COLUMN threadUuid TO groupUuid;
-- +goose StatementEnd
