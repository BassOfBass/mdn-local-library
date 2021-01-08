import express from "express";

import { 
  getAuthorizationOverview, 
  getRegistration,
  postRegistration,
  validateAuthorization,
  getLogin,
  postLogin
} from "../controllers/authorization/authorizationController.js"

const router = express.Router();

router.get("/", getAuthorizationOverview);
router.get("/registration", getRegistration);
router.post(
  "/registration",
  validateAuthorization(postRegistration),
  postRegistration
);
router.get("/login", getLogin);
router.post("/login", postLogin);
export default router;