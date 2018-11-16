//Title - text
//Priority - text
//Description - text
//Done - boolean
//Date - datetime
exports.up = function(knex, Promise) {
  return knex.schema.createTable('chores', (table) => {
      table.increments();
      table.string('title').notNullable();
      table.string('priority').notNullable();
      table.string('description');
      table.boolean('done').defaultsTo(false).notNullable();
      table.timestamp('created_at').notNullable().defaultsTo(knex.raw('now()'));
      table.timestamp('updated_at').notNullable().defaultsTo(knex.raw('now()'));
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('chores');
};
