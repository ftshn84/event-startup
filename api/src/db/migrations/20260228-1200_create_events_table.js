/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
    await knex.schema.createTable("events", (t) => {
        t.increments("id").primary();
        t.string("title").notNullable();
        t.text("description");
        t.dateTime("date").notNullable();
        t.string("venue").notNullable();
        t.decimal("price", 10, 2).notNullable();
        t.integer("capacity").notNullable();
        t.timestamps(true, true);
    });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("events");
}