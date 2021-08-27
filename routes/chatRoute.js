const express = require('express');
const router =  express.Router();
const chatControllers= require('../controllers/chatControllers');
const middleware = require("../middlewares/middlewres");
router.get('/', chatControllers.root);
module.exports = router;