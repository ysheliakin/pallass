-- +goose Up
-- +goose StatementBegin
CREATE TABLE account_verification_codes (
    id SERIAL PRIMARY KEY,
    account_verification_code VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE account_verification_codes;
-- +goose StatementEnd
