-- +goose Up
-- +goose StatementBegin
ALTER TABLE group_members
DROP CONSTRAINT group_members_group_id_fkey;

ALTER TABLE group_members
ADD CONSTRAINT fk_group_id FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE group_members
DROP CONSTRAINT fk_group_id;

ALTER TABLE group_members
ADD CONSTRAINT group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES groups(id);
-- +goose StatementEnd
