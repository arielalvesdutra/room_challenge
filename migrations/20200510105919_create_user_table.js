const { user_table } = require('../src/consts/tables_names')

exports.up = function(knex) {
  return knex.schema.createTable(user_table, table => {
    table.increments('id').primary()
    table.string('username').notNull().unique()
    table.string('mobile_token')
    table.timestamps()
  })  
};

exports.down = function(knex) {
  return knex.schema.dropTable(user_table)
};
