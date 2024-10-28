-- +goose Up
-- +goose StatementBegin
ALTER TABLE users
RENAME COLUMN fieldOfStudy TO field_of_study;

ALTER TABLE users
RENAME COLUMN jobTitle TO job_title;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users
RENAME COLUMN field_of_study TO fieldOfStudy;

ALTER TABLE users
RENAME COLUMN job_title TO jobTitle;
-- +goose StatementEnd
