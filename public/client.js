
const socket = io();
const initTag = new InitTag();
const show_rooms = document.querySelector('#show_rooms');
const show_messages = document.querySelector('#show_messages');
const show_friends = document.querySelector('#show_friends');

//typing_mess
const form_typing_mess = document.querySelector('#form_typing_mess');
//typing_search
const typing_search = document.querySelector('#typing_search');
const typing_search_dropdown = document.querySelector('#typing_search_dropdown');
//modal_body
const modal_body = document.querySelector('.modal__body');
const modal_body_input = modal_body.querySelector('input');
const modal_body_button= modal_body.querySelector('button');

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
    initTag.initInfo(socket, info, show_info, obj);
})
//obj{room}
socket.on('initRoom',(obj)=>{
    initTag.initRoom(socket, info, show_rooms, obj, show_curr_room, show_messages, form_typing_mess);
})
//obj{message};
socket.on('initMess',(obj)=>{
    initTag.initMess(socket, info, obj, show_messages);
})
//obj{id, name, avatar} of friend
socket.on('initFriend',(obj)=>{
    initTag.initFriend(socket, info, show_friends, obj)
})
//obj{name, avatar, _id} of user
socket.on("initSearchResult",(obj)=>{
    console.log(obj);
    initTag.initSearchResult(socket, info, typing_search_dropdown, obj);
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
typing_search.addEventListener('keyup',(e)=>{
    //remove all childNode
    while(typing_search_dropdown.firstChild){
        typing_search_dropdown.removeChild(typing_search_dropdown.firstChild);
    }

    const result = typing_search.value.toLowerCase(); 
    if(result){ 
        socket.emit("typing_search", {
            result: result,
            _id: info._id  
        });
    }
})
//modal_body
modal_body_button.addEventListener('click',()=>{
    let input = modal_body_input.value.trim();
    if(input){
        socket.emit("modal_body-click",{
            name: input,
            user: info._id
        });
        modal.classList.remove('open');
    }
})
//