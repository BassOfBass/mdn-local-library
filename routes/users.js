// Load express module.
var express = require('express');
// Get an `express.Router` object.
var router = express.Router();

// specify a route on that object
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});
router.get("/cool", (req, res, next) => {
  res.send("You are so cool!");
});

module.exports = router;
