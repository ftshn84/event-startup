/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
    await knex.raw(`
        CREATE UNIQUE INDEX IF NOT EXISTS orders_active_cart_user_idx
        ON orders (user_id)
        WHERE user_id IS NOT NULL AND ispaid = false
    `);
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
    await knex.raw("DROP INDEX IF EXISTS orders_active_cart_user_idx");
}
