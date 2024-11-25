-- +goose Up
-- +goose StatementBegin
ALTER TABLE threads DROP COLUMN upvotes;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE threads ADD COLUMN upvotes INTEGER DEFAULT 0;
-- +goose StatementEnd
