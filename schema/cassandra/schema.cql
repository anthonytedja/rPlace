CREATE KEYSPACE r_place
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};

CREATE TABLE r_place.color_mappings (
    x int,
    y int,
    color int,
    timestamp timestamp,
    PRIMARY KEY (x, y)
);

CREATE TABLE r_place.timestamps (
    userIP text,
    timestamp timestamp,
    PRIMARY KEY (userIP)
);
