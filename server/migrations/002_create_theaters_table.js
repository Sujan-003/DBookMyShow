/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('theaters', {
        theater_id: { type: 'serial', primaryKey: true },
        name: { type: 'text', notNull: true },
        location: { type: 'text', notNull: true },
        contact: { type: 'text' },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('theaters');
};