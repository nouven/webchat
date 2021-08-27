
const express = require('express');
const router =  express.Router();
const signupControllers = require('../controllers/signupControllers');
const middlewres= require('../middlewares/middlewres')

router.get('/', signupControllers.root);
router.post('/', middlewres.signupAuth,signupControllers.toLogin);

module.exports = router;