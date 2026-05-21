/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
    await knex("orders").del();

    const users = await knex("users")
        .select(["id", "email"])
        .whereIn("email", ["john.doe@example.com", "jane.smith@example.com"]);

    const usersByEmail = new Map(users.map((user) => [user.email, user.id]));
    const johnUserId = usersByEmail.get("john.doe@example.com");
    const janeUserId = usersByEmail.get("jane.smith@example.com");

    if (!johnUserId || !janeUserId) {
        throw new Error("Required users are missing for orders seed");
    }

    await knex("orders").insert([
        {
            user_id: johnUserId,
            total_amount: 200,
            ispaid: false,
        },
        {
            user_id: janeUserId,
            total_amount: 150,
            ispaid: false,
        },
        {
            user_id: null,
            total_amount: 500,
            ispaid: false,
        }
    ]);
}