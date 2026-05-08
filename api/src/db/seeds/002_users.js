/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
    await knex("users").del();

    await knex("users")
        .insert([
            {
                id: 1,
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password123",
            },
            {
                id: 2,
                name: "Jane Smith",
                email: "jane.smith@example.com",
                password: "password456",
            },
            {
                id: 3,
                name: "Alice Johnson",
                email: "alice.johnson@example.com",
                password: "password789",
            }
        ])
        .onConflict("id")
        .merge();
}