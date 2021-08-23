const express = require('express');
const router =  express.Router();
const messagesControllers = require('../controllers/messagesControllers');
const middleware = require("../middlewares/middlewres");
router.get('/', messagesControllers.root);
module.exports = router;