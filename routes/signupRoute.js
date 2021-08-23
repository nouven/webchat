
const express = require('express');
const router =  express.Router();
const signupControllers = require('../controllers/signupControllers');

router.use('/', signupControllers.root);

module.exports = router;