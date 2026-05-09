/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
    await knex.schema.createTable("orders", (t) => {
        t.increments("id").primary();
        t.integer("user_id")
            .unsigned()
            .references("id")
            .inTable("users")
            .onUpdate("CASCADE")
            .onDelete("SET NULL");
        t.decimal("total_amount", 10, 2).notNullable();
        t.boolean("ispaid").notNullable().defaultTo(false);
        t.timestamps(true, true);
    });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("orders");
}