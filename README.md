# mock-premier-league-api

## About
An API for serving the latest scores of fixtures of matches in a Mock Premier League

Admins and Users can:
* Register (Registering an Admin can only be done by another admin. Default admin is created on startup)
* Login

Admins can:
* Create, Edit and Delete Teams
* Create, Edit and Delete Fixtures

Anyone can:
* View Teams and search
* View Fixtures and search

## Tools/Stack

* Node.js
* TypeScript
* MongoDB
* Redis
* Docker

## Setup
* Copy keys present in `.env.example` file into `.env` file and put in values

* If you have mongo or redis installed locally you can run the server using `yarn dev` or run `yarn build` then `yarn start`

* You can also use the `docker-compose up` command to spin up the server along with a mongo and redis database

* When using docker-compose, `MONGO_URL` and `REDIS_URL` env variables should replace localhost with the service name i.e `mongo` and `redis` respectively e.g `mongodb://mongo:27017` instead of `mongodb://localhost:27017`

* Connecting to either dbs on the host system can be done using the host ports present in docker-compose which are `27021` or `6389`

## Docs

https://documenter.getpostman.com/view/19108910/2s83zjsiiQ

## API

https://mock-premier-league-api.herokuapp.com
