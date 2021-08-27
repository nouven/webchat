const user = require('../models/user');
class Middlewares{
    auth(req, res, next){
        if(!req.cookies.user_id){
            res.redirect('/login');
        }else{
            let user_id = req.cookies.user_id;
            let arr = user_id.split('/');
            user.findOne({_id: arr[0], password: arr[1]}).then((data)=>{
                if(!data){
                    res.redirect('/login');
                }else{
                    //arr[0] == user._id
                    res.locals.user_id = arr[0];
                    next();
                }
            })
        }
    }
    signupAuth(req, res, next){
        const name = req.body.name;
        const email= req.body.email;
        const password= req.body.password;
        const repassword= req.body.repassword;
        if(!name || !email || !password || !repassword){
            res.render('signup',{errMess: 'err'});
            return;
        }else{
            user.findOne({email:`${email}`}).then((result)=>{
                if(result) {
                    res.render('signup',{errMess: 'email already exists'});
                    return;
                }else{
                    const newUser = new user({
                        name: name,
                        email: email,
                        password: password
                    });
                    newUser.save();
                    next();
                }
            })
        }
    }

}
module.exports = new Middlewares();