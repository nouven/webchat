class MessagesControllers{
    root(req, res){
        const info = JSON.stringify(res.locals.info);
        localStorage.setItem('info', info)
        res.render('messages');
    }
}
module.exports = new MessagesControllers();