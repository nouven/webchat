const user = require('./models/user');
const room = require('./models/room');
const { emit } = require('./models/user');
module.exports = function(io, socket){
    console.log(socket.id+" connected!");
    socket.on('disconnect',(data)=>{
        console.log(socket._id);
        console.log(socket.id+' disconnected!');
    })
//init<==========================================================>
    socket.on('init',(_id)=>{
        socket._id = _id;
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
        room.find({users:_id, type: 1}).then((result)=>{
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
//on-chat<=============================================>
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
        //onclick_friend
        //obj{_id, _id};
    socket.on('onclick_friend',obj=>{
        console.log(obj);
        room.findOne({users: obj._id_2, users:obj._id_1, type: 10}).then(result=>{
            if(result){
                console.log(result._id);
                socket.emit("onclick_friend", result._id);
            }
        });
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
//add member to room<=======================================================>
        //search_friend
    socket.on("search_friend",(obj)=>{
        if(obj.curRoom){
            user.find({keys: obj.result, friends: obj._id, _id:{$ne:obj._id}}).limit(5).then(result=>{
                if(result){
                    result.forEach(elmt=>{
                        socket.emit('initSearchFriendResult',{
                            name: elmt.name,
                            avatar: elmt.avatar,
                            _id: elmt._id
                        })
                    })
                }
            })
        }
    })
    socket.on('add_to_room',obj=>{
        if(obj.curRoom){
            room.findById(obj.curRoom).then(result=>{
                if(result){
                    const arr = result.users.filter(elmt=>{
                        return elmt == obj._id
                    })
                    if(arr.length == 0){
                        result.users.push(obj._id);
                        result.save();
                        io.emit('add_to_room_true',obj);
                    }
                }
            })
        }
    });
    socket.on('add_to_room_true',(obj)=>{
        if(obj.curRoom){
            room.findById(obj.curRoom).then(result=>{
                if(result){
                    socket.emit('initRoom',{
                        _id: result._id,
                        name:result.name,
                        avatar: result.avatar
                    })
                }
            })
        }
    })
// create_room<=============================================================>
    //obj{name, _id of user}
    socket.on("create_room",(obj)=>{
        if(obj.name != ''){
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
        }
    })
//make-friend<==================================================================>
    //search_user //friendReq
    //obj{result of seearch, _id }
    socket.on("search_user",(obj)=>{
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
    //obj{id, id} of sender & receiver
    socket.on('friendReq',obj=>{
        user.findOne({_id: obj.receiver, friendReqs:{$ne: obj.sender}}).then(result=>{
            if(result){
                result.friendReqs.push(obj.sender);
                result.save();
                io.emit("friendReqTrue",obj);
            }
        })
    })
        //data is _id of sender
    socket.on("friendReqTrue",obj=>{
        if(obj){
            user.findById(obj.receiver).then(result=>{
                const lengthOfReq = result.friendReqs.length;
                socket.emit('lengthOfReq', lengthOfReq);
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
        //obj{_id, data};
        //data ; _id of sender
        //_id: _id of receiver
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
            users: [obj._id, obj.data],
            type: 10
        })
        io.emit("acceptFriendReqTrue", obj);
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
