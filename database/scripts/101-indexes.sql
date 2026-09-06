create index if not exists idx_electricity_date on electricitydata using btree(date);
create index if not exists idx_electricity_startTime on electricitydata using btree(startTime);