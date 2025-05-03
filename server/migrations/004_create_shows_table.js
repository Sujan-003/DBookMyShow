/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('shows', {
        show_id: { type: 'serial', primaryKey: true },
        movie_id: { type: 'integer', notNull: true, references: 'movies', onDelete: 'CASCADE' },
        screen_id: { type: 'integer', notNull: true, references: 'screens', onDelete: 'CASCADE' },
        theater_id: { type: 'integer', notNull: true, references: 'theaters', onDelete: 'CASCADE' },
        show_time: { type: 'timestamp', notNull: true },
        base_seat_price: { type: 'integer', notNull: true, default: 0 }, // Added base_seat_price
    });
};

exports.down = (pgm) => {
    pgm.dropTable('shows');
};