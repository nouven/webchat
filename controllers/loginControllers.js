const user = require("../models/user");
class LoginControllers {
    root(req, res, next){
        res.render('login');
    }
    auth(req, res, next){
        const email= req.body.email;
        const password = req.body.password;
        user.findOne({'email':`${email}`, 'password':`${password}`},'_id',(err, data)=>{
            if(err) return handleError(err);
            if(data!=null){
                res.cookie('user_id', data, { expires: new Date(Date.now() + 3600000), httpOnly: true });
                res.redirect('/');
            }else{
                res.render('login',{mess:"username or password incorrect"})
            }
        });
    }
}
module.exports = new LoginControllers();