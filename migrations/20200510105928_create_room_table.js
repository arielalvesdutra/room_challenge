const { room_table } = require('../src/consts/tables_names')

exports.up = function (knex) {
  return knex.schema.createTable(room_table, table => {
    table.increments('id').primary()
    table.uuid('guid').notNull()
    table.string('name').notNull()
    table.integer('limit')
    table.timestamps()
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable(room_table)
};
