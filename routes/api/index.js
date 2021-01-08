import express from "express";

import authorizationRouter from "./authorization.js"

const router = express.Router();

router.post("/", async (req, res) => {
  res.json({
    message: "API TBD"
  });
});

router.use("/authorization", authorizationRouter);

export default router;