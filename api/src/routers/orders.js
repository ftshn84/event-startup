import express from "express";
import {
    getCompletedOrderById,
    getCompletedOrders,
    getPurchasedTickets,
} from "#controllers/orders.js";
import { requireAuth } from "#middlewares/auth.js";

const ordersRouter = express.Router();

ordersRouter.use(requireAuth);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: List completed orders for the authenticated user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Completed orders returned
 *       401:
 *         description: Missing or invalid token
 */
ordersRouter.get("/", getCompletedOrders);

/**
 * @swagger
 * /api/orders/tickets:
 *   get:
 *     summary: List purchased tickets for the authenticated user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchased tickets returned
 *       401:
 *         description: Missing or invalid token
 */
ordersRouter.get("/tickets", getPurchasedTickets);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get a completed order with item details
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Completed order returned
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Completed order not found
 */
ordersRouter.get("/:orderId", getCompletedOrderById);

export default ordersRouter;