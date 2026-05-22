import { requireAuth } from "#middlewares/auth.js";
import express from "express";
import { getEvents, getEventById } from "#controllers/events.js";

const eventsRouter = express.Router();
/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get paginated list of events
 *     description: Returns a paginated list of events. Pagination is zero-based.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         required: false
 *         description: Page number (zero-based)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         required: false
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       price:
 *                         type: number
 *                         example: 150
 *                       currency:
 *                         type: string
 *                         example: DKK
 *                       title:
 *                         type: string
 *                         example: Live Jazz Trio
 *                       description:
 *                         type: string
 *                         example: An intimate jazz evening.
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 0
 *                     pageSize:
 *                       type: integer
 *                       example: 5
 *                     totalItems:
 *                       type: integer
 *                       example: 245
 *                     totalPages:
 *                       type: integer
 *                       example: 49
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Server error
 */
eventsRouter.get("/", getEvents);

/**
 * OPTIONAL ROUTE PLACEHOLDER
 *
 * Demonstrates how a "get single resource" endpoint would be added.
 * Not required in the base trainee assignment unless optional scope
 * is implemented.
 *
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event found
 *       404:
 *         description: Event not found
 */
eventsRouter.get("/:id", getEventById);


export default eventsRouter;