knex migrate:rollback --env development
knex migrate:rollback --env test

knex migrate:latest --env development
knex migrate:latest --env test

knex seed:run --env development
knex seed:run --env test
