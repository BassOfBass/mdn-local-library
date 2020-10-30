import express from 'express';

const router = express.Router();

// specify a route on that object
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

export default router;
