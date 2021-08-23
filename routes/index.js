const user = require('../models/user');

function route (app){
    app.use('/signup',(req, res)=>{

    });

    app.use('/login',(req, res)=>{

        user.find({},(err, data)=>{
            if(!err){
                console.log(data);
                res.cookie('user_id',data[0].id);
            }
        })
        res.render('login');
    })
}
module.exports  = route;