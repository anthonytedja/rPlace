check:
	npm run check-types

build: check
	docker-compose build

run: build
	docker-compose up -d

run-server: build
	docker-compose up -d server