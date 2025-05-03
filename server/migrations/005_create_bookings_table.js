/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('bookings', {
        booking_id: { type: 'serial', primaryKey: true },
        show_id: { type: 'integer', notNull: true, references: 'shows', onDelete: 'CASCADE' },
        user_id: { type: 'integer' }, // Assuming a users table might exist later
        booking_code: { type: 'text', notNull: true, unique: true },
        seat_numbers: { type: 'text[]', notNull: true },
        total_amount: { type: 'numeric(10, 2)', notNull: true },
        booking_date: { type: 'timestamp', default: pgm.func('current_timestamp') },
        cancellation_available: { type: 'boolean', default: true },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('bookings');
};