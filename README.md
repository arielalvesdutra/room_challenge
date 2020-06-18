# Room Challenge

## Description

The goal of this project is to provide a software following the requirements from the document of the "room challenge".

This project was developed with NodeJS, Typescript, Express, Knex, MySQL, Jest and supertest.

## How to use

1 - Install the dependecies using `npm install`

2 - Copy the `.env.example` to `.env ` and set all the configurations to adapt to your environment. 

4 - Create a database following what was configured in the .env file

5 - Execute the command `knex migrate:latest`. It is necessery the installation of kenx.To install, execute the command `npm i -g knex`

3 - Execute `npm run dev` to run the development server ou execute `npm run build && npm start` to run the production code with Node JS.

## Tests execution

- Integration tests: `npm run test-integration`
- Unit tests: `npm run test-unit`
- All tests: `npm test`
- All tests with test coverage: `npm run test-coverage`
- Clear jest cache: `npm run jest-clear-cache`

## Description of the architecture

Below is described the structure and definitions of the structure that are used in this project:

- `configs`: configuration classes and methods for the application
- `consts`: constants of strings that can be reused in the entire project
- `constroller`: classes that deal with http requests
- `daos`: Data Access Object - classes and methods that are responsible for dealing with the database layer, normally related with one entity
- `dtos`: Data Transfer Object - interfaces that represents an object that is used in a controller, dao, service and etc., but hasn't relations with database
- `entities`: representation of a domain object and with attributes names equals to the database columns
- `helpers`: classes and methods that don't have a specific relation with a domain aspect and can be reused in the entire project
- `services`: classes and methods that have a specific relation with a domain aspect
- `validators`: classes and methods that receive some input and throw an exception in case of a not valid input
- `.env`: configurations that can have different values according with the environment of execution of the application
