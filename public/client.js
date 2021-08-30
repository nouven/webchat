
const socket = io();
const initTag = new InitTag();
const show_rooms = document.querySelector('#show_rooms');
const show_messages = document.querySelector('#show_messages');
const show_friends = document.querySelector('#show_friends');

//typing_mess
const form_typing_mess = document.querySelector('#form_typing_mess');
//typing_search_user
const typing_search_users = document.querySelector('#typing_search_users');
const typing_search_users_dropdown = document.querySelector('#typing_search_users_dropdown');
//modal_body_create_room
const input_create_room = document.querySelector('#input_create_room');
const btn_create_room = document.querySelector('#btn_create_room');
//modal_friend_reqs
const friend_reqs = document.querySelector('#friend_reqs');
const length_of_req = document.querySelector('#length_of_req');

//
const show_info = document.querySelector('#show_info');
const show_curr_room = document.querySelector('#show_curr_room');
const info={
    _id: JSON.parse(user_id.value),
    name: '',
    avatar:"",
    curRoom : '',
    befRoom :'',
}
// show_messages.addEventListener('scroll',()=>{
//     console.log( parseInt(show_messages.scrollTop));
//     childTag = show_messages.querySelector('.chat__sender');
//     console.log(childTag);
//     console.log("height: "+ childTag.offsetHeight);
   
// })

//init
socket.emit("init", info._id);
//obj{info};
socket.on('initInfo',(obj)=>{
    initTag.info(socket, info, show_info, obj);
})
//obj{room}
socket.on('initRoom',(obj)=>{
    initTag.room(socket, info, show_rooms, obj, show_curr_room, show_messages, form_typing_mess);
})
//obj{message};
socket.on('initMess',(obj)=>{
    initTag.mess(socket, info, obj, show_messages);
})
//obj{id, name, avatar} of friend
socket.on('initFriend',(obj)=>{
    initTag.friend(socket, info, show_friends, obj)
})
//obj{name, avatar, _id} of user
socket.on("initSearchUserResult",(obj)=>{
    initTag.userSearchResult(socket, info, typing_search_users_dropdown, obj);
})
socket.on('lengthOfReq',data=>{
    length_of_req.innerHTML = data
})
socket.on("initFriendReq",(obj)=>{
    initTag.friendReq(socket, info, friend_reqs, obj);
})
//accep_friend_req
socket.on("acceptFriendReq",obj=>{
    if(obj.data === info._id){
        socket.emit('acceptFriendReqTrue', obj);
    }
})
// typing_mess-submit;
// visibility: visible
form_typing_mess.style.display = "none";
form_typing_mess.addEventListener('submit',(e)=>{
    e.preventDefault();
    const inputText = form_typing_mess.querySelector('input').value.trim();
    form_typing_mess.querySelector('input').value= "";
    if(inputText){
        socket.emit('typing_mess-submit',({
            _id: info._id,
            name: info.name,
            avatar: info.avatar,
            content: inputText,
            curRoom: info.curRoom
        }));
    }
})

//typing_search-onkey
typing_search_users.addEventListener('keyup',(e)=>{
    //remove all childNode
    while(typing_search_users_dropdown.firstChild){
        typing_search_users_dropdown.removeChild(typing_search_users_dropdown.firstChild);
    }

    const result = typing_search_users.value.toLowerCase(); 
    if(result){ 
        socket.emit("typing_search_users", {
            result: result,
            _id: info._id  
        });
    }
})
//modal_body
btn_create_room.addEventListener('click',()=>{
    let input = input_create_room.value.trim();
    input_create_room.value = "";
    if(input){
        socket.emit("create_room",{
            name: input,
            user: info._id
        });
    }
})
//friend_req
socket.on("friendReq",obj =>{
    if(obj.receiver === info._id){
        socket.emit("friendReqTrue",obj);
    }
})