import express from "express";

const router = express.Router();

router.post("/", async (req, res)=> {
  res.json({
    message: "TBD"
  });
})

export default router;