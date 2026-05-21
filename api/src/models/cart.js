import db from "#configs/database.js";

const ORDERS_TABLE = "orders";
const ORDER_ITEMS_TABLE = "order_items";

function ordersQuery(trx = db) {
    return trx(ORDERS_TABLE);
}

function orderItemsQuery(trx = db) {
    return trx(ORDER_ITEMS_TABLE);
}

export async function findOpenCartByUserId(userId, { trx } = {}) {
    const row = await ordersQuery(trx)
        .where({ user_id: userId, ispaid: false })
        .orderBy("id", "asc")
        .first();

    return row ?? null;
}

export async function findOpenGuestCartById(cartId, { trx } = {}) {
    const row = await ordersQuery(trx)
        .where({ id: cartId, user_id: null, ispaid: false })
        .first();

    return row ?? null;
}

export async function createCart({ userId = null } = {}, { trx } = {}) {
    const [row] = await ordersQuery(trx)
        .insert({
            user_id: userId,
            total_amount: 0,
            ispaid: false,
        })
        .returning(["id", "user_id", "total_amount", "ispaid", "created_at", "updated_at"]);

    return row ?? null;
}

export async function findCartItemById(orderId, itemId, { trx } = {}) {
    const row = await orderItemsQuery(trx)
        .where({ id: itemId, order_id: orderId })
        .first();

    return row ?? null;
}

export async function findCartItemByEventId(orderId, eventId, { trx } = {}) {
    const row = await orderItemsQuery(trx)
        .where({ order_id: orderId, event_id: eventId })
        .first();

    return row ?? null;
}

export async function createCartItem({ orderId, eventId, quantity, price }, { trx } = {}) {
    const [row] = await orderItemsQuery(trx)
        .insert({
            order_id: orderId,
            event_id: eventId,
            quantity,
            price,
        })
        .returning(["id", "order_id", "event_id", "quantity", "price"]);

    return row ?? null;
}

export async function updateCartItemQuantity(itemId, quantity, { trx } = {}) {
    const [row] = await orderItemsQuery(trx)
        .where({ id: itemId })
        .update({ quantity })
        .returning(["id", "order_id", "event_id", "quantity", "price"]);

    return row ?? null;
}

export async function deleteCartItem(itemId, { trx } = {}) {
    const deletedCount = await orderItemsQuery(trx)
        .where({ id: itemId })
        .del();

    return deletedCount > 0;
}

export async function recalculateCartTotal(orderId, { trx } = {}) {
    const row = await orderItemsQuery(trx)
        .where({ order_id: orderId })
        .sum({ total: trx.raw("quantity * price") })
        .first();

    const totalAmount = Number(row?.total ?? 0);

    const [updated] = await ordersQuery(trx)
        .where({ id: orderId })
        .update({ total_amount: totalAmount })
        .returning(["id", "user_id", "total_amount", "ispaid", "created_at", "updated_at"]);

    return updated ?? null;
}

export async function getCartWithItems(orderId, { trx } = {}) {
    const cart = await ordersQuery(trx)
        .where({ id: orderId, ispaid: false })
        .first(["id", "user_id", "total_amount", "ispaid", "created_at", "updated_at"]);

    if (!cart) {
        return null;
    }

    const items = await orderItemsQuery(trx)
        .leftJoin("events", "order_items.event_id", "events.id")
        .where("order_items.order_id", orderId)
        .select([
            "order_items.id as itemId",
            "order_items.event_id as eventId",
            "order_items.quantity",
            "order_items.price",
            "events.title as eventTitle",
            "events.date as eventDate",
            "events.venue as eventVenue",
        ])
        .orderBy("order_items.id", "asc");

    return {
        id: cart.id,
        userId: cart.user_id,
        totalAmount: Number(cart.total_amount ?? 0),
        isPaid: cart.ispaid,
        createdAt: cart.created_at,
        updatedAt: cart.updated_at,
        items: items.map((item) => ({
            ...item,
            price: Number(item.price),
            lineTotal: Number(item.price) * item.quantity,
        })),
    };
}
