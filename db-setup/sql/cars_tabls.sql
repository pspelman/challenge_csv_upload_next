DROP TABLE IF EXISTS test;
CREATE TABLE test
(
    id   serial,
    data jsonb
);
INSERT INTO test(data)
values ('{
  "name": "my-name",
  "tags": [
    "tag1",
    "tag2"
  ]
}');
-- Update statement to change jsonb value;

UPDATE test
SET data = replace(data::TEXT, ': "my-name"', ': "my-other-name"')::jsonb
WHERE id = 1;

drop table make cascade;
create table make
(
    id   serial       not null,
    name varchar(100) not null,
    constraint make_pk
        unique (id)
);

comment on table make is 'makes of various cars';

create unique index make_id_uindex
    on make (id);

create unique index make_name_uindex
    on make (name);

alter table make
    add constraint make_pk_2
        primary key (name);

DROP TABLE model;
create table model
(
    id      serial      not null
        constraint model_pk
            primary key,
    name    varchar(64) not null,
    make_id serial
        constraint model_make_id_fk
            references make (id)
);

DROP TABLE car;
create table car
(
    id        SERIAL,
    slug      varchar(128),
    make      varchar(100) not null,
    model     varchar(100) not null,
    mileage   integer,
    year      smallint,
    price     decimal(12, 2),
    vin       varchar(17),
    zip       varchar(32),
    updated   DATE,
    created   DATE NOT NULL DEFAULT CURRENT_DATE,
    extId     varchar(256),
    custom    varchar default '{}'::character varying,
    make_id   integer,
    model_id  integer,
    dealer_id integer
);
--     extId jsonb default '{}',
-- alter table car
-- 	add "extId" jsonb default '{}';

DROP TABLE dealer;
create table dealer
(
    id     serial       not null,
    name   varchar(256) not null,
    config jsonb default '{}',
    url    varchar(256)
);

create unique index dealer_id_uindex
    on dealer (id);

alter table dealer
    add constraint dealer_pk
        primary key (id);

-- INSERT INTO dealer(name, config)  values ('South Hills Subaru', '{
-- 	"dbMap": {
-- 		"allHeaders": ["UUID", "YEAR", "themake", "big_model", "MILEAGE", "YEAR", "PRICE", "ZIP CODE", "UPDATE DATE", "CREATE DATE"],
-- 		"UUID": "car.extId",
-- 		"YEAR": "car.year",
-- 		"MAKE": "car.make",
-- 		"MODEL": "car.model",
-- 		"MILEAGE": "car.mileage",
-- 		"PRICE": "car.price",
-- 		"ZIP CODE": "car.zip",
-- 		"UPDATE DATE": "car.updated",
-- 		"CREATE DATE": "car.created"
-- 	}
-- }');
--
-- INSERT INTO dealer(name, config)  values ('BMW of SEATTLE', '{
-- 	"dbMap": {
-- 		"allHeaders": ["UUID", "YEAR", "MAKE", "MODEL", "MILEAGE", "YEAR", "PRICE", "ZIP CODE", "UPDATE DATE", "CREATE DATE"],
-- 		"UUID": "car.extId",
-- 		"YEAR": "car.year",
-- 		"MAKE": "car.make",
-- 		"MODEL": "car.model",
-- 		"MILEAGE": "car.mileage",
-- 		"PRICE": "car.price",
-- 		"ZIP CODE": "car.zip",
-- 		"UPDATE DATE": "car.updated",
-- 		"CREATE DATE": "car.created"
-- 	}
-- }');
--
-- INSERT INTO dealer(name, config)  values ('BMW of SEATTLE', '{
-- 	"dbMap": {
-- 		"allHeaders": ["UUID", "YEAR", "MAKE", "MODEL", "MILEAGE", "YEAR", "PRICE", "ZIP CODE", "UPDATE DATE", "CREATE DATE"],
-- 		"UUID": "car.extId",
-- 		"YEAR": "car.year",
-- 		"MAKE": "car.make",
-- 		"MODEL": "car.model",
-- 		"MILEAGE": "car.mileage",
-- 		"PRICE": "car.price",
-- 		"ZIP CODE": "car.zip",
-- 		"UPDATE DATE": "car.updated",
-- 		"CREATE DATE": "car.created"
-- 	}
-- }');
--
--
--
