import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    createUser,
    findUserByEmail,
} from "#models/users.js";
import {
    SignupInput,
    LoginInput,
} from "#schemas/auth.js";

const PASSWORD_SALT_ROUNDS = 10;

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

function signAccessToken(user) {
    return jwt.sign(
        {
            sub: String(user.id),
            email: user.email,
            name: user.name,
        },
        getJwtSecret(),
        {
            expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
        }
    );
}

function toPublicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}

function sendAuthResponse(res, user, status = 200) {
    const accessToken = signAccessToken(user);

    res.status(status).json({
        data: {
            user: toPublicUser(user),
            accessToken,
            tokenType: "Bearer",
        },
    });
}

export async function postSignup(req, res, next) {
    try {
        const signupInput = SignupInput.parse(req.body);

        const existingUser = await findUserByEmail(signupInput.email);

        if (existingUser) {
            throw createHttpError(409, "A user with this email already exists");
        }

        const passwordHash = await bcrypt.hash(
            signupInput.password,
            PASSWORD_SALT_ROUNDS
        );

        const createdUser = await createUser({
            name: signupInput.name,
            email: signupInput.email,
            password: passwordHash,
        });

        if (!createdUser) {
            throw createHttpError(500, "Could not create user");
        }

        sendAuthResponse(res, createdUser, 201);
    } catch (error) {
        next(error);
    }
}

export async function postLogin(req, res, next) {
    try {
        const loginInput = LoginInput.parse(req.body);
        const user = await findUserByEmail(loginInput.email);

        if (!user) {
            throw createHttpError(401, "Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
            loginInput.password,
            user.password
        );

        if (!isPasswordValid) {
            throw createHttpError(401, "Invalid email or password");
        }

        sendAuthResponse(res, user);
    } catch (error) {
        next(error);
    }
}

export async function getMe(req, res, next) {
    void next;

    res.json({
        data: req.authUser,
    });
}