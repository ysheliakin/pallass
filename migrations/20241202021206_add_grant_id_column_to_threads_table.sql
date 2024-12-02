-- +goose Up
-- +goose StatementBegin
ALTER TABLE threads
ADD COLUMN funding_opportunity_id INT,
ADD CONSTRAINT fk_funding_opportunity_id FOREIGN KEY (funding_opportunity_id) REFERENCES funding_opportunities(id) ON DELETE SET NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE threads
DROP CONSTRAINT fk_funding_opportunity_id,
DROP COLUMN funding_opportunity_id;
-- +goose StatementEnd
