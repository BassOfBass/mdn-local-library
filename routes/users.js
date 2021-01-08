import express from 'express';

import { 
  getUserDetails, 
  getUserList, 
  postUserDetails 
} from '../controllers/users/userController.js';

const router = express.Router();

router.get('/', getUserList);
router.get("/:id", getUserDetails);
router.post("/:id", postUserDetails);

export default router;
