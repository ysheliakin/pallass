-- +goose Up
-- +goose StatementBegin
create table sample_table (id int);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
drop table sample_table;
-- +goose StatementEnd
