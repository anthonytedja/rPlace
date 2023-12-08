.PHONY: run build check setup kill reset

run: build
	docker-compose up -d

run-dev: build
	docker-compose up

build: check
	docker-compose build

check: setup
	npm run lint
	npm run check-types

setup:
	npm install

kill:
	docker-compose kill
	docker-compose rm -f

reset:
	docker system prune
