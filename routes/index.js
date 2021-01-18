import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  
  if (!req.isAuthenticated()) {
    return res.redirect("/authorization/login");
  }
  res.render("index");
});

export default router;
