const user = require('../models/user');
class Middlewares{
    auth(req, res, next){
        if(!req.cookies.user_id){
            res.redirect('/login');
        }else{
            const user_id = req.cookies.user_id;
            user.findById(user_id, function (err, doc) {
                if(doc!= null){
                    res.locals.info = doc;
                    next();
                }else{
                    res.redirect('/login');
                }
            });
        }
    }
}
module.exports = new Middlewares();