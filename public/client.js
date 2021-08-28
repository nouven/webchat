
const socket = io();
const initTag = new InitTag();

const show_room = document.querySelector('#show_rooms');
const show_messages = document.querySelector('#show_messages');
const show_info = document.querySelector('#show_info');
const form_typing_mess = document.querySelector('#form_typing_mess');
const show_curr_room = document.querySelector('#show_curr_room');
const info={
    _id: JSON.parse(user_id.value),
    // userId: user_id.value,
    name: '',
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
    initTag.initInfo(socket, info, show_info, obj);
})
//obj{room}
socket.on('initRoom',(obj)=>{
    initTag.initRoom(socket, info, show_room, obj, show_curr_room, show_messages, form_typing_mess);
})
//obj{message};
socket.on('initMess',(obj)=>{
    initTag.initMess(socket, info, obj, show_messages);
})
socket.on('initfriend',(friend)=>{

})
// typing_mess-submit;
// visibility: visible
form_typing_mess.style.display = "none";
form_typing_mess.addEventListener('submit',(e)=>{
    e.preventDefault();
    const inputText = form_typing_mess.querySelector('input').value;
    form_typing_mess.querySelector('input').value= "";
    if(inputText){
        socket.emit('typing_mess-submit',({
            _id: info._id,
            name: info.name,
            content: inputText,
            curRoom: info.curRoom
        }));
    }
})

