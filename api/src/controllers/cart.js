import jwt from "jsonwebtoken";
import db from "#configs/database.js";
import { findEventById } from "#models/events.js";
import {
    createCart,
    createCartItem,
    deleteCartItem,
    finalizeCart,
    findCartItemByEventId,
    findCartItemById,
    findOpenCartByUserId,
    findOpenGuestCartById,
    getCompletedOrderWithItems,
    getCartWithItems,
    recalculateCartTotal,
    updateCartItemQuantity,
} from "#models/cart.js";
import {
    CartItemInput,
    CartItemParams,
    CartItemUpdateInput,
} from "#schemas/cart.js";

const CART_TOKEN_HEADER = "x-cart-token";

function createHttpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw createHttpError(
            500,
            "JWT_SECRET is not set. Configure it in environment variables"
        );
    }

    return secret;
}

function parseGuestCartToken(token) {
    if (!token) {
        return null;
    }

    try {
        const payload = jwt.verify(token, getJwtSecret());
        const cartId = Number(payload?.cartId);

        if (payload?.typ !== "guest-cart" || !Number.isInteger(cartId) || cartId <= 0) {
            throw createHttpError(401, "Invalid guest cart token");
        }

        return cartId;
    } catch (error) {
        if (error?.name === "JsonWebTokenError" || error?.name === "TokenExpiredError") {
            throw createHttpError(401, "Invalid or expired guest cart token");
        }

        throw error;
    }
}

async function resolveCartContext(req, { createWhenMissing = false, trx } = {}) {
    const authUserId = req.authUser?.id ?? null;

    if (authUserId) {
        let cart = await findOpenCartByUserId(authUserId, { trx });

        if (!cart && createWhenMissing) {
            cart = await createCart({ userId: authUserId }, { trx });
        }

        return {
            cart,
            isGuest: false,
            cartToken: null,
        };
    }

    const incomingToken = req.headers[CART_TOKEN_HEADER];
    const guestCartId = parseGuestCartToken(incomingToken);

    let cart = null;

    if (guestCartId) {
        cart = await findOpenGuestCartById(guestCartId, { trx });
    }

    return {
        cart,
        isGuest: true,
        cartToken: incomingToken ?? null,
    };
}

function sendCartResponse(res, payload, status = 200) {
    return res.status(status).json({
        data: {
            cart: payload.cart,
            cartToken: payload.cartToken,
            isGuest: payload.isGuest,
        },
    });
}

export async function getCart(req, res, next) {
    try {
        const context = await resolveCartContext(req);

        if (!context.cart) {
            return sendCartResponse(res, {
                cart: {
                    id: null,
                    userId: req.authUser?.id ?? null,
                    totalAmount: 0,
                    isPaid: false,
                    items: [],
                },
                cartToken: null,
                isGuest: context.isGuest,
            });
        }

        const cart = await getCartWithItems(context.cart.id);

        return sendCartResponse(res, {
            cart,
            cartToken: context.cartToken,
            isGuest: context.isGuest,
        });
    } catch (error) {
        next(error);
    }
}

export async function postCartItem(req, res, next) {
    try {
        const input = CartItemInput.parse(req.body);

        const event = await findEventById(input.eventId);

        if (!event) {
            throw createHttpError(404, "Event not found");
        }

        const result = await db.transaction(async (trx) => {
            const context = await resolveCartContext(req, {
                createWhenMissing: true,
                trx,
            });

            if (context.isGuest && !context.cart) {
                throw createHttpError(
                    401,
                    "Guest cart token is required. Create one using POST /api/auth/guest"
                );
            }

            const existingLine = await findCartItemByEventId(context.cart.id, input.eventId, {
                trx,
            });

            if (existingLine) {
                await updateCartItemQuantity(existingLine.id, existingLine.quantity + input.quantity, {
                    trx,
                });
            } else {
                await createCartItem(
                    {
                        orderId: context.cart.id,
                        eventId: input.eventId,
                        quantity: input.quantity,
                        price: Number(event.price),
                    },
                    { trx }
                );
            }

            await recalculateCartTotal(context.cart.id, { trx });
            const cart = await getCartWithItems(context.cart.id, { trx });

            return {
                cart,
                isGuest: context.isGuest,
                cartToken: context.cartToken,
            };
        });

        return sendCartResponse(res, result, 201);
    } catch (error) {
        next(error);
    }
}

export async function putCartItem(req, res, next) {
    try {
        const { itemId } = CartItemParams.parse(req.params);
        const input = CartItemUpdateInput.parse(req.body);

        const result = await db.transaction(async (trx) => {
            const context = await resolveCartContext(req, { trx });

            if (!context.cart) {
                throw createHttpError(404, "Cart not found");
            }

            const line = await findCartItemById(context.cart.id, itemId, { trx });

            if (!line) {
                throw createHttpError(404, "Cart item not found");
            }

            await updateCartItemQuantity(itemId, input.quantity, { trx });
            await recalculateCartTotal(context.cart.id, { trx });
            const cart = await getCartWithItems(context.cart.id, { trx });

            return {
                cart,
                isGuest: context.isGuest,
                cartToken: context.cartToken,
            };
        });

        return sendCartResponse(res, result);
    } catch (error) {
        next(error);
    }
}

export async function deleteCartItemById(req, res, next) {
    try {
        const { itemId } = CartItemParams.parse(req.params);

        const result = await db.transaction(async (trx) => {
            const context = await resolveCartContext(req, { trx });

            if (!context.cart) {
                throw createHttpError(404, "Cart not found");
            }

            const line = await findCartItemById(context.cart.id, itemId, { trx });

            if (!line) {
                throw createHttpError(404, "Cart item not found");
            }

            await deleteCartItem(itemId, { trx });
            await recalculateCartTotal(context.cart.id, { trx });
            const cart = await getCartWithItems(context.cart.id, { trx });

            return {
                cart,
                isGuest: context.isGuest,
                cartToken: context.cartToken,
            };
        });

        return sendCartResponse(res, result);
    } catch (error) {
        next(error);
    }
}

export async function postCheckout(req, res, next) {
    try {
        if (!req.authUser) {
            throw createHttpError(401, "Authentication is required to checkout");
        }

        const order = await db.transaction(async (trx) => {
            const cart = await findOpenCartByUserId(req.authUser.id, { trx });

            if (!cart) {
                throw createHttpError(404, "Active cart not found");
            }

            const cartWithItems = await getCartWithItems(cart.id, { trx });

            if (!cartWithItems || cartWithItems.items.length === 0) {
                throw createHttpError(400, "Cannot checkout an empty cart");
            }

            const finalizedOrder = await finalizeCart(cart.id, req.authUser.id, { trx });

            if (!finalizedOrder) {
                throw createHttpError(409, "Cart could not be finalized");
            }

            return getCompletedOrderWithItems(finalizedOrder.id, req.authUser.id, { trx });
        });

        res.status(200).json({
            data: {
                order,
            },
        });
    } catch (error) {
        next(error);
    }
}
