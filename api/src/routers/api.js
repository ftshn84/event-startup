import express from "express";
import eventsRouter from "#routers/events.js";
import authRouter from "#routers/auth.js";
const apiRouter = express.Router();

apiRouter.use("/events", eventsRouter);
apiRouter.use("/auth", authRouter);

export default apiRouter;