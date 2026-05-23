const seedData = [
    {
        user_id: 1,
        total_amount: 200,
        ispaid: false,
    },
    {
        user_id: 2,
        total_amount: 150,
        ispaid: false,
    },
    {
        user_id: null,
        total_amount: 500,
        ispaid: false,
    },
];

/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
    await knex("orders").del();

    await knex("orders").insert(seedData);
}