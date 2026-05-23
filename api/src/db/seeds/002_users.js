const seedData = [
    {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "$2b$10$FnHwObWScfUfr4Qi5Y3stutmVQq3XyhPpWrjZ7kQJxSZSYbI4QZue",
    },
    {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "$2b$10$PWkjeOqNJ4bnymL/g1QqNeeVjcfQ0VgOkQg.WZJbdMbH8Gjig7r7q",
    },
    {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        password: "$2b$10$quA6SMvMcN6REYCuTN6LduZ02yf2MPkYTcd7GGnLeUY42ayaRF/oa",
    },
];

/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
    await knex("users").del();

    await knex("users").insert(seedData);
}