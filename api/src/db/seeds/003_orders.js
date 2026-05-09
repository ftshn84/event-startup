/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
    await knex("orders").del();

    await knex("orders")
        .insert([
            {
                id: 1,
                user_id: 1,
                event_id: 1,
                ispaid: false,
                quantity: 2,
            },
            {
                id: 2,
                user_id: 2,
                event_id: 2,
                ispaid: false,
                quantity: 1,
            },
            {
                id: 3,
                user_id: 3,
                event_id: 3,
                ispaid: false,
                quantity: 1,
            }
        ])
        .onConflict("id")
        .merge();
}