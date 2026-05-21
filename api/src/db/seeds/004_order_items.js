/**
 * @param {import("knex").Knex} knex
 */
export async function seed(knex) {
    await knex("order_items").del();

    const users = await knex("users")
        .select(["id", "email"])
        .whereIn("email", ["john.doe@example.com", "jane.smith@example.com"]);

    const usersByEmail = new Map(users.map((user) => [user.email, user.id]));
    const johnUserId = usersByEmail.get("john.doe@example.com");
    const janeUserId = usersByEmail.get("jane.smith@example.com");

    if (!johnUserId || !janeUserId) {
        throw new Error("Required users are missing for order_items seed");
    }

    const orders = await knex("orders")
        .select(["id", "user_id"])
        .where(function whereSeedOrders() {
            this.where("user_id", johnUserId)
                .orWhere("user_id", janeUserId)
                .orWhereNull("user_id");
        });

    const orderByUser = new Map();

    for (const order of orders) {
        if (order.user_id === johnUserId && !orderByUser.has("john")) {
            orderByUser.set("john", order.id);
        }
        if (order.user_id === janeUserId && !orderByUser.has("jane")) {
            orderByUser.set("jane", order.id);
        }
        if (order.user_id === null && !orderByUser.has("guest")) {
            orderByUser.set("guest", order.id);
        }
    }

    const events = await knex("events")
        .select(["id", "title"])
        .whereIn("title", [
            "Copenhagen Coffee Crawl",
            "After-Work Board Games Night",
            "Beginner Pasta Workshop",
        ]);

    const eventByTitle = new Map(events.map((event) => [event.title, event.id]));

    if (
        !orderByUser.get("john")
        || !orderByUser.get("jane")
        || !orderByUser.get("guest")
        || !eventByTitle.get("Copenhagen Coffee Crawl")
        || !eventByTitle.get("After-Work Board Games Night")
        || !eventByTitle.get("Beginner Pasta Workshop")
    ) {
        throw new Error("Required orders or events are missing for order_items seed");
    }

    await knex("order_items").insert([
        {
            order_id: orderByUser.get("john"),
            event_id: eventByTitle.get("Copenhagen Coffee Crawl"),
            quantity: 2,
            price: 100,
        },
        {
            order_id: orderByUser.get("jane"),
            event_id: eventByTitle.get("After-Work Board Games Night"),
            quantity: 1,
            price: 150,
        },
        {
            order_id: orderByUser.get("guest"),
            event_id: eventByTitle.get("Beginner Pasta Workshop"),
            quantity: 2,
            price: 250,
        },
    ]);
}
