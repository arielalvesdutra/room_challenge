# Room Challenge

## Description

The goal of this project is to provide a software following the requirements from the document of the "room challenge".

This project was developed with NodeJS, Typescript, Express, Knex ane MySQL.

## How to use

1 - Install the dependecies using `npm install`

2 - Copy the `.env.example` to `.env ` and set all the configurations to adapt to your environment. 

4 - Create a database following what was configured in the .env file

5 - Execute the command `knex migrate:latest`. It is necessery the installation of kenx.To install, execute the command `npm i -g knex`

3 - Execute `npm run dev` to run the development server ou execute `npm run build && npm start` to run the production code with Node JS.
