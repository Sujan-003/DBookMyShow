/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('movies', {
        movie_id: { type: 'serial', primaryKey: true }, // Primary key renamed to movie_id
        title: { type: 'text', notNull: true },
        poster_url: { type: 'text' },
        description: { type: 'text' },
        rating: { type: 'float' },
        votes: { type: 'integer' },
        duration: { type: 'text' },
        release_date: { type: 'date' },
        genre: { type: 'text' },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('movies');
};