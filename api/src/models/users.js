import db from "#configs/database.js";

const TABLE = "users";

function baseQuery(trx = db) {
    return trx(TABLE);
}

export async function findUserByEmail(email, { trx } = {}) {
    const row = await baseQuery(trx)
        .whereRaw("LOWER(email) = LOWER(?)", [email])
        .first();

    return row ?? null;
}

export async function findUserById(id, { trx } = {}) {
    const row = await baseQuery(trx)
        .where({ id })
        .first();

    return row ?? null;
}

export async function createUser(input, { trx } = {}) {
    const payload = {
        name: input.name,
        email: input.email,
        password: input.password,
    };

    const [row] = await baseQuery(trx)
        .insert(payload)
        .returning(["id", "name", "email", "created_at", "updated_at"]);

    if (row) {
        return row;
    }

    const created = await baseQuery(trx)
        .select(["id", "name", "email", "created_at", "updated_at"])
        .where({ email: input.email })
        .orderBy("id", "desc")
        .first();

    return created ?? null;
}