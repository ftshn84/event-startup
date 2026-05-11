import { z } from "zod";
const EmailSchema = z.string().trim().email("Invalid email address").transform((value) => value.toLowerCase());
export const SignupInput = z.object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
    email: EmailSchema,
    password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be at most 100 characters"),
});
export const LoginInput = z.object({
    email: EmailSchema,
    password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be at most 100 characters"),
}); 