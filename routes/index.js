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
            console.log(req.file.path);
            console.log(avatar);
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
    passport.authenticate('google', { session: false, failureRedirect: '/signup' }),
    function(req, res) {
        if(req.user != null){
            const _id = req.user.id;
            const name = req.user.name.familyName +" "+req.user.name.givenName;
            const email = req.user.email;
            user.findOne({email: email}).then(result=>{
                if(result == null){
                    user.create({
                        name: name,
                        email: email,
                        keys: generateKeywords(name.toLowerCase()),
                        password: 'temppass'
                    }).then(()=>{
                        user.findOne({email: email}).then(result=>{
                            if(result){
                                const cookie = result._id+"/"+result.password;
                                res.cookie('user_id', cookie, { expires: new Date(Date.now() + 72*60*60*1000) /*,httpOnly: true */ });
                                res.redirect('/');
                                return;
                            }
                        });
                    });
                }else{
                    user.findOne({email: email}).then(result=>{
                        if(result){
                            const cookie = result._id+"/"+result.password;
                            res.cookie('user_id', cookie, { expires: new Date(Date.now() + 60*60*1000) /*,httpOnly: true */ });
                            res.redirect('/');
                            return;
                        }else{
                            res.redirect('/signup');
                        }
                    })
                 }
            })
        }
    })

    // app.get( '/auth/google/callback',
    // passport.authenticate( 'google', {
    //     successRedirect: '/signup',
    //     failureRedirect: '/login'
    // }));
    app.use('/signup', signinRoute);
    app.use('/login',loginRoute);
    app.use('/',middleware.auth, chatRoute);
}
module.exports  = route;
const generateKeywords = (displayName) => {
    // liet ke tat cac hoan vi. vd: name = ["David", "Van", "Teo"]
    // => ["David", "Van", "Teo"], ["David", "Teo", "Van"], ["Teo", "David", "Van"],...
    const name = displayName.split(' ').filter((word) => word);
  
    const length = name.length;
    let flagArray = [];
    let result = [];
    let stringArray = [];
  
    /**
     * khoi tao mang flag false
     * dung de danh dau xem gia tri
     * tai vi tri nay da duoc su dung
     * hay chua
     **/
    for (let i = 0; i < length; i++) {
      flagArray[i] = false;
    }
  
    const createKeywords = (name) => {
      const arrName = [];
      let curName = '';
      name.split('').forEach((letter) => {
        curName += letter;
        arrName.push(curName);
      });
      return arrName;
    };
  
    function findPermutation(k) {
      for (let i = 0; i < length; i++) {
        if (!flagArray[i]) {
          flagArray[i] = true;
          result[k] = name[i];
  
          if (k === length - 1) {
            stringArray.push(result.join(' '));
          }
  
          findPermutation(k + 1);
          flagArray[i] = false;
        }
      }
    }
  
    findPermutation(0);
  
    const keywords = stringArray.reduce((acc, cur) => {
      const words = createKeywords(cur);
      return [...acc, ...words];
    }, []);
  
    return keywords;
  };