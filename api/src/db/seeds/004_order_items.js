const seedData = [
    {
        order_id: 1,
        event_id: 1,
        quantity: 2,
        price: 100,
    },
    {
        order_id: 2,
        event_id: 2,
        quantity: 1,
        price: 150,
    },
    {
        order_id: 3,
        event_id: 3,
        quantity: 2,
        price: 250,
    },
];

/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
    await knex("order_items").del();

    await knex("order_items").insert(seedData);
}
