import express from "express";
import {
    postSignup,
    postLogin,
    getMe,
    postGuest,
} from "#controllers/auth.js";
import { requireAuth } from "#middlewares/auth.js";

const authRouter = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Create a user account
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *     responses:
 *       201:
 *         description: User created and authenticated
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already in use
 */
authRouter.post("/signup", postSignup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate with email and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: Authenticated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid credentials
 */
authRouter.post("/login", postLogin);

/**
 * @swagger
 * /api/auth/guest:
 *   post:
 *     summary: Create guest cart session token
 *     description: |
 *       Creates an empty guest cart and returns a guest cart token.
 *       Use this value as the x-cart-token header when calling cart endpoints as a guest user.
 *       This endpoint is the only place where guest cart tokens are issued.
 *     tags:
 *       - Auth
 *     responses:
 *       201:
 *         description: Guest cart token created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     cartToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       500:
 *         description: Server error while creating guest cart
 */
authRouter.post("/guest", postGuest);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     description: Use the accessToken returned by POST /api/auth/login or POST /api/auth/signup. In Swagger UI, click Authorize and paste accessToken.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Missing or invalid token
 */
authRouter.get("/me", requireAuth, getMe);

export default authRouter;