import jwt from "jsonwebtoken";
import { findUserById } from "#models/users.js";

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

export async function requireAuth(req, res, next) {
    void res;

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            throw createHttpError(401, "Authorization header must use Bearer token");
        }

        const token = authHeader.slice("Bearer ".length).trim();

        if (!token) {
            throw createHttpError(401, "Missing Bearer token");
        }

        const payload = jwt.verify(token, getJwtSecret());
        const userId = Number(payload?.sub);

        if (!Number.isInteger(userId) || userId <= 0) {
            throw createHttpError(401, "Invalid token subject");
        }

        const user = await findUserById(userId);

        if (!user) {
            throw createHttpError(401, "Authenticated user no longer exists");
        }

        req.authUser = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        next();
    } catch (error) {
        if (error?.name === "JsonWebTokenError" || error?.name === "TokenExpiredError") {
            next(createHttpError(401, "Invalid or expired token"));
            return;
        }

        next(error);
    }
}