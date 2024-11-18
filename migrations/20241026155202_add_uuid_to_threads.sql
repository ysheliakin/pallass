-- +goose Up
-- +goose StatementBegin
ALTER TABLE threads
ADD COLUMN groupUuid UUID DEFAULT gen_random_uuid();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE threads
DROP COLUMN groupUuid;
-- +goose StatementEnd
