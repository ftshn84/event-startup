import express from "express";
import {
    getCart,
    postCartItem,
    putCartItem,
    deleteCartItemById,
} from "#controllers/cart.js";
import { optionalAuth } from "#middlewares/auth.js";

const cartRouter = express.Router();

cartRouter.use(optionalAuth);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the active cart (guest or authenticated)
 *     tags:
 *       - Cart
 *     description: For authenticated users, cart is resolved by user id. For guests, first create a token using POST /api/auth/guest, then send it in x-cart-token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-cart-token
 *         required: false
 *         schema:
 *           type: string
 *         description: Guest cart token returned by POST /api/auth/guest
 *     responses:
 *       200:
 *         description: Active cart details
 *       401:
 *         description: Invalid auth token or guest cart token
 */
cartRouter.get("/", getCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add an item to the active cart
 *     tags:
 *       - Cart
 *     description: Adds quantity for an event. If the event is already in cart, quantity is incremented. Guest users must send x-cart-token from POST /api/auth/guest.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-cart-token
 *         required: false
 *         schema:
 *           type: string
 *         description: Guest cart token returned by POST /api/auth/guest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - quantity
 *             properties:
 *               eventId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added and cart updated
 *       401:
 *         description: Missing or invalid auth token / guest cart token
 *       404:
 *         description: Event not found
 */
cartRouter.post("/items", postCartItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   put:
 *     summary: Update cart line quantity
 *     tags:
 *       - Cart
 *     description: itemId is the cart line identifier (order_items.id), not the catalog event id.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: header
 *         name: x-cart-token
 *         required: false
 *         schema:
 *           type: string
 *         description: Guest cart token returned by POST /api/auth/guest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart line updated
 *       401:
 *         description: Invalid auth token or guest cart token
 *       404:
 *         description: Cart or cart item not found
 */
cartRouter.put("/items/:itemId", putCartItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   delete:
 *     summary: Remove a cart line
 *     tags:
 *       - Cart
 *     description: itemId is the cart line identifier (order_items.id), not the catalog event id.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: header
 *         name: x-cart-token
 *         required: false
 *         schema:
 *           type: string
 *         description: Guest cart token returned by POST /api/auth/guest
 *     responses:
 *       200:
 *         description: Cart line removed
 *       401:
 *         description: Invalid auth token or guest cart token
 *       404:
 *         description: Cart or cart item not found
 */
cartRouter.delete("/items/:itemId", deleteCartItemById);

export default cartRouter;
