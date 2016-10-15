# message-service [![Travis][build-badge]][build]

Microservice for handling message feedback

## Running in Docker

```bash
docker-compose run --rm --service-ports api npm install
docker-compose run --rm --service-ports api
```

## Running tests

```bash
docker-compose run --rm --service-ports test npm install
docker-compose run --rm --service-ports test
```

# License

MIT

[build-badge]: https://travis-ci.org/mersocarlin/message-service.svg
[build]: https://travis-ci.org/mersocarlin/message-service
