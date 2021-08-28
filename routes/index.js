const user = require('../models/user');
const loginRoute = require('./loginRoute');
const signinRoute= require('./signupRoute');
const chatRoute= require('./chatRoute');
const middleware = require("../middlewares/middlewres");

const multer  = require('multer')
const upload = multer({ dest: './public/uploads/' })
const room = require('../models/room');

const passport = require('passport');
const { isValidObjectId } = require('mongoose');
function route (app){
    //test
    app.get('/test',(req, res)=>{
        
            // users:["6129bb3062382d3721655b61","6129bb1d62382d3721655b5d" ,"6129bbab62382d3721655b64"]
            // room.create({
            //     name: 'room_1',
            //     users:["6129bb3062382d3721655b61","6129bb1d62382d3721655b5d" ,"6129bbab62382d3721655b64"]
            // })

        // })
        // room1 = new room({
        //     name: 'room_1',
        //     users: ["6129bb3062382d3721655b61","6129bb1d62382d3721655b5d","6129bbab62382d3721655b64"],
        // });
        // room2 = new room({
        //     name: 'room_2',
        //     users: ["6129bb3062382d3721655b61","6129bb1d62382d3721655b5d"],
        // });
        // room1.save();
        // room2.save();
        res.send('successssssssll');

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