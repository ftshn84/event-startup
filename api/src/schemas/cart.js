import { z } from "zod";

export const CartItemParams = z.object({
    itemId: z.coerce.number().int().positive("itemId must be a positive integer"),
});

export const CartItemInput = z.object({
    eventId: z.coerce.number().int().positive("eventId must be a positive integer"),
    quantity: z.coerce.number().int().min(1, "quantity must be at least 1"),
}).strict();

export const CartItemUpdateInput = z.object({
    quantity: z.coerce.number().int().min(1, "quantity must be at least 1"),
}).strict();
