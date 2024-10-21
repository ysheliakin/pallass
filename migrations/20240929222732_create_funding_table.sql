-- +goose Up
-- +goose StatementBegin
CREATE TABLE funding_opportunities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,  -- Title of the funding opportunity
    description TEXT NOT NULL,      
    target_amount DECIMAL(15, 2) NOT NULL,  -- Target amount for the funding
    link VARCHAR(255),              -- URL link to the funding opportunity
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date when the opportunity was created
    deadline_date DATE              -- Deadline for the funding opportunity
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE funding_opportunities;
-- +goose StatementEnd
