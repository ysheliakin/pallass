-- +goose Up
-- +goose StatementBegin
ALTER TABLE groups
ADD COLUMN groupUuid UUID DEFAULT gen_random_uuid();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE groups
DROP COLUMN groupUuid;
-- +goose StatementEnd
