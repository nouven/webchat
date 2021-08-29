const user = require('./models/user');
const room = require('./models/room');
const { emit } = require('./models/user');
module.exports = function(io, socket){
    console.log(socket.id+" connected!");
    socket.on('disconnect',()=>{
        console.log(socket.id+' disconnected!');
    })
    socket.on('haha',(data)=>{
        console.log(data);
    })
    //init
    socket.on('init',(_id)=>{
        user.findById(_id).then((result)=>{
            socket.emit('initInfo', {
                name :result.name,
                avatar: result.avatar,
            });
            // if(result.friends.length > 0){
            //     result.friends.forEach(elmt=> {
            //         user.findById(elmt).then((result)=>{
            //             socket.emit('initFriend',{
            //                 _id: result._id,
            //                 name: result.name,
            //                 avatar: result.avatar
            //             })
            //         })
            //     });
            // }
        });
        room.find({users:_id}).then((result)=>{
            if(result){
                result.forEach(elmt=>{
                    socket.emit('initRoom',{
                        _id: elmt._id,
                        name: elmt.name,
                        avatar: elmt.avatar
                    })
                })
            }
        })
    })
    // room
    //onclick_room
    //obj is info
    socket.on('onclick_room',obj=>{
        if(obj.befRoom){
            socket.leave(obj.befRoom);
        }
        socket.join(obj.curRoom);
        room.findById(obj.curRoom).then((result)=>{
            if(result.messages.length == 0){
                return;
            }else{
                result.messages.forEach(elmt=>{
                    socket.emit('initMess',elmt);
                })
            }
        })
    })
    //typing_mess-submit
    //obj{name, id ,content, curRoom} of sender
    socket.on('typing_mess-submit',(obj)=>{
        if(obj.curRoom){
            room.findById(obj.curRoom).then((result)=>{
                result.messages.unshift({
                    _id: obj._id,
                    name: obj.name,
                    content: obj.content 
                });
                result.save();
            });
            io.to(obj.curRoom).emit('initMess',({
                _id: obj._id,
                name: obj.name,
                content: obj.content
            }))
        }
    })
}
