class SignupControllers{
    root(req, res){
        res.render('signup');
    }
    toLogin(req, res){
        res.redirect('/login');
    }
}
module.exports = new SignupControllers();