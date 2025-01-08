# pokemon-proxy 👾

## 🚩 Description

Api that handles Pokemons proxying of [Pokemon API](https://pokeapi.co/), Trainer's CRUD (Create, Read, Update and Delete) data and Pokeballs features like catching new pokemons or let them go away.

## ⚙️ Project setup

- The API was developed in [Nestjs](https://nestjs.com/), using the best practices of the framework focusing in a microservice architecture.
- The API uses the [Postgresql](https://www.postgresql.org/) to persist data;
- [Redis](https://redis.io/) was used as cache memo to avoid unnecessary and repeated requests to others apis.
- To ensure the code quality this project has used the [Jest](https://jestjs.io/) library to make unit and integration tests.

## ⚒️ Compile and run the project

```bash
# install all the dependencies
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

🚨 **Warn**: The endpoint to check the swagger documentation is [/documentation](http://localhost:3000/documentation).

🚨 **Warn**: You must be sure that the postgres and the redis are running correctly before to run this api.

## 🐳 Compile and run the project by Docker Compose

If you have the [Docker](https://www.docker.com/) installed in you machine you can automate all processes of configuration, including:

- Compilation;
- Database migration;
- Environment Variables configuration;
- Postgres container installation;
- Redis container installation;

In the root folder, run:

```bash
# build docker images
$ docker-compose build

# run all the docker containers
$ docker-compose up -d
```

## 🔎 Run tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## 🛢️ Database

```bash

# generate a new migration
db:migration:generate name=<MigrationName>

# run all migrations
db:migration:run

# revert the last migration
db:migration:revert

```

## Pattern 📂

This project follows the [DDD (Domain Driven Design)](https://fullcycle.com.br/domain-driven-design/) with [Adapter & Port Architecture](https://medium.com/the-software-architecture-chronicles/ports-adapters-architecture-d19f2d476eca):

- /src
  - /domains
    - /pokeballs
    - /pokemons
    - /trainers
    - /insert new domains here...
  - /infra
    - /cache
    - /config
    - /database
    - /http
    - /shared
