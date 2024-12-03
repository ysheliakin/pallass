-- +goose Up
-- +goose StatementBegin
CREATE TABLE group_messages (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    group_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    group_message_id INT,
    FOREIGN KEY (group_message_id) REFERENCES group_messages(id) ON DELETE CASCADE,
    reply BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE group_messages;
-- +goose StatementEnd
