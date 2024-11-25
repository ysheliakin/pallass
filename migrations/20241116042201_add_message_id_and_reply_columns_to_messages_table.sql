-- +goose Up
-- +goose StatementBegin
ALTER TABLE messages
ADD COLUMN message_id INTEGER,
ADD COLUMN reply BOOLEAN DEFAULT FALSE,
ADD CONSTRAINT fk_message_id FOREIGN KEY (message_id)
REFERENCES messages (id) ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE messages
DROP CONSTRAINT fk_message_id;

ALTER TABLE messages
DROP COLUMN message_id,
DROP COLUMN reply;
-- +goose StatementEnd
