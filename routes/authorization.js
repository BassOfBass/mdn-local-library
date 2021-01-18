import express from "express";

import { 
  getAuthorizationOverview, 
  getRegistration,
  postRegistration,
  validateAuthorization,
  getLogin,
  postLogin,
  getLogout
} from "../controllers/authorization/authorizationController.js"

const router = express.Router();

router.get("/", getAuthorizationOverview);
router.get("/register", getRegistration);
router.post(
  "/register",
  validateAuthorization(postRegistration),
  postRegistration
);
router.get("/login", getLogin);
router.post(
  "/login", 
  validateAuthorization(postLogin),
  postLogin
);
router.get("/logout", getLogout);
export default router;