const order = require('../models/order');

function route (app){
    app.use('/signup',(req, res)=>{
        order.find({},(err, orders)=>{
            if(!err)res.json(orders);
        })
    });
    app.use('/login',(req, res)=>{
        res.render('login');
    })
}
module.exports  = route;