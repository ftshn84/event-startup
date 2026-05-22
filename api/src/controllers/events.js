import {
    listEvents,
    countEvents,
    findEventById
} from "#models/events.js";
import {
    EventIdParams,
    EventInput,
    EventListQuery,
    EventPatchInput,
} from "#schemas/events.js";

export async function getEvents(req, res, next) {
    try {
        const { page, pageSize } = EventListQuery.parse(req.query);
        const offset = page * pageSize;

        const filters = {};

        const data = await listEvents(filters, {
            limit: pageSize,
            offset,
            orderBy: "id",
            order: "asc",
        });

        const totalItems = await countEvents(filters);
        const totalPages = Math.ceil(totalItems / pageSize);

        res.json({
            data,
            meta: {
                page,
                pageSize,
                totalItems,
                totalPages,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getEventById(req, res, next) {
    try {
        const { id } = EventIdParams.parse(req.params);
        const event = await findEventById(id);

        if (!event) {
            return res.status(404).json({
                error: "Event not found",
            });
        }

        res.json({ data: event });
    } catch (error) {
        next(error);
    }
}