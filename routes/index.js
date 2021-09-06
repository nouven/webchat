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
const session = require('express-session');
function route (app){
    //test
    app.get('/test',(req, res)=>{
        app.use(session({
            secret: 'cats',
            resave: false,
            saveUninitialized: true,
        }))
        res.send("hahah");
    })
    app.post('/upload',
        upload.single('avatar'),
        (req, res, next)=>{
            const avatar = req.body.avatar = req.file.path.split('/').slice(1).join('/');
            const _id = req.body._id;
            console.log(avatar, _id);
            user.findById(_id).then(result=>{
                result.avatar = avatar;
                result.save();
            }).then(()=>{
                res.redirect('/');
            })
            // const test3= new test({
            //     name: "beta",
            //     avatar: req.body.avatar
            // });
            // test3.save().then((result)=>{
            //     test.findOne({name: 'test3'}).then((result)=>{
            //         res.send(`<img = src=${result.avata}>`);
            //     })
            // });
    });




    app.get(
        '/auth/google',
        passport.authenticate('google', {
          scope: ['profile', 'email']
        })
    );
    app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/signup',
        failureRedirect: '/login'
    }));
    app.use('/signup', signinRoute);
    app.use('/login',loginRoute);
    app.use('/',middleware.auth, chatRoute);
}
module.exports  = route;