/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('screens', {
        screen_id: { type: 'serial', primaryKey: true },
        theater_id: { type: 'integer', notNull: true, references: 'theaters', onDelete: 'CASCADE' },
        screen_number: { type: 'text', notNull: true },
        total_seats: { type: 'integer', notNull: true },
        base_seat_price: { type: 'numeric(10, 2)', notNull: true },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('screens');
};