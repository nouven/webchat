const user = require('./models/user');
const room = require('./models/room');
module.exports = function(io, socket){
    console.log(socket.id+" connected!");
    socket.on('disconnect',()=>{
        console.log(socket.id+' disconnected!');
    })
    socket.on('haha',(data)=>{
        console.log(data);
    })
    //init
    socket.on('init',(userId)=>{
        user.findById(userId).then((result)=>{
            socket.emit('initInfo', {
                name :result.name,
                avatar: result.avatar,
            });
            if(result.rooms.length > 0){
                result.rooms.forEach(elmt=> {
                    room.findById(elmt).then((result)=>{
                        socket.emit('initRoom',{
                            id: result._id,
                            name: result.name,
                            avatar: result.avatar
                        })
                    })
                });
            }
            if(result.friends.length > 0){
                result.friends.forEach(elmt=> {
                    user.findById(elmt).then((result)=>{
                        socket.emit('initFriend',{
                            id: result._id,
                            name: result.name,
                            avatar: result.avatar
                        })
                    })
                });
            }
        });
    })
    // room
    //onclick_room
    //obj is info
    socket.on('onclick_room',obj=>{
        if(obj.befRoom){
            socket.leave(obj.befRoom);
        }else{
            room.findById(obj.curRoom).then((result)=>{
                if(result.messages.length == 0){
                    return;
                }else{
                    result.messages.forEach(elmt=>{
                        socket.emit('initMess',elmt);
                    })
                }
            })
        }
    })
    //
}
