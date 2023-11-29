.PHONY: run check build

run: build
	docker-compose up

build: check
	docker-compose build

check:
	npm run lint
	npm run check-types

kill:
	docker-compose kill
	docker-compose rm -f

reset:
	docker-compose down -v