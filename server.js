const user = require('./models/user');
const room = require('./models/room');
const { emit } = require('./models/user');
const peers = [];
module.exports = function(io, socket){
    console.log(socket.id+" connected!");
    socket.on('disconnect',()=>{
        const lastTimeVal = Date.now();
        user.findById(socket._id).then(result=>{
            if(result){
                result.lastTime = lastTimeVal;
                result.save();
            }
        })
        user.find({friends: socket._id}).then(result=>{
            if(result){
                result.forEach(elmt=>{
                    io.emit('offline_status',{
                        lastTime: lastTimeVal,
                        _id_1: socket._id,
                        _id_2: elmt._id
                    })
                })
            }
        });
        const index = peers.findIndex(elmt=>{
            return elmt.userId === socket._id
        })
        if(index != -1){
            peers.splice(index,1);
        }
    })
//init<==========================================================>
    socket.on('init',(_id)=>{
        //online_status
        socket._id = _id;
        socket.on('online_status_2',obj=>{
            io.emit('online_status_2',{
                _id_1: obj._id_2,
                _id_2: obj._id_1
            })
        })
        user.findById(_id).then((result)=>{
            if(result){
                result.lastTime = 0;
                result.save();
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
                    room.findOne({ "users._id":{$all:[elmt._id, _id]}, type: 10}).then(result=>{
                        if(result){
                            const arr = result.users.filter(elmt2=>{
                                return elmt2._id === socket._id;
                            })
                            socket.emit('initFriend',{
                                room_id: result._id,
                                unSeenMess: arr[0].unSeenMess,
                                _id: elmt._id,
                                name: elmt.name,
                                avatar: elmt.avatar,
                                lastTime: elmt.lastTime
                            })
                        }
                    }).then(()=>{
                        io.emit('online_status',{
                            _id_1: socket._id,
                            _id_2: elmt._id
                        })
                    });
                })
            }
        });
        room.find({"users._id":_id, "users.unSeenMess":{$gt:-1} , type: 1}).then((result)=>{
            if(result){
                result.forEach(elmt=>{
                    const arr = elmt.users.filter(elmt=>{
                        return elmt._id === _id;
                    });
                    socket.emit('initRoom',{
                        unSeenMess: arr[0].unSeenMess,
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
            if(result.messages.length != 0){
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
                result.users.forEach(elmt=>{
                    ++elmt.unSeenMess;
                    io.emit('updateUnSeenMess',{
                        curRoom: obj.curRoom,
                        _id: elmt._id,
                        unSeenMess: elmt.unSeenMess
                    })
                })
                result.save();
            });
            let createDate = new Date();
            io.to(obj.curRoom).emit('initMess',({
                createdAt: createDate.toJSON(),
                _id: obj._id,
                name: obj.name,
                avatar:obj.avatar,
                content: obj.content
            }))
        }
    })
    //obj{curRoom};
    socket.on('typing_mess-keyup', obj=>{
        socket.to(obj.curRoom).emit('typing', obj);
    })
    socket.on('updateUnSeenMess',obj=>{
        room.findById(obj.curRoom).then((result)=>{
            if(result){
                const arr = result.users.filter(elmt=>{
                    return elmt._id === obj._id;
                });
                if(arr.length){
                    arr[0].unSeenMess = 0;
                }
                socket.emit('updateUnSeenMess',{
                    curRoom: obj.curRoom,
                    _id: obj._id,
                    unSeenMess: 0
                })
                result.save();
            }
        });
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
                        return elmt._id == obj._id
                    })
                    if(arr.length == 0){
                        result.users.push({_id: obj._id});
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
                    const arr = result.users.filter(elmt=>{
                        return elmt._id === obj._id
                    })
                    socket.emit('initRoom',{
                        unSeenMess: 0,
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
                users: {_id: obj.user}
            }).then(()=>{
                room.findOne({name: obj.name, users:{_id: obj.user}}).then(result=>{
                    if(result){
                        socket.emit('initRoom',{
                            unSeenMess: 0,
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
                if(result){
                    socket.emit('lengthOfReq', result.friendReqs.length);
                }
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
        }).then(()=>{
            room.create({
                users: [{_id: obj._id}, {_id:obj.data}],
                type: 10
            })
        }).then(()=>{
            user.findById(obj.data).then(result =>{
                if(result){
                    result.friends.push(obj._id);
                    result.save();
                    const name = result.name;
                    const avatar = result.avatar;
                    room.findOne({ "users._id":{$all:[obj._id, obj.data]}, type: 10}).then(result=>{
                        if(result){
                            const arr = result.users.filter(elmt2=>{
                                return elmt2._id === obj._id;
                            })
                            socket.emit('initFriend',{
                                room_id: result._id,
                                unSeenMess: arr[0].unSeenMess,
                                _id: obj.data,
                                name: name,
                                avatar: avatar,
                            })
                        }
                    })
                }
            })
        }).then(()=>{
            io.emit("acceptFriendReqTrue", obj);
        })
    })
    socket.on("acceptFriendReqTrue",(obj)=>{
        user.findById(obj._id).then(result=>{
            if(result){
                const name = result.name;
                const avatar = result.avatar;
                room.findOne({ "users._id":{$all:[obj._id, obj.data]}, type: 10}).then(result=>{
                    if(result){
                        const arr = result.users.filter(elmt2=>{
                            return elmt2._id === obj.data;
                        })
                        socket.emit('initFriend',{
                            room_id: result._id,
                            unSeenMess: arr[0].unSeenMess,
                            _id: obj._id,
                            name: name,
                            avatar: avatar,
                        })
                    }
                }).then(()=>{
                        io.emit('online_status',{
                            _id_1: socket._id,
                            _id_2: obj._id
                        })
                });
            }
        })
    })
    //obj{curRoom};
    socket.on('show_member', obj=>{
        room.findById(obj.curRoom).then(result=>{
            if(result){
                result.users.forEach(elmt=>{
                    user.findById(elmt._id).then(result=>{
                        if(result){
                            socket.emit('show_member',{
                                name: result.name,
                                avatar: result.avatar,
                                _id: result._id
                            })
                        }
                    })
                })
            }
        })
    })
    //video_call
    socket.on('initPeer',obj=>{
        peers.push(obj);
    })
    socket.on('calling',obj=>{
        user.findById(obj.userId).then(result=>{
            if(result){
                io.emit('answerCall',{
                    _id: obj.friendId,
                    avatar: result.avatar,
                    name: result.name
                })
            }
        })
        const peer = peers.find(elmt =>{
            return elmt.userId === obj.friendId
        })
        if(peer){
            socket.emit('calling',{
                peerId: peer.peerId
            })
        }else{
            socket.emit('calling',{
                peerId: 'null'
            })
        }
    })
}
