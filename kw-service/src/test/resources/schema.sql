drop table if exists electricityData;

create table electricityData (
    id bigint primary key,
    date date,
    startTime timestamp,
    productionAmount numeric(11,5),
    consumptionAmount numeric(11,3),
    hourlyPrice numeric(6,3)
);

create index if not exists idx_electricity_date on electricitydata using btree(date);
create index if not exists idx_electricity_startTime on electricitydata using btree(startTime);
