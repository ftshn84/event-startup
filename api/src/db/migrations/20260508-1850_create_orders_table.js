/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
    await knex.schema.createTable("orders", (t) => {
        t.increments("id").primary();
        t.integer("user_id").notNullable();
        t.integer("event_id").notNullable();
        t.boolean("ispaid").notNullable().defaultTo(false);
        t.integer("quantity").notNullable();
        t.timestamps(true, true);
    });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("orders");
}