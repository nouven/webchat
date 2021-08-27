class MessagesControllers{
    root(req, res){
        const user_id = JSON.stringify(res.locals.user_id);
        // console.log(user_id);
        res.render('chat',{user_id: user_id});
    }
}
module.exports = new MessagesControllers();