/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
    await knex.schema.createTable("users", (t) => {
        t.increments("id").primary();
        t.string("name", 50).notNullable();
        t.string("email", 50).notNullable();
        t.string("password").notNullable();
        t.timestamps(true, true);
    });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("users");
}