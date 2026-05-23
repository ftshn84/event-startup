import {
    getCompletedOrderWithItems,
    listCompletedOrdersByUserId,
    listPurchasedTicketsByUserId,
} from "#models/cart.js";
import { OrderParams } from "#schemas/orders.js";

function createHttpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

export async function getCompletedOrders(req, res, next) {
    try {
        const orders = await listCompletedOrdersByUserId(req.authUser.id);

        res.json({
            data: {
                orders,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getCompletedOrderById(req, res, next) {
    try {
        const { orderId } = OrderParams.parse(req.params);
        const order = await getCompletedOrderWithItems(orderId, req.authUser.id);

        if (!order) {
            throw createHttpError(404, "Completed order not found");
        }

        res.json({
            data: {
                order,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getPurchasedTickets(req, res, next) {
    try {
        const tickets = await listPurchasedTicketsByUserId(req.authUser.id);

        res.json({
            data: {
                tickets,
            },
        });
    } catch (error) {
        next(error);
    }
}