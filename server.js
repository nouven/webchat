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
            if(result){
                socket.emit('initInfo', {
                    name :result.name,
                    avatar: result.avatar,
                });
                if(result.friendReqs.length != 0){
                    socket.emit('lengthOfReq', result.friendReqs.length);
                    result.friendReqs.forEach(elmt=>{
                        user.findById(elmt).then(result=>{
                            if(result){
                                socket.emit('initFriendReq',{
                                    _id: result._id,
                                    name:result.name,
                                    avatar:result.avatar
                                })
                            }
                        })
                    })
                }
            }
        });
        user.find({friends: _id}).then(result=>{
            if(result){
                result.forEach(elmt=>{
                    socket.emit('initFriend',{
                        _id: elmt._id,
                        name: elmt.name,
                        avatar: elmt.avatar,
                    })
                })
            }
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
                result.messages.push({
                    _id: obj._id,
                    name: obj.name,
                    avatar:obj.avatar,
                    content: obj.content 
                });
                result.save();
            });
            io.to(obj.curRoom).emit('initMess',({
                _id: obj._id,
                name: obj.name,
                avatar:obj.avatar,
                content: obj.content
            }))
        }
    })
    //typing_search_users
    //obj{result of seearch, _id }
    socket.on("typing_search_users",(obj)=>{
        user.find({keys: obj.result, friends:{$ne: obj._id}, _id:{$ne:obj._id}}).limit(5).then(result=>{
            if(result){
                result.forEach(elmt=>{
                    socket.emit('initSearchUserResult',{
                        name: elmt.name,
                        avatar: elmt.avatar,
                        _id: elmt._id
                    })
                })
            }
        })
    })
    // create_room
    //obj{name, _id of user}
    socket.on("create_room",(obj)=>{
        room.create({
            name: obj.name,
            users: obj.user
        }).then(()=>{
            room.findOne({name: obj.name, users: obj.user}).then(result=>{
                if(result){
                    socket.emit('initRoom',{
                        _id: result._id,
                        name: result.name,
                        avatar: result.avatar
                    })
                }
            })
        })
    })
    //friendReq
    //obj{id, id} of sender & receiver
    socket.on('friendReq',obj=>{
        user.findOne({_id: obj.receiver, friendReqs:{$ne: obj.sender}}).then(result=>{
            if(result){
                result.friendReqs.push(obj.sender);
                result.save();
                io.emit("friendReq",obj);
            }
        })
    })
        //data is _id of sender
    socket.on("friendReqTrue",obj=>{
        if(obj){
            user.findById(obj.receiver).then(result=>{
                socket.emit('lengthOfReq', result.friendReqs.length);
            })
            user.findById(obj.sender).then(result=>{
                if(result){
                    socket.emit('initFriendReq', {
                        _id: result._id,
                        name: result.name,
                        avatar: result.avatar
                    })
                }
            })
        }
    });
    //delete or accept friendReq
        //obj{_id, data};j
    socket.on("deleteFriendReq", obj =>{
        user.findById(obj._id).then(result=>{
            if(result){
                let arr = result.friendReqs.filter(elmt=>{
                    return elmt != obj.data;
                })
                result.friendReqs = arr;
                result.save();
                socket.emit('lengthOfReq',arr.length);
            }
        })
    })
    socket.on("acceptFriendReq", obj=>{
        user.findById(obj._id).then(result=>{
            if(result){
                let arr = result.friendReqs.filter(elmt=>{
                    return elmt != obj.data;
                })
                result.friendReqs = arr;
                socket.emit('lengthOfReq',arr.length);
                result.friends.push(obj.data);
                result.save();
            }
        })
        user.findById(obj.data).then(result =>{
            if(result){
                result.friends.push(obj._id);
                result.save();
                socket.emit("initFriend",{
                    _id: result._id,
                    name: result.name,
                    avatar:result.avatar
                })
            }
        })
        room.create({

            
        })
        io.emit("acceptFriendReq", obj);
    })
    socket.on("acceptFriendReqTrue",(obj)=>{
        user.findById(obj._id).then(result=>{
            if(result){
                socket.emit("initFriend",{
                    _id: result._id,
                    name: result.name,
                    avatar:result.avatar
                })
            }
        })
    })
    //
}
