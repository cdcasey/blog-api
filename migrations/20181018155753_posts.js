exports.up = function(knex, Promise) {
    return knex.schema.createTable('posts', (table) => {
        table.increments();
        table.string('title');
        table.string('categories');
        table.string('content');
        table.timestamps(true, true);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('posts');
};
