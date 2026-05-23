/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {

    await knex.schema.createTable("order_items", (t) => {
        t.specificType("id", "integer generated always as identity").primary();
        t.integer("order_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("orders")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        t.integer("event_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("events")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        t.integer("quantity").notNullable();
        t.decimal("price", 10, 2).notNullable();
    });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("order_items");
}