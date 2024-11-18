-- +goose Up
-- +goose StatementBegin
ALTER TABLE threads
RENAME COLUMN threadUuid TO uuid;

ALTER TABLE groups
RENAME COLUMN groupUuid TO uuid;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE threads
RENAME COLUMN uuid TO threadUuid;

ALTER TABLE groups
RENAME COLUMN uuid TO groupUuid;
-- +goose StatementEnd
