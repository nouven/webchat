const user = require('../models/user');
const loginRoute = require('./loginRoute');
const signinRoute= require('./signupRoute');
const chatRoute= require('./chatRoute');
const middleware = require("../middlewares/middlewres");

const multer  = require('multer')
const upload = multer({ dest: './public/uploads/' })
const test = require("../models/tests");
const room = require('../models/room');

const passport = require('passport');
function route (app){
    //test
    app.get('/test',(req, res)=>{

        // room1 = new room({
        //     name: 'room_1',
        //     users: ["612613d7d2336e7a0788c71b","612631704a028594439fbe61","612614e79be8017ae0e526ba"],
        // });
        // room2 = new room({
        //     name: 'room_2',
        //     users: ["612613d7d2336e7a0788c71b","612631704a028594439fbe61",],
        // });
        // room1.save();
        // room2.save();

    })
    app.post('/test',
        upload.single('avatar'),
        (req, res, next)=>{
            req.body.avatar = req.file.path.split('/').slice(1).join('/');
            const test3= new test({
                name: "beta",
                avatar: req.body.avatar
            });
            test3.save().then((result)=>{
                test.findOne({name: 'test3'}).then((result)=>{
                    res.send(`<img = src=${result.avata}>`);
                })
            });
    });




    app.get(
        '/auth/google',
        passport.authenticate('google', {
          scope: ['profile', 'email']
        })
    );
    app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
    app.use('/signup', signinRoute);
    app.use('/login',loginRoute);
    app.use('/',middleware.auth, chatRoute);
}
module.exports  = route;