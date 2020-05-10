const { room_participant_table } = require('../src/consts/tables_names')

const tableName = room_participant_table

exports.up = function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.integer('user_id').unsigned().notNullable()
    table.integer('room_id').unsigned().notNullable()    
    table.boolean('is_host').defaultTo(false)
    table.timestamps()

    table.foreign('user_id').references('id').inTable('user')
    table.foreign('room_id').references('id').inTable('room')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName)
};
