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
    const executor = trx ?? db;
    const row = await orderItemsQuery(trx)
        .where({ order_id: orderId })
        .sum({ total: executor.raw("quantity * price") })
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

export async function finalizeCart(orderId, userId, { trx } = {}) {
    const [row] = await ordersQuery(trx)
        .where({ id: orderId, user_id: userId, ispaid: false })
        .update({ ispaid: true })
        .returning(["id", "user_id", "total_amount", "ispaid", "created_at", "updated_at"]);

    return row ?? null;
}

export async function listCompletedOrdersByUserId(userId, { trx } = {}) {
    const executor = trx ?? db;
    const rows = await ordersQuery(trx)
        .leftJoin("order_items", "orders.id", "order_items.order_id")
        .where({ "orders.user_id": userId, "orders.ispaid": true })
        .groupBy("orders.id")
        .select([
            "orders.id",
            "orders.user_id",
            "orders.total_amount",
            "orders.ispaid",
            "orders.created_at",
            "orders.updated_at",
        ])
        .count({ itemCount: "order_items.id" })
        .sum({ ticketQuantity: executor.raw("COALESCE(order_items.quantity, 0)") })
        .orderBy("orders.created_at", "desc")
        .orderBy("orders.id", "desc");

    return rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        totalAmount: Number(row.total_amount ?? 0),
        isPaid: row.ispaid,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        itemCount: Number(row.itemCount ?? 0),
        ticketQuantity: Number(row.ticketQuantity ?? 0),
    }));
}

export async function getCompletedOrderWithItems(orderId, userId, { trx } = {}) {
    const order = await ordersQuery(trx)
        .where({ id: orderId, user_id: userId, ispaid: true })
        .first(["id", "user_id", "total_amount", "ispaid", "created_at", "updated_at"]);

    if (!order) {
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
        id: order.id,
        userId: order.user_id,
        totalAmount: Number(order.total_amount ?? 0),
        isPaid: order.ispaid,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items: items.map((item) => ({
            ...item,
            price: Number(item.price),
            lineTotal: Number(item.price) * item.quantity,
        })),
    };
}

export async function listPurchasedTicketsByUserId(userId, { trx } = {}) {
    const rows = await orderItemsQuery(trx)
        .join("orders", "order_items.order_id", "orders.id")
        .leftJoin("events", "order_items.event_id", "events.id")
        .where({ "orders.user_id": userId, "orders.ispaid": true })
        .select([
            "orders.id as orderId",
            "orders.created_at as purchasedAt",
            "order_items.id as itemId",
            "order_items.event_id as eventId",
            "order_items.quantity",
            "order_items.price",
            "events.title as eventTitle",
            "events.date as eventDate",
            "events.venue as eventVenue",
        ])
        .orderBy("orders.created_at", "desc")
        .orderBy("orders.id", "desc")
        .orderBy("order_items.id", "asc");

    return rows.map((row) => ({
        orderId: row.orderId,
        purchasedAt: row.purchasedAt,
        itemId: row.itemId,
        eventId: row.eventId,
        quantity: row.quantity,
        price: Number(row.price),
        lineTotal: Number(row.price) * row.quantity,
        eventTitle: row.eventTitle,
        eventDate: row.eventDate,
        eventVenue: row.eventVenue,
    }));
}
