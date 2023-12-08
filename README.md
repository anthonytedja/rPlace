# r/Place

> r/Place clone with AWS services

## Table of Contents

- [Running The System](#running-the-system)
  - [Initial Setup](#initial-setup)

## Configurations

## Running The System

### Local Development

#### Initial Setup

> Caveat: Docker does not setup cassandra keyspace schema automatically. You will need to run the cassadra image and the following command to setup the keyspace before running the application.

```bash
docker-compose up cassandra
docker exec -it cassandra cqlsh -f "/docker-entrypoint-initdb.d/schema.cql"
```

Run the service locally on port 8080

```bash
make
```
