CREATE KEYSPACE r_place
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};

CREATE TABLE r_place.color_mappings (
    coordinateX int,
    coordinateY int,
    color int,
    timestamp timestamp,
    PRIMARY KEY (coordinateX, coordinateY)
);

CREATE TABLE r_place.timestamps (
    userIP text,
    timestamp timestamp,
    PRIMARY KEY (userIP)
);
