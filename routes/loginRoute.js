const express = require('express');
const router =  express.Router();
const loginControllers = require('../controllers/loginControllers');
const middleware = require("../middlewares/middlewres");
router.get('/', loginControllers.root);
router.post('/', loginControllers.auth);
module.exports = router;