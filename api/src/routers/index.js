import express from "express";
import apiRouter from "#routers/api.js";

const rootRouter = express.Router();

rootRouter.get("/", (_req, res) => {
    res.redirect("/docs");
});

rootRouter.use("/api", apiRouter);

export default rootRouter;