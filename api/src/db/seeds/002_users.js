/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
    await knex("users").del();

    await knex("users")
        .insert([
            {
                id: 1,
                full_name: "John Doe",
                email: "john.doe@example.com",
            },
            {
                id: 2,
                full_name: "Jane Smith",
                email: "jane.smith@example.com",
            },
            {
                id: 3,
                full_name: "Alice Johnson",
                email: "alice.johnson@example.com",
            }
        ])
        .onConflict("id")
        .merge();
}