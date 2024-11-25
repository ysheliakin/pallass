-- +goose Up
-- +goose StatementBegin
ALTER TABLE groups
DROP CONSTRAINT fk_user_email;

ALTER TABLE groups
DROP COLUMN user_email;

ALTER TABLE group_members
DROP CONSTRAINT group_members_user_id_fkey;

ALTER TABLE group_members
DROP COLUMN user_id;

ALTER TABLE group_members
ADD COLUMN user_email VARCHAR(100),
ADD CONSTRAINT fk_user_email FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE groups
ADD COLUMN user_email VARCHAR(100),
ADD CONSTRAINT fk_user_email FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE;

ALTER TABLE group_members
DROP CONSTRAINT fk_user_email;

ALTER TABLE group_members
DROP COLUMN user_email;

ALTER TABLE group_members
ADD COLUMN user_id
ADD CONSTRAINT group_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- +goose StatementEnd
