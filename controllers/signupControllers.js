class SignupControllers{
    root(req, res){
        res.render('signup');
    }
}
module.exports = new SignupControllers();