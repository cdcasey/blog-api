exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('posts')
        .del()
        .then(function() {
            // Inserts seed entries
            return knex('posts').insert([
                {
                    title: 'post title',
                    categories: 'category1, category2',
                    content: 'This is a post'
                }
            ]);
        });
};
