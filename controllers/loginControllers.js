const user = require("../models/user");
class LoginControllers {
    root(req, res){
        res.render('login');
    }
    auth(req, res, next){
        const email= req.body.email;
        const password = req.body.password;
        user.findOne({'email':`${email}`, 'password':`${password}`},(err, data)=>{
            if(data){
                const cookie = data._id+"/"+data.password;
                res.cookie('user_id', cookie, { expires: new Date(Date.now() + 60*60*1000) /*,httpOnly: true */ });
                res.redirect('/');
            }else{
                res.render('login',{mess:"username or password incorrect"})
            }
        });
    }
}
module.exports = new LoginControllers();