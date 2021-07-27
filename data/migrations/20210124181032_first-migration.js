//Setup the main database schema

exports.up = function (knex) {
  return knex.schema
    .createTable('users', (tbl) => {
      tbl.increments()
      tbl.string('name').notNullable()
      tbl.string('email').notNullable().unique()
      tbl.string('username').notNullable().unique()
      tbl.string('password').notNullable()
      tbl.string('role').notNullable()
      tbl.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('classes', (tbl) => {
      tbl.increments()
      tbl.string('name').notNullable()
      tbl.string('type').notNullable()
      tbl.string('date_time').notNullable()
      tbl.string('duration').notNullable()
      tbl.string('intensity').notNullable()
      tbl.string('location').notNullable()
      tbl.integer('max_size').unsigned().notNullable()
      tbl.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('instructors_classes', (tbl) => {
      tbl
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('users.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      tbl
        .integer('classes_id')
        .unsigned()
        .notNullable()
        .references('classes.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      tbl.primary(['user_id', 'classes_id'])
    })
    .createTable('attendees', (tbl) => {
      tbl
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('users.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      tbl
        .integer('classes_id')
        .unsigned()
        .notNullable()
        .references('classes.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      tbl.primary(['user_id', 'classes_id'])
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('attendees')
    .dropTableIfExists('instructors_classes')
    .dropTableIfExists('classes')
    .dropTableIfExists('users')
}
