const user = require('../models/user');
const loginRoute = require('./loginRoute');
const signinRoute= require('./signupRoute');
const messagesRoute = require('./messagesRoute');
const middleware = require("../middlewares/middlewres");

function route (app){
    app.use('/signup', signinRoute);
    app.use('/login',loginRoute);
    app.use('/',middleware.auth, messagesRoute);
}
module.exports  = route;