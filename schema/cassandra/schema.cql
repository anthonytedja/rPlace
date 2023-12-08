CREATE KEYSPACE r_place
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};

CREATE TABLE r_place.color_mappings (
    coordinatex int,
    coordinatey int,
    color int,
    timestamp timestamp,
    PRIMARY KEY (coordinatex, coordinatey)
);

CREATE TABLE r_place.timestamps (
    userip text,
    timestamp timestamp,
    PRIMARY KEY (userip)
);
