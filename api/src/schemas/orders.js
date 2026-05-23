import { z } from "zod";

export const OrderParams = z.object({
    orderId: z.coerce.number().int().positive("orderId must be a positive integer"),
});