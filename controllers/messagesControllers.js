class MessagesControllers{
    root(req, res){
        const info = JSON.stringify(res.locals.info);
        res.render('messages');
    }
}
module.exports = new MessagesControllers();