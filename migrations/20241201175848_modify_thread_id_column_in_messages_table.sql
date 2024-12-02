-- +goose Up
-- +goose StatementBegin
ALTER TABLE messages
DROP CONSTRAINT comments_thread_id_fkey;

ALTER TABLE messages
ADD CONSTRAINT fk_thread_id FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE messages
DROP CONSTRAINT fk_thread_id;

ALTER TABLE messages
ADD CONSTRAINT comments_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES threads(id);
-- +goose StatementEnd
