import db from "#configs/database.js";

const TABLE = "events";

/**
 * Returns a base query builder for the event table.
 *
 * @param {import("knex").Knex} [trx=db] - Optional transaction
 * @returns {import("knex").Knex.QueryBuilder}
 */
function baseQuery(trx = db) {
    return trx(TABLE);
}

/**
 * Count events matching optional filters.
 *
 * This is a working example of a model-layer function used by the controller
 * to support API response metadata such as totalItems / totalPages.
 *
 * @param {Object} [filters={}]
 * @param {Object} [options={}]
 * @param {import("knex").Knex} [options.trx] - Optional transaction
 *
 * @returns {Promise<number>} Total matching rows
 */
export async function countEvents(filters = {}, options = {}) {
    const { trx } = options;
    const qb = baseQuery(trx);

    // TODO (required project work): apply supported filters when filter features are implemented

    const row = await qb.count({ count: "*" }).first();
    const count = row?.count ?? row?.["count(*)"] ?? 0;

    return Number(count);
}

/**
 * List events with optional filters and offset-based pagination.
 *
 * This is a working example of a model-layer "read many" function.
 *
 * NOTE:
 * - Supports limit + offset only
 * - Page calculation should be handled at API/controller level
 *
 * @param {Object} [filters={}]
 * @param {string} [filters.currency]
 * @param {number} [filters.minPrice]
 * @param {number} [filters.maxPrice]
 * @param {string} [filters.search]
 *
 * @param {Object} [options={}]
 * @param {number} [options.limit]
 * @param {number} [options.offset]
 * @param {string} [options.orderBy="id"]
 * @param {"asc"|"desc"} [options.order="asc"]
 * @param {import("knex").Knex} [options.trx]
 *
 * @returns {Promise<Array<Object>>}
 */
export async function listEvents(filters = {}, options = {}) {
    const {
        limit,
        offset,
        orderBy = "id",
        order = "asc",
        trx,
    } = options;

    const qb = baseQuery(trx).select("*");


    qb.orderBy(
        orderBy,
        String(order).toLowerCase() === "desc" ? "desc" : "asc"
    );

    if (Number.isInteger(limit) && limit > 0) {
        qb.limit(limit);
    }

    if (Number.isInteger(offset) && offset >= 0) {
        qb.offset(offset);
    }

    return qb;
}

/**
 * Find a single event by id.
 *
 * This is a working example of a model-layer "read one" function.
 *
 * @param {number|string} id
 * @param {Object} [options={}]
 * @param {import("knex").Knex} [options.trx]
 *
 * @returns {Promise<Object|null>}
 */
export async function findEventById(id, { trx } = {}) {
    const row = await baseQuery(trx)
        .where({ id })
        .first();

    return row ?? null;
}



